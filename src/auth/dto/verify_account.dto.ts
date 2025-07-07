import { z } from 'zod';
import { patterns, validations } from '../../shared/utils/constants';

export const verifyAccountSchema = z
  .object({
    code: z
      .string({ required_error: validations.codeRequired })
      .regex(patterns.code, validations.codeFormatError)
      .trim(),
  })
  .required();

export type verifyAccountDto = z.infer<typeof verifyAccountSchema>;
