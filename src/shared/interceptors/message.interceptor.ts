import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Response as ExpressResponse } from 'express';
import { map } from 'rxjs/operators';
import { MessageOnly } from '../interfaces/auth.model';

@Injectable()
export class MessageInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<MessageOnly> | Promise<Observable<MessageOnly>> {
    const message = this.reflector.get<string>(
      'message',
      _context.getHandler(),
    );
    const ctx = _context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    return next.handle().pipe(
      map(() => ({
        status: response.statusCode,
        message,
      })),
    );
  }
}
