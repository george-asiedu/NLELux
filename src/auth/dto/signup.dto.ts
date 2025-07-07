import { z } from 'zod';
import { patterns, validations } from '../../shared/constants';

const passwordsMatch = (data: {
  password: string;
  confirmPassword: string;
}): boolean => data.password === data.confirmPassword;

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

    confirmPassword: z
      .string({ required_error: validations.passwordRequired })
      .min(8, validations.passwordLengthError)
      .max(50, validations.passwordLengthError)
      .regex(patterns.password, validations.passwordMaxLengthError),
  })
  .refine(passwordsMatch, {
    message: validations.passwordsDoNotMatch,
    path: ['confirmPassword'],
  });

export type signupDto = z.infer<typeof signupSchema>;
