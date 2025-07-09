import { z } from 'zod';
import { patterns, validations } from '../../shared/utils/constants';

export const signinSchema = z
  .object({
    email: z
      .string({ required_error: validations.emailRequired })
      .email(validations.invalidEmailFormat)
      .toLowerCase()
      .regex(patterns.email, validations.emailError)
      .trim(),

    password: z
      .string({ required_error: validations.passwordRequired })
      .min(8, validations.passwordLengthError)
      .max(50, validations.passwordLengthError)
      .regex(patterns.password, validations.passwordMaxLengthError),
  })
  .required();

export type signinDto = z.infer<typeof signinSchema>;
