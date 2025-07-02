import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Response as ExpressResponse } from 'express';
import { ResponseInterface } from '../../model/auth.model';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseInterface<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseInterface<T>> {
    const message = this.reflector.get<string>(
      'message',
      _context.getHandler(),
    );
    const ctx = _context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    return next.handle().pipe(
      map((data) => ({
        status: response.statusCode,
        message,
        data,
      })),
    );
  }
}
