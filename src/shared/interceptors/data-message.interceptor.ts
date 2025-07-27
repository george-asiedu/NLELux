import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Data } from '../interfaces/auth/auth.model';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Response as ExpressResponse } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class DataMessageInterceptor<T> implements NestInterceptor<T, Data<T>> {
  constructor(private readonly reflector: Reflector) {}

  public intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Data<T>> | Promise<Observable<Data<T>>> {
    const message = this.reflector.get<string>(
      'message',
      _context.getHandler(),
    );
    const ctx = _context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    return next.handle().pipe(
      map((data: T) => ({
        status: response.statusCode,
        message,
        data,
      })),
    );
  }
}
