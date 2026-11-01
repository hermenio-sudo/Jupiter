import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email("Insira um e-mail válido.").max(255),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").max(128),
});

export const signupSchema = z.object({
  email: z.string().trim().email("Insira um e-mail válido.").max(255),
  name: z.string().trim().min(2, "Insira o seu nome e apelido.").max(100),
  username: z.string().trim().min(3, "O nome de utilizador deve ter pelo menos 3 caracteres.").max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e _ são permitidos."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").max(128),
  messengerType: z.string().min(1, "Selecione um mensageiro."),
  country: z.string().min(1, "Selecione o seu país."),
  terms: z.literal(true, { errorMap: () => ({ message: "Aceite os termos para continuar." }) }),
});
