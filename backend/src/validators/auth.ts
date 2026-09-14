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

type RegisterInput = z.infer<typeof registerSchema>;

type ValidationResult =
  { valid: true; data: RegisterInput } | { valid: false; message: string };

export function validateRegister(body: unknown): ValidationResult {
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
