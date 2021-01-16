import * as yup from "yup";

export const userSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .min(1, "email cannot be null")
      .email("not a valid email")
      .required(),
    password: yup.string().trim().min(1, "password cannot be null").required(),
  })
  .required();

export type user = yup.InferType<typeof userSchema>;
