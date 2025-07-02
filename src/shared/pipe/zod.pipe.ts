import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { validations } from '../constants';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map(
          (err) => `${err.path.join('.')} - ${err.message}`,
        );
        throw new BadRequestException(messages);
      }

      throw new BadRequestException(validations.validationError);
    }
  }
}
