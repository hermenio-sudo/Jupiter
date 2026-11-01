import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_BATCHES, DAYS_BETWEEN_BATCHES } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Menu, X } from "lucide-react";
import { triggerAd } from "@/lib/adsterra";

export const Route = createFileRoute("/_authenticated/avaliacoes")({
  head: () => ({
    meta: [{ title: "Jupiter — Avaliar Projetos" }],
  }),
  component: AvaliacoesWrapper,
});

function AvaliacoesWrapper() {
  return (
    <LanguageProvider>
      <Avaliacoes />
    </LanguageProvider>
  );
}

// ── Constants ────────────────────────────────────────────────────────────────
const MIN_WITHDRAW = 10;
const MIN_CHARS = 30;
const WAIT_MS = DAYS_BETWEEN_BATCHES * 24 * 60 * 60 * 1000;
const fmt = (n: number) => `$${n.toFixed(2)}`;

// ── localStorage helpers ─────────────────────────────────────────────────────
const key = (uid: string, s: string) => `jupiter_${uid}_${s}`;
const loadBalance = (uid: string) =>
  parseFloat(localStorage.getItem(key(uid, "balance")) ?? "0") || 0;
const saveBalance = (uid: string, v: number) =>
  localStorage.setItem(key(uid, "balance"), v.toFixed(2));
const loadDoneIds = (uid: string): Set<string> => {
  try {
    const raw = localStorage.getItem(key(uid, "done"));
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
};
const saveDoneIds = (uid: string, ids: Set<string>) =>
  localStorage.setItem(key(uid, "done"), JSON.stringify([...ids]));
// batchIndex: which batch the user is currently on (0-based)
const loadBatchIndex = (uid: string) =>
  parseInt(localStorage.getItem(key(uid, "batchIndex")) ?? "0", 10) || 0;
const saveBatchIndex = (uid: string, v: number) =>
  localStorage.setItem(key(uid, "batchIndex"), String(v));
// batchCompletedAt: timestamp (ms) when the current batch was finished
const loadBatchCompletedAt = (uid: string): number | null => {
  const raw = localStorage.getItem(key(uid, "batchCompletedAt"));
  return raw ? parseInt(raw, 10) : null;
};
const saveBatchCompletedAt = (uid: string, ts: number) =>
  localStorage.setItem(key(uid, "batchCompletedAt"), String(ts));

// ── Button styles ────────────────────────────────────────────────────────────
const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:bg-muted";

// ── Countdown helper ─────────────────────────────────────────────────────────
function useCountdown(targetMs: number | null) {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (targetMs === null) return;
    const tick = () => setRemaining(Math.max(0, targetMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  return { remaining, days, hours, minutes, seconds };
}

// ────────────────────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────────────────────
function Avaliacoes() {
  const { t, toggle } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [balance, setBalance] = useState(0);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [batchIndex, setBatchIndex] = useState(0);
  const [batchCompletedAt, setBatchCompletedAt] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const uid = data.user.id;
      setUserId(uid);
      setBalance(loadBalance(uid));
      setDoneIds(loadDoneIds(uid));
      setBatchIndex(loadBatchIndex(uid));
      setBatchCompletedAt(loadBatchCompletedAt(uid));
      setLoading(false);
    });
  }, []);

  // Current batch of projects
  const currentBatch = PROJECT_BATCHES[batchIndex % PROJECT_BATCHES.length];
  const batchDoneCount = currentBatch.filter((p) => doneIds.has(p.id)).length;
  const batchComplete = batchDoneCount === currentBatch.length;

  // When did the wait period end?
  const unlockAt = batchCompletedAt !== null ? batchCompletedAt + WAIT_MS : null;
  const waitOver = unlockAt !== null && Date.now() >= unlockAt;

  // Countdown ticker
  const { days, hours, minutes, seconds, remaining } = useCountdown(
    batchComplete && !waitOver ? unlockAt : null,
  );

  // Check every second if the wait is over to unlock next batch
  useEffect(() => {
    if (!batchComplete || waitOver || unlockAt === null) return;
    if (remaining <= 0) {
      // Advance to next batch
      if (!userId) return;
      const next = batchIndex + 1;
      setBatchIndex(next);
      saveBatchIndex(userId, next);
      setBatchCompletedAt(null);
      localStorage.removeItem(key(userId, "batchCompletedAt"));
    }
  }, [remaining, batchComplete, waitOver, batchIndex, unlockAt, userId]);

  // Called by ProjectCard on submit
  const handleReviewDone = useCallback(
    (projectId: string, reward: number) => {
      if (!userId) return;
      const newBalance = balance + reward;
      const newDone = new Set([...doneIds, projectId]);
      setBalance(newBalance);
      setDoneIds(newDone);
      saveBalance(userId, newBalance);
      saveDoneIds(userId, newDone);

      // Check if this completes the batch
      const newBatchDone = currentBatch.filter((p) => newDone.has(p.id)).length;
      if (newBatchDone === currentBatch.length && batchCompletedAt === null) {
        const now = Date.now();
        setBatchCompletedAt(now);
        saveBatchCompletedAt(userId, now);
      }
    },
    [userId, balance, doneIds, currentBatch, batchCompletedAt],
  );

  async function signOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSigningOut(false);
      setSignOutError("Não foi possível sair. Tente novamente.");
      return;
    }
    await navigate({ to: "/auth", replace: true });
  }

  const goProjects = () =>
    document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth" });

  // Total reward for current batch
  const batchTotal = currentBatch.reduce((s, p) => s + p.reward, 0);

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <img src="/logo.png" alt="Jupiter" className="h-8 w-8 rounded-lg object-contain" />
            Jupiter<span className="text-primary">.</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={toggle}
              className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground transition hover:bg-muted"
              aria-label="Toggle language"
            >
              {t("lang_toggle")}
            </button>
            <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
              {t("balance_label")}{" "}
              <strong className="text-primary">{loading ? "…" : fmt(balance)} USD</strong>
            </div>
            <button className={btnGhost} onClick={() => setOpen(true)}>
              {t("nav_withdraw")}
            </button>
            <button className={btnPrimary} onClick={goProjects}>
              {t("nav_rate")}
            </button>
            <Button variant="ghost" disabled={signingOut} onClick={signOut}>
              {signingOut ? "…" : t("nav_signout")}
            </Button>
          </div>

          {/* Mobile: saldo + hamburguer */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs">
              <strong className="text-primary">{loading ? "…" : fmt(balance)}</strong>
              <span className="text-muted-foreground"> USD</span>
            </div>
            <button
              className="rounded-md border border-border bg-secondary p-2 text-secondary-foreground transition hover:bg-muted"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="absolute left-0 right-0 top-full z-40 border-b border-border bg-card px-4 py-3 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-2">
              <button
                className={`${btnPrimary} w-full`}
                onClick={() => { goProjects(); setMobileMenuOpen(false); }}
              >
                {t("nav_rate")}
              </button>
              <button
                className={`${btnGhost} w-full`}
                onClick={() => { setOpen(true); setMobileMenuOpen(false); }}
              >
                {t("nav_withdraw")}
              </button>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={toggle}
                  className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground transition hover:bg-muted"
                >
                  {t("lang_toggle")}
                </button>
                <Button
                  variant="ghost"
                  disabled={signingOut}
                  className="text-sm"
                  onClick={() => { setMobileMenuOpen(false); void signOut(); }}
                >
                  {signingOut ? "…" : t("nav_signout")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {signOutError && (
        <div className="border-b border-destructive/40 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {signOutError}
        </div>
      )}

      {/* ── Hero ── */}
      <section className="bg-glow">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
          <span className="inline-block rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {t("aval_badge")}
          </span>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {t("aval_h1_a")}{" "}
            <span className="text-primary">{t("aval_h1_b")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t("aval_sub")}
          </p>
          {!batchComplete && (
            <button
              className={`${btnPrimary} mt-8 px-7 py-3.5 text-base`}
              onClick={goProjects}
            >
              {t("aval_cta")}
            </button>
          )}
        </div>
      </section>

      {/* ── Projects / Waiting screen ── */}
      <section id="projetos" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16">

        {loading ? (
          <div className="text-center text-muted-foreground">A carregar…</div>

        ) : batchComplete && !waitOver ? (
          /* ── Waiting screen ── */
          <WaitingScreen
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            batchIndex={batchIndex}
            totalBatches={PROJECT_BATCHES.length}
          />

        ) : (
          /* ── Active batch ── */
          <>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-3xl font-bold">{t("aval_section_title")}</h2>
              <span className="text-sm text-muted-foreground">
                Lote {(batchIndex % PROJECT_BATCHES.length) + 1}/{PROJECT_BATCHES.length}
              </span>
            </div>
            <p className="mt-1 text-center text-muted-foreground">
              {t("aval_section_sub_a")} {currentBatch.length} {t("aval_section_sub_b")}{" "}
              {fmt(batchTotal)} {t("aval_section_sub_c")}
            </p>
            {/* Progress bar */}
            <div className="mt-5 overflow-hidden rounded-full bg-secondary" style={{ height: 6 }}>
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(batchDoneCount / currentBatch.length) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {batchDoneCount}/{currentBatch.length} avaliados
            </p>

            <div className="mt-6 grid gap-6">
              {currentBatch.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  alreadyDone={doneIds.has(p.id)}
                  onDone={handleReviewDone}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Withdraw methods ── */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">{t("withdraw_title")}</h2>
        <p className="mt-2 text-muted-foreground">
          {t("withdraw_sub")} {fmt(MIN_WITHDRAW)} USD
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["PayPal", t("withdraw_paypal_desc")],
              ["Payoneer", t("withdraw_payoneer_desc")],
            ] as [string, string][]
          ).map(([name, desc]) => (
            <div key={name} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-2xl font-bold">{name}</div>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <button className={`${btnPrimary} mt-8`} onClick={() => setOpen(true)}>
          {t("nav_withdraw")}
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p>{t("footer_rights")}</p>
          <div className="flex gap-4">
            <a href="/privacidade" className="hover:text-foreground">{t("footer_privacy")}</a>
            <a href="/termos" className="hover:text-foreground">{t("footer_terms")}</a>
          </div>
          <div className="flex gap-2">
            {["PayPal", "Payoneer"].map((m) => (
              <span key={m} className="rounded-md border border-border bg-card px-3 py-1 text-xs font-bold text-foreground">
                🔒 {m}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {open && (
        <WithdrawModal balance={balance} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WaitingScreen
// ─────────────────────────────────────────────────────────────────────────────
function WaitingScreen({
  days, hours, minutes, seconds, batchIndex, totalBatches,
}: {
  days: number; hours: number; minutes: number; seconds: number;
  batchIndex: number; totalBatches: number;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const nextBatch = (batchIndex % totalBatches) + 2 > totalBatches
    ? 1
    : (batchIndex % totalBatches) + 2;

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-accent text-4xl">
        ⏳
      </div>
      <h2 className="mt-6 text-2xl font-bold">Lote concluído!</h2>
      <p className="mt-3 max-w-sm text-muted-foreground">
        Avaliaste os 4 projetos deste lote. Os próximos projetos (Lote {nextBatch}) ficam disponíveis em:
      </p>

      {/* Countdown */}
      <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "Dias", value: days },
          { label: "Horas", value: hours },
          { label: "Min", value: minutes },
          { label: "Seg", value: seconds },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center rounded-2xl border border-border bg-card px-2 py-3 sm:px-5 sm:py-4">
            <span className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
              {pad(value)}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Enquanto isso, continua a acumular saldo avaliando os lotes anteriores ou aguarda os novos projetos.
      </p>
      <div className="mt-4 rounded-xl border border-border bg-card px-6 py-4 text-sm">
        <span className="text-muted-foreground">Lote </span>
        <strong>{(batchIndex % totalBatches) + 1}</strong>
        <span className="text-muted-foreground"> de </span>
        <strong>{totalBatches}</strong>
        <span className="text-muted-foreground"> concluído · próximo lote em </span>
        <strong className="text-primary">{days}d {pad(hours)}h {pad(minutes)}m</strong>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjectCard
// ─────────────────────────────────────────────────────────────────────────────
function ProjectCard({
  project, alreadyDone, onDone,
}: {
  project: Project;
  alreadyDone: boolean;
  onDone: (projectId: string, reward: number) => void;
}) {
  const { t } = useLanguage();
  const [score, setScore] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(alreadyDone);
  const [expanded, setExpanded] = useState(false);

  const len = text.trim().length;
  const canSend = !submitted && score !== null && len >= MIN_CHARS;

  const submit = () => {
    if (!canSend) return;
    onDone(project.id, project.reward);
    setSubmitted(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* ── Card header ── */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-muted-foreground">{project.category}</span>
          <h3 className="mt-0.5 truncate text-base font-bold leading-snug">{project.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          +{fmt(project.reward)}
        </span>
      </div>

      <div className="border-t border-border px-5 pb-5 pt-4">
        {/* Focus — always visible, short */}
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">{t("card_what")}</strong>{" "}
          {project.focus}
        </p>

        {/* Description — collapsible */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          {expanded ? "▲ Menos detalhes" : "▼ Ver descrição do projeto"}
        </button>
        {expanded && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}

        {submitted ? (
          <div className="mt-5 rounded-lg border border-primary bg-accent p-3 text-sm text-accent-foreground">
            <p className="font-semibold">{t("card_submitted")}</p>
            <p className="mt-0.5 text-xs">{t("card_success_a")} {fmt(project.reward)} {t("card_success_b")}</p>
          </div>
        ) : (
          <>
            {/* Score — star rating */}
            <p className="mt-5 text-sm font-semibold">{t("card_score_label")}</p>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setScore(n * 2)}
                  aria-label={`${n * 2} de 10`}
                  className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                    score !== null && n <= score / 2
                      ? "text-primary drop-shadow-[0_0_6px_currentColor]"
                      : "text-border hover:text-primary/60"
                  }`}
                >
                  ★
                </button>
              ))}
              {score !== null && (
                <span className="ml-2 self-center text-sm font-bold text-primary">
                  {score}/10
                </span>
              )}
            </div>

            {/* Justification */}
            <textarea
              id={`just-${project.id}`} rows={3} value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("card_justification_placeholder")}
              className="mt-4 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-ring"
            />
            <p className={`mt-1 text-xs ${len >= MIN_CHARS ? "text-primary" : "text-muted-foreground"}`}>
              {len}/{MIN_CHARS} {t("card_chars_min")}
            </p>

            <button className={`${btnPrimary} mt-4 w-full py-2.5`} disabled={!canSend} onClick={() => { triggerAd(); submit(); }}>
              {`${t("card_submit_a")} ${fmt(project.reward)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WithdrawModal
// ─────────────────────────────────────────────────────────────────────────────
function WithdrawModal({ balance, onClose }: { balance: number; onClose: () => void }) {
  const { t } = useLanguage();
  const [method, setMethod] = useState<"PayPal" | "Payoneer">("PayPal");
  const [account, setAccount] = useState("");
  const [tried, setTried] = useState(false);
  const canTry = balance >= MIN_WITHDRAW;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-3 backdrop-blur sm:p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{t("wdraw_title")}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">✕</button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("wdraw_avail_a")} <strong className="text-primary">{fmt(balance)} USD</strong> {t("wdraw_avail_b")} {fmt(MIN_WITHDRAW)}
        </p>

        {!canTry && (
          <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-400">
            Faltam {fmt(MIN_WITHDRAW - balance)} para atingir o mínimo de saque. Continue avaliando projetos!
          </div>
        )}

        {canTry && !tried && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {(["PayPal", "Payoneer"] as const).map((m) => (
                <label key={m} className={`cursor-pointer rounded-lg border p-3 text-center font-semibold ${method === m ? "border-primary bg-accent text-accent-foreground" : "border-border bg-secondary"}`}>
                  <input type="radio" name="method" className="sr-only" checked={method === m} onChange={() => setMethod(m)} />
                  {m}
                </label>
              ))}
            </div>
            <label className="mt-4 block text-sm font-semibold" htmlFor="acc">
              {method === "PayPal" ? t("wdraw_paypal_label") : t("wdraw_payoneer_label")}
            </label>
            <input id="acc" value={account} onChange={(e) => setAccount(e.target.value)}
              placeholder={method === "PayPal" ? t("wdraw_paypal_placeholder") : t("wdraw_payoneer_placeholder")}
              className="mt-2 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-ring"
            />
            <button className={`${btnPrimary} mt-5 w-full py-3`} disabled={!account.trim()} onClick={() => { triggerAd(); setTried(true); }}>
              {t("wdraw_btn")}
            </button>
          </>
        )}

        {tried && (
          <div className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
            <p className="font-semibold">⏳ Saque em processamento</p>
            <p className="mt-2 leading-relaxed text-amber-400/90">
              O seu pedido de saque de <strong>{fmt(balance)}</strong> via {method} foi recebido.
              Os saques estão temporariamente suspensos enquanto efectuamos uma manutenção no sistema de pagamentos.
              Assim que o sistema for restaurado, o seu pagamento será processado automaticamente.
            </p>
            <p className="mt-3 text-xs text-amber-500">Agradecemos a sua paciência.</p>
          </div>
        )}
      </div>
    </div>
  );
}
