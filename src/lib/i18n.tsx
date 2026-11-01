import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

export const translations = {
  pt: {
    // Nav
    nav_login: "Entrar",
    nav_start: "Começar a Avaliar",
    nav_continue: "Continuar avaliando",
    nav_back: "← Início",
    nav_signout: "Sair",
    nav_withdraw: "Sacar Saldo",
    nav_rate: "Avaliar Projetos",

    // Landing — Hero
    hero_badge: "Renda extra em USD",
    hero_h1_a: "Ganhe em",
    hero_h1_highlight: "Dólares",
    hero_h1_b: "Avaliando Projetos Reais",
    hero_sub:
      "Você testa projetos de quem está construindo algo de verdade — apps, plataformas, ferramentas. Dá uma nota, escreve o que achou e recebe em dólares, direto no PayPal ou Payoneer.",
    hero_cta_primary: "Quero Avaliar →",
    hero_cta_secondary: "Ver como funciona",
    hero_footnote_a: "Avaliações pagam de",
    hero_footnote_b: "a",
    hero_footnote_c: "USD ·",
    hero_footnote_d: "projetos disponíveis · saque a partir de",

    // How it works
    how_title: "Como funciona",
    how_1_title: "Crie sua conta",
    how_1_desc: "Cadastro rápido com e-mail e senha. Sem verificação demorada.",
    how_2_title: "Escolha um projeto",
    how_2_desc: "Leia a descrição, explore o foco da avaliação e decida o que testar primeiro.",
    how_3_title: "Avalie e receba",
    how_3_desc: "Dê uma nota de 1 a 10, escreva o que achou e o saldo cai na sua conta na hora.",

    // Projects section (landing)
    projects_title: "Projetos esperando sua opinião",
    projects_sub_a: "projetos disponíveis agora — cada avaliação paga de",
    projects_sub_b: "a",
    projects_sub_c: "USD",
    projects_cta: "Ver todos os projetos →",

    // Withdraw section
    withdraw_title: "Como receber",
    withdraw_sub: "Saque mínimo de",
    withdraw_paypal_desc: "Receba direto na sua conta PayPal",
    withdraw_payoneer_desc: "Receba direto na sua conta Payoneer",

    // Footer
    footer_rights: "© 2026 Jupiter. Todos os direitos reservados.",
    footer_privacy: "Privacidade",
    footer_terms: "Termos",

    // Projects modal
    modal_title: "Todos os projetos",
    modal_sub_a: "projetos · recompensa total",
    modal_focus_label: "O que avaliar:",
    modal_cta_auth: "Ir para a avaliação",
    modal_cta_guest: "Criar conta para avaliar",

    // Avaliacoes — hero
    aval_badge: "Você está logado — é hora de avaliar",
    aval_h1_a: "Escolha um projeto",
    aval_h1_b: "e ganhe em dólares",
    aval_sub:
      "Leia a descrição de cada projeto, dê sua nota e escreva o que realmente achou. Simples assim — e o saldo cai na hora.",
    aval_cta: "Ver os projetos →",

    // Balance
    balance_label: "Saldo:",

    // Project card
    card_what: "O que avaliar:",
    card_score_label: "Sua nota (1 a 10)",
    card_justification_label: "Justificativa",
    card_justification_placeholder: "Explique o porquê da sua nota...",
    card_chars_min: "caracteres mínimos",
    card_submit_a: "Enviar e Ganhar",
    card_submitted: "Avaliação enviada ✓",
    card_success_a: "✓ Enviado! +",
    card_success_b: "adicionados ao seu saldo.",

    // Avaliacoes section
    aval_section_title: "Projetos disponíveis",
    aval_section_sub_a: "Avalie os",
    aval_section_sub_b: "projetos e some",
    aval_section_sub_c: "USD ao seu saldo.",

    // Withdraw modal
    wdraw_title: "Solicitar saque",
    wdraw_avail_a: "Saldo disponível:",
    wdraw_avail_b: "· mínimo",
    wdraw_paypal_label: "E-mail da conta PayPal",
    wdraw_payoneer_label: "ID ou e-mail Payoneer",
    wdraw_paypal_placeholder: "voce@email.com",
    wdraw_payoneer_placeholder: "ID ou e-mail",
    wdraw_btn: "Solicitar saque",
    wdraw_err_balance_a: "Saldo insuficiente. O saque mínimo é",
    wdraw_err_balance_b: "USD (faltam",
    wdraw_err_account_paypal: "Informe seu e-mail PayPal.",
    wdraw_err_account_payoneer: "Informe seu ID ou e-mail Payoneer.",
    wdraw_success_a: "Resgate de",
    wdraw_success_b: "solicitado via",
    wdraw_success_c: "para",
    wdraw_success_d: "Processamento em até 3 dias úteis.",

    // Auth form
    auth_name_label: "Nome completo",
    auth_name_placeholder: "O seu nome",
    auth_back: "← Início",
    auth_tagline: "Jupiter",
    auth_signup_title: "Crie sua conta",
    auth_signin_title: "Entre na sua conta",
    auth_confirm_title: "Confirme seu e-mail",
    auth_signup_sub: "Avalie projetos reais e receba em dólares.",
    auth_signin_sub: "Bem-vindo de volta ao Jupiter.",
    auth_confirm_sub:
      "Enviamos um link para o seu e-mail. Se não aparecer em breve, confira a pasta de spam.",
    auth_email_label: "E-mail",
    auth_email_placeholder: "voce@email.com",
    auth_pass_label: "Senha",
    auth_pass_placeholder: "Mínimo 8 caracteres",
    auth_pass_show: "Mostrar senha",
    auth_pass_hide: "Ocultar senha",
    auth_btn_signup: "Criar conta",
    auth_btn_signin: "Entrar",
    auth_btn_loading: "Aguarde…",
    auth_btn_back: "Voltar para entrar",
    auth_toggle_has_account: "Já tem uma conta?",
    auth_toggle_signin: "Entrar",
    auth_toggle_no_account: "Ainda não tem conta?",
    auth_toggle_signup: "Cadastre-se",
    auth_err_invalid: "E-mail ou senha incorretos.",
    auth_err_unconfirmed: "Confirme seu e-mail antes de entrar.",
    auth_err_exists: "Esse e-mail já está cadastrado. Clique em Entrar.",
    auth_err_ratelimit: "Muitas tentativas. Aguarde alguns minutos.",
    auth_err_generic: "Não foi possível continuar. Tente novamente.",
    auth_err_weak_password: "Essa senha é muito comum e fácil de adivinhar. Tenta uma combinação com letras, números e símbolos.",
    auth_err_network: "Não foi possível conectar. Tente novamente.",

    // 404 / Error
    not_found_title: "Página não encontrada",
    not_found_sub: "Essa página não existe ou foi movida.",
    not_found_cta: "Ir para o início",
    error_title: "Algo deu errado",
    error_sub: "Houve um problema ao carregar a página. Você pode tentar de novo ou voltar ao início.",
    error_retry: "Tentar novamente",
    error_home: "Ir para o início",

    // Language toggle
    lang_toggle: "EN",
  },

  en: {
    // Nav
    nav_login: "Log in",
    nav_start: "Start Reviewing",
    nav_continue: "Continue Reviewing",
    nav_back: "← Home",
    nav_signout: "Sign out",
    nav_withdraw: "Withdraw",
    nav_rate: "Review Projects",

    // Landing — Hero
    hero_badge: "Extra income in USD",
    hero_h1_a: "Earn in",
    hero_h1_highlight: "Dollars",
    hero_h1_b: "Reviewing Real Projects",
    hero_sub:
      "You test projects from people actually building something — apps, platforms, tools. Give a score, write what you think, and get paid in dollars, straight to PayPal or Payoneer.",
    hero_cta_primary: "Start Reviewing →",
    hero_cta_secondary: "See how it works",
    hero_footnote_a: "Reviews pay from",
    hero_footnote_b: "to",
    hero_footnote_c: "USD ·",
    hero_footnote_d: "projects available · withdraw from",

    // How it works
    how_title: "How it works",
    how_1_title: "Create your account",
    how_1_desc: "Quick signup with email and password. No lengthy verification.",
    how_2_title: "Pick a project",
    how_2_desc: "Read the description, check the review focus, and decide what to test first.",
    how_3_title: "Review and get paid",
    how_3_desc: "Give a score from 1 to 10, write your thoughts, and the balance hits your account instantly.",

    // Projects section (landing)
    projects_title: "Projects waiting for your opinion",
    projects_sub_a: "projects available right now — each review pays from",
    projects_sub_b: "to",
    projects_sub_c: "USD",
    projects_cta: "View all projects →",

    // Withdraw section
    withdraw_title: "How to get paid",
    withdraw_sub: "Minimum withdrawal of",
    withdraw_paypal_desc: "Receive directly to your PayPal account",
    withdraw_payoneer_desc: "Receive directly to your Payoneer account",

    // Footer
    footer_rights: "© 2026 Jupiter. All rights reserved.",
    footer_privacy: "Privacy",
    footer_terms: "Terms",

    // Projects modal
    modal_title: "All projects",
    modal_sub_a: "projects · total reward",
    modal_focus_label: "What to review:",
    modal_cta_auth: "Go to reviews",
    modal_cta_guest: "Sign up to review",

    // Avaliacoes — hero
    aval_badge: "You're in — time to review",
    aval_h1_a: "Pick a project",
    aval_h1_b: "and earn in dollars",
    aval_sub:
      "Read each project's description, give your score, and write what you actually think. That's it — balance updates instantly.",
    aval_cta: "View projects →",

    // Balance
    balance_label: "Balance:",

    // Project card
    card_what: "What to review:",
    card_score_label: "Your score (1 to 10)",
    card_justification_label: "Justification",
    card_justification_placeholder: "Explain your score...",
    card_chars_min: "minimum characters",
    card_submit_a: "Submit and Earn",
    card_submitted: "Review submitted ✓",
    card_success_a: "✓ Submitted! +",
    card_success_b: "added to your balance.",

    // Avaliacoes section
    aval_section_title: "Available projects",
    aval_section_sub_a: "Review all",
    aval_section_sub_b: "projects and add",
    aval_section_sub_c: "USD to your balance.",

    // Withdraw modal
    wdraw_title: "Request withdrawal",
    wdraw_avail_a: "Available balance:",
    wdraw_avail_b: "· minimum",
    wdraw_paypal_label: "PayPal email address",
    wdraw_payoneer_label: "Payoneer ID or email",
    wdraw_paypal_placeholder: "you@email.com",
    wdraw_payoneer_placeholder: "ID or email",
    wdraw_btn: "Request withdrawal",
    wdraw_err_balance_a: "Insufficient balance. Minimum withdrawal is",
    wdraw_err_balance_b: "USD (you need",
    wdraw_err_account_paypal: "Please enter your PayPal email.",
    wdraw_err_account_payoneer: "Please enter your Payoneer ID or email.",
    wdraw_success_a: "Withdrawal of",
    wdraw_success_b: "requested via",
    wdraw_success_c: "to",
    wdraw_success_d: "Processing within 3 business days.",

    // Auth form
    auth_name_label: "Full name",
    auth_name_placeholder: "Your name",
    auth_back: "← Home",
    auth_tagline: "Jupiter",
    auth_signup_title: "Create your account",
    auth_signin_title: "Welcome back",
    auth_confirm_title: "Check your email",
    auth_signup_sub: "Review real projects and get paid in dollars.",
    auth_signin_sub: "Good to have you back.",
    auth_confirm_sub:
      "We sent a confirmation link to your email. If it doesn't show up soon, check your spam folder.",
    auth_email_label: "Email",
    auth_email_placeholder: "you@email.com",
    auth_pass_label: "Password",
    auth_pass_placeholder: "At least 8 characters",
    auth_pass_show: "Show password",
    auth_pass_hide: "Hide password",
    auth_btn_signup: "Create account",
    auth_btn_signin: "Log in",
    auth_btn_loading: "Please wait…",
    auth_btn_back: "Back to login",
    auth_toggle_has_account: "Already have an account?",
    auth_toggle_signin: "Log in",
    auth_toggle_no_account: "Don't have an account?",
    auth_toggle_signup: "Sign up",
    auth_err_invalid: "Incorrect email or password.",
    auth_err_unconfirmed: "Please confirm your email before logging in.",
    auth_err_exists: "That email is already registered. Click Log in.",
    auth_err_ratelimit: "Too many attempts. Please wait a few minutes.",
    auth_err_generic: "Couldn't complete the request. Please try again.",
    auth_err_weak_password: "That password is too common and easy to guess. Try a mix of letters, numbers, and symbols.",
    auth_err_network: "Couldn't connect. Please try again.",

    // 404 / Error
    not_found_title: "Page not found",
    not_found_sub: "This page doesn't exist or has been moved.",
    not_found_cta: "Go home",
    error_title: "Something went wrong",
    error_sub: "There was a problem loading this page. You can try again or go back home.",
    error_retry: "Try again",
    error_home: "Go home",

    // Language toggle
    lang_toggle: "PT",
  },
} satisfies Record<Lang, Record<string, string>>;

export type TranslationKey = keyof typeof translations.pt;

// ─── Context ────────────────────────────────────────────────────────────────

interface LangCtx {
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggle: () => void;
}

const LangContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const stored =
    typeof window !== "undefined"
      ? (localStorage.getItem("jupiter_lang") as Lang | null)
      : null;
  const [lang, setLang] = useState<Lang>(stored ?? "pt");

  const toggle = () =>
    setLang((prev) => {
      const next: Lang = prev === "pt" ? "en" : "pt";
      localStorage.setItem("jupiter_lang", next);
      return next;
    });

  const t = (key: TranslationKey) => translations[lang][key];

  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
