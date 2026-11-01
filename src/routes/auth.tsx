import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
export const Route = createFileRoute("/auth")({
 head: () => ({ meta: [
 { title: "Acesso à conta — Jupiter" },
 { name: "description", content: "Entre ou cadastre-se no Jupiter com e-mail e senha." },
 { property: "og:title", content: "Acesso à conta — Jupiter" },
 { property: "og:description", content: "Entre ou cadastre-se no Jupiter com e-mail e senha." },
 { property: "og:type", content: "website" },
 { name: "twitter:card", content: "summary_large_image" },
 ] }),
 component: AuthForm,
});
