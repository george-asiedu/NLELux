import { z } from 'zod';
import { patterns, validations } from '../../shared/constants';

export const signupSchema = z
  .object({
    name: z
      .string({ required_error: validations.nameRequired })
      .min(2, validations.nameLengthError)
      .max(50, validations.nameMaxLengthError)
      .regex(patterns.name, validations.nameFormatError)
      .trim(),

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

export type signupDto = z.infer<typeof signupSchema>;
