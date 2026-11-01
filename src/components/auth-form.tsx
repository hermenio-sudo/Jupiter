import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { credentialsSchema, signupSchema } from "@/lib/auth-validation";
import { LanguageProvider, useLanguage } from "@/lib/i18n";

export function AuthForm() {
  return (
    <LanguageProvider>
      <AuthFormInner />
    </LanguageProvider>
  );
}

// ── Country list ─────────────────────────────────────────────────────────────
const COUNTRIES = [
  "Angola","Brasil","Cabo Verde","Guiné-Bissau","Moçambique","Portugal","São Tomé e Príncipe","Timor-Leste",
  "Afeganistão","África do Sul","Albânia","Alemanha","Argélia","Argentina","Austrália","Áustria","Bélgica",
  "Bolívia","Canadá","Chile","China","Colômbia","Congo","Coreia do Sul","Costa Rica","Cuba","Dinamarca",
  "Egito","El Salvador","Equador","Eslováquia","Eslovénia","Espanha","Estados Unidos","Etiópia","Filipinas",
  "Finlândia","França","Gana","Grécia","Guatemala","Honduras","Hungria","Índia","Indonésia","Irão","Iraque",
  "Irlanda","Israel","Itália","Jamaica","Japão","Jordânia","Quénia","Líbano","Líbia","Malásia","Mali",
  "Marrocos","México","Nicarágua","Nigéria","Noruega","Nova Zelândia","Países Baixos","Paquistão","Panamá",
  "Paraguai","Peru","Polónia","Porto Rico","Qatar","Reino Unido","República Dominicana","Roménia","Rússia",
  "Arábia Saudita","Senegal","Sérvia","Singapura","Síria","Sri Lanka","Suécia","Suíça","Tailândia","Taiwan",
  "Tanzânia","Tunísia","Turquia","Ucrânia","Uganda","Uruguai","Venezuela","Vietname","Zimbabué","Outro",
].sort((a, b) => a.localeCompare(b, "pt"));

const MESSENGERS = ["Telegram","WhatsApp","Skype","Discord","Signal","Viber","WeChat","Line","Outro"];

// ─────────────────────────────────────────────────────────────────────────────

function AuthFormInner() {
  const { t, toggle } = useLanguage();
  const navigate = useNavigate();

  const [screen, setScreen] = useState<"signup" | "signin">("signup");

  // signup fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messengerType, setMessengerType] = useState("");
  const [country, setCountry] = useState("");
  const [terms, setTerms] = useState(false);

  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) void navigate({ to: "/avaliacoes", replace: true });
    });
    return () => { active = false; };
  }, [navigate]);

  const switchTo = (s: "signup" | "signin") => {
    setScreen(s);
    setMessage("");
    setName(""); setUsername(""); setEmail(""); setPassword("");
    setMessengerType(""); setCountry("");
    setTerms(false);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setMessage("");

    if (screen === "signup") {
      const parsed = signupSchema.safeParse({
        email, name, username, password,
        messengerType, country, terms,
      });
      if (!parsed.success) {
        setMessage(parsed.error.issues[0]?.message ?? t("auth_err_generic"));
        return;
      }
      setBusy(true);
      try {
        const result = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: parsed.data.name,
              username: parsed.data.username,
              messenger_type: parsed.data.messengerType,
              country: parsed.data.country,
            },
          },
        });
        if (result.error) {
          const code = result.error.code;
          const msgText = result.error.message ?? "";
          setMessage(
            code === "user_already_exists"
              ? t("auth_err_exists")
              : result.error.status === 429
                ? t("auth_err_ratelimit")
                : msgText.toLowerCase().includes("weak") || msgText.toLowerCase().includes("easy to guess")
                  ? t("auth_err_weak_password")
                  : t("auth_err_generic"),
          );
          return;
        }
        if (result.data.session) await navigate({ to: "/avaliacoes", replace: true });
        else { setPassword(""); setConfirmation(true); }
      } catch { setMessage(t("auth_err_network")); }
      finally { setBusy(false); }

    } else {
      const parsed = credentialsSchema.safeParse({ email, password });
      if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? t("auth_err_generic")); return; }
      setBusy(true);
      try {
        const result = await supabase.auth.signInWithPassword(parsed.data);
        if (result.error) {
          const code = result.error.code;
          setMessage(
            code === "invalid_credentials" ? t("auth_err_invalid")
              : code === "email_not_confirmed" ? t("auth_err_unconfirmed")
              : result.error.status === 429 ? t("auth_err_ratelimit")
              : t("auth_err_generic"),
          );
          return;
        }
        if (result.data.session) await navigate({ to: "/avaliacoes", replace: true });
      } catch { setMessage(t("auth_err_network")); }
      finally { setBusy(false); }
    }
  }

  // ── Shared input class ────────────────────────────────────────────────────
  const inputCls = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring";
  const inputIconCls = "h-11 w-full rounded-md border border-input bg-card pl-10 pr-3 text-sm outline-none focus:border-ring";
  const selectCls = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring";

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* ── Header ── */}
      <header className="border-b border-border px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <img src="/logo.png" alt="Jupiter" className="h-9 w-9 rounded-lg object-contain" />
            Jupiter<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground transition hover:bg-muted" aria-label="Toggle language">
              {t("lang_toggle")}
            </button>
            <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">{t("auth_back")}</Link>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-5 sm:py-12">
        <div className="w-full max-w-md">

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
            <LockKeyhole size={24} />
          </div>
          <p className="mb-2 text-sm font-semibold text-primary">{t("auth_tagline")}</p>

          {/* Tab switcher */}
          {!confirmation && (
            <div className="mb-6 flex rounded-xl border border-border bg-secondary p-1">
              <button type="button" onClick={() => switchTo("signup")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${screen === "signup" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                {t("auth_btn_signup")}
              </button>
              <button type="button" onClick={() => switchTo("signin")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${screen === "signin" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                {t("auth_btn_signin")}
              </button>
            </div>
          )}

          {/* ── Confirmation ── */}
          {confirmation ? (
            <>
              <h1 className="text-2xl font-bold">{t("auth_confirm_title")}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("auth_confirm_sub")}</p>
              <Button variant="outline" className="mt-6 w-full"
                onClick={() => { setConfirmation(false); switchTo("signin"); }}>
                {t("auth_btn_back")} <ArrowRight />
              </Button>
            </>

          ) : screen === "signup" ? (
            /* ── Sign up ── */
            <>
              <h1 className="text-2xl font-bold">{t("auth_signup_title")}</h1>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">{t("auth_signup_sub")}</p>

              <form onSubmit={submit} name="signup" className="space-y-4">

                {/* Email */}
                <div>
                  <label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold">E-mail *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input id="su-email" type="email" name="email" autoComplete="username email" required
                      maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@email.com" className={inputIconCls} />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="su-name" className="mb-1.5 block text-sm font-semibold">Nome e Apelido *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input id="su-name" type="text" name="name" autoComplete="name" required
                      maxLength={100} value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="João Silva" className={inputIconCls} />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="su-username" className="mb-1.5 block text-sm font-semibold">Nome de utilizador *</label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input id="su-username" type="text" name="username" autoComplete="username" required
                      maxLength={30} value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                      placeholder="joaosilva123" className={inputIconCls} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="su-password" className="mb-1.5 block text-sm font-semibold">Palavra-passe *</label>
                  <div className="relative">
                    <input id="su-password" type={visible ? "text" : "password"}
                      name="password" autoComplete="new-password" required
                      minLength={8} maxLength={128} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres" className={`${inputCls} pr-12`} />
                    <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1"
                      aria-label={visible ? t("auth_pass_hide") : t("auth_pass_show")}
                      onClick={() => setVisible(!visible)}>
                      {visible ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </div>

                {/* Messenger type */}
                <div>
                  <label htmlFor="su-messenger" className="mb-1.5 block text-sm font-semibold">Tipo de Mensageiro *</label>
                  <select id="su-messenger" required value={messengerType} onChange={(e) => setMessengerType(e.target.value)} className={selectCls}>
                    <option value="" disabled>Selecione…</option>
                    {MESSENGERS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="su-country" className="mb-1.5 block text-sm font-semibold">País *</label>
                  <select id="su-country" required value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
                    <option value="" disabled>Selecione o seu país…</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    Li e aceito os{" "}
                    <a href="/termos" target="_blank" className="font-semibold text-primary hover:underline">Termos & Condições</a>
                    {" "}e a{" "}
                    <a href="/privacidade" target="_blank" className="font-semibold text-primary hover:underline">Política de Privacidade</a>
                  </span>
                </label>

                {message && <p role="alert" className="text-sm text-destructive">{message}</p>}

                <Button type="submit" disabled={busy} className="h-11 w-full font-bold">
                  {busy ? t("auth_btn_loading") : "SIGN UP"} <ArrowRight />
                </Button>
              </form>
            </>

          ) : (
            /* ── Sign in ── */
            <>
              <h1 className="text-2xl font-bold">{t("auth_signin_title")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("auth_signin_sub")}</p>
              <form onSubmit={submit} name="signin" className="mt-6 space-y-4">

                <div>
                  <label htmlFor="si-email" className="mb-1.5 block text-sm font-semibold">{t("auth_email_label")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input id="si-email" type="email" name="email" autoComplete="username email" required
                      maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth_email_placeholder")} className={inputIconCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="si-password" className="mb-1.5 block text-sm font-semibold">{t("auth_pass_label")}</label>
                  <div className="relative">
                    <input id="si-password" type={visible ? "text" : "password"}
                      name="password" autoComplete="current-password" required
                      minLength={8} maxLength={128} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth_pass_placeholder")} className={`${inputCls} pr-12`} />
                    <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1"
                      aria-label={visible ? t("auth_pass_hide") : t("auth_pass_show")}
                      onClick={() => setVisible(!visible)}>
                      {visible ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </div>

                {message && <p role="alert" className="text-sm text-destructive">{message}</p>}

                <Button type="submit" disabled={busy} className="h-11 w-full font-bold">
                  {busy ? t("auth_btn_loading") : t("auth_btn_signin")} <ArrowRight />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      <footer className="px-5 py-6 text-center text-xs text-muted-foreground">
        {t("footer_rights")}
      </footer>
    </main>
  );
}
