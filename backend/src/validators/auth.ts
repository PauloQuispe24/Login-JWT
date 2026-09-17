import { z } from "zod";

const registerSchema = z.object({
  email: z
    .string("El email debe ser de tipo string.")
    .email("El formato de email no es válido."),
  password: z
    .string("La contraseña debe ser de tipo string.")
    .min(8, "La contraseña debe tener mínimo 8 caracteres.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número."),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

type ValidationRegisterResult =
  { valid: true; data: RegisterInput } | { valid: false; message: string };

type ValidationLoginResult =
  { valid: true; data: LoginInput } | { valid: false; message: string };

export function validateRegister(body: unknown): ValidationRegisterResult {
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return {
      valid: false,
      message:
        result.error.issues[0]?.message ?? "Datos de registro inválidos.",
    };
  }
  return { valid: true, data: result.data };
}

export function validateLogin(body: unknown): ValidationLoginResult {
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return {
      valid: false,
      message: "Email o contraseña incorrectos.",
    };
  }
  return { valid: true, data: result.data };
}
