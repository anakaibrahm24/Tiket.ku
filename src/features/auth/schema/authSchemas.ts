import { z } from "zod";

const errorMessageInput = z.string().nonempty({ message: "field is empty" });

export const authSchema = z.object({
  email: errorMessageInput.email({ message: "Email tidak valid" }),
  password: errorMessageInput
    .min(6, { message: "Password minimal 6 karakter" })
    .max(20, { message: "Password maksimal 20 karakter" }),
});

export const loginSchema = authSchema;

export const signupSchema = z
  .object({
    name: errorMessageInput.regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "Nama hanya huruf dan spasi",
    }),
    email: errorMessageInput.email({ message: "Email tidak valid" }),
    password: errorMessageInput
      .min(6, { message: "Password minimal 6 karakter" })
      .max(20, { message: "Password maksimal 20 karakter" }),
    confirmPassword: errorMessageInput,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type AuthSchema = z.infer<typeof authSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;