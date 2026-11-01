import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PROJECTS } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { triggerAd } from "@/lib/adsterra";

const MIN_WITHDRAW = 10;
const fmt = (n: number) => `$${n.toFixed(2)}`;
const minReward = Math.min(...PROJECTS.map((p) => p.reward));
const maxReward = Math.max(...PROJECTS.map((p) => p.reward));
const totalReward = PROJECTS.reduce((s, p) => s + p.reward, 0);

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-110";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:bg-muted";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jupiter — Ganhe em dólares avaliando projetos" },
      {
        name: "description",
        content:
          "Avalie projetos reais, dê sua nota e justificativa, e ganhe em dólares via PayPal ou Payoneer. Cadastre-se no Jupiter.",
      },
      { property: "og:title", content: "Jupiter — Ganhe em dólares avaliando projetos" },
      {
        property: "og:description",
        content: "Avalie projetos e receba recompensas em USD via PayPal ou Payoneer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingWrapper,
});

function LandingWrapper() {
  return (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  );
}

function Landing() {
  const { t, toggle } = useLanguage();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.user));
    });
    return () => {
      active = false;
    };
  }, []);

  const ctaLabel = signedIn ? t("nav_continue") : t("nav_start");

  const goHowItWorks = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <img src="/logo.png" alt="Jupiter" className="h-8 w-8 rounded-lg object-contain" />
            Jupiter<span className="text-primary">.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground transition hover:bg-muted"
              aria-label="Toggle language"
            >
              {t("lang_toggle")}
            </button>
            <Button variant="ghost" asChild>
              <Link to="/auth">{t("nav_login")}</Link>
            </Button>
            <Link to={signedIn ? "/avaliacoes" : "/auth"} className={btnPrimary}>
              {ctaLabel}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-glow">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <span className="inline-block rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {t("hero_badge")}
          </span>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
            {t("hero_h1_a")} <span className="text-primary">{t("hero_h1_highlight")}</span>{" "}
            {t("hero_h1_b")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">{t("hero_sub")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to={signedIn ? "/avaliacoes" : "/auth"}
              className={`${btnPrimary} w-full px-7 py-3.5 text-base sm:w-auto`}
              onClick={() => triggerAd()}
            >
              {ctaLabel}
            </Link>
            <button className={`${btnGhost} w-full px-6 py-3.5 text-base sm:w-auto`} onClick={() => { triggerAd(); goHowItWorks(); }}>
              {t("hero_cta_secondary")}
            </button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {t("hero_footnote_a")} {fmt(minReward)} {t("hero_footnote_b")} {fmt(maxReward)}{" "}
            {t("hero_footnote_c")} {PROJECTS.length} {t("hero_footnote_d")} {fmt(MIN_WITHDRAW)} USD
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="como-funciona"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16"
      >
        <h2 className="text-center text-3xl font-bold">{t("how_title")}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(
            [
              [t("how_1_title"), t("how_1_desc")],
              [t("how_2_title"), t("how_2_desc")],
              [t("how_3_title"), t("how_3_desc")],
            ] as [string, string][]
          ).map(([title, desc], i) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent font-display font-bold text-accent-foreground">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">{t("projects_title")}</h2>
        <p className="mt-2 text-muted-foreground">
          {PROJECTS.length} {t("projects_sub_a")} {fmt(minReward)} {t("projects_sub_b")}{" "}
          {fmt(maxReward)} {t("projects_sub_c")}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left"
            >
              <div>
                <div className="text-xs font-semibold text-muted-foreground">{p.category}</div>
                <div className="mt-1 text-sm font-bold leading-snug">{p.name}</div>
              </div>
              <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                +{fmt(p.reward)}
              </span>
            </div>
          ))}
        </div>
        <button
          className={`${btnPrimary} mt-8 px-7 py-3.5 text-base`}
          onClick={() => { triggerAd(); setShowProjects(true); }}
        >
          {t("projects_cta")}
        </button>
        <p className="mt-5 text-sm text-muted-foreground">
          🔄 Novos 4 projetos disponíveis a cada 20 dias — avalie, acumule saldo e volte para a próxima atualização.
        </p>
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
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p className="text-center">{t("footer_rights")}</p>
          <div className="flex gap-4">
            <a href="/privacidade" className="hover:text-foreground">{t("footer_privacy")}</a>
            <a href="/termos" className="hover:text-foreground">{t("footer_terms")}</a>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["PayPal", "Payoneer"].map((m) => (
              <span key={m} className="rounded-md border border-border bg-card px-3 py-1 text-xs font-bold text-foreground">
                🔒 {m}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {showProjects && (
        <ProjectsModal signedIn={signedIn} onClose={() => setShowProjects(false)} />
      )}
    </div>
  );
}

function ProjectsModal({
  signedIn,
  onClose,
}: {
  signedIn: boolean | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const total = PROJECTS.reduce((s, p) => s + p.reward, 0);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-3 backdrop-blur sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{t("modal_title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {PROJECTS.length} {t("modal_sub_a")} {fmt(total)} USD
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-secondary/50 p-4 text-left"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {p.category}
                </span>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  +{fmt(p.reward)}
                </span>
              </div>
              <h4 className="mt-2 text-base font-bold leading-snug">{p.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-2 text-sm">
                <strong className="font-semibold">{t("modal_focus_label")}</strong>{" "}
                <span className="text-muted-foreground">{p.focus}</span>
              </p>
            </div>
          ))}
        </div>
        <Link
          to={signedIn ? "/avaliacoes" : "/auth"}
          className={`${btnPrimary} mt-6 w-full py-3`}
          onClick={() => triggerAd()}
        >
          {signedIn ? t("modal_cta_auth") : t("modal_cta_guest")}
        </Link>
      </div>
    </div>
  );
}
