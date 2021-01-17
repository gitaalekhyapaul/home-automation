import * as yup from "yup";

export const listDeviceSchema = yup
  .object({
    uuid: yup.string().trim().min(1, "uuid cannot be null").required(),
    urn: yup.string().trim().min(1, "urn cannot be null").required(),
    link: yup.string().trim().min(1, "description cannot be null").required(),
  })
  .required();

export type deviceSchema = yup.InferType<typeof listDeviceSchema>;
