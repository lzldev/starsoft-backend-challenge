import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { UserError } from './userError';
import { Response } from 'express';

@Catch(UserError)
export class HttpUserErrorFilter implements ExceptionFilter {
  catch(exception: UserError, host: ArgumentsHost) {
    const http = new HttpException(exception.message, exception.statusCode);

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const statusCode = http.getStatus();

    res.status(statusCode).json({
      statusCode,
      message: http.getResponse(),
    });
  }
}
