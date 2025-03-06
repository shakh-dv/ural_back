import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {ClsService} from 'nestjs-cls';
import {SystemLogger} from '../logger/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly cls: ClsService,
    private readonly logger: SystemLogger
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const {httpAdapter} = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      requestId: this.cls.getId(),
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.logger.error(exception.message, exception.name, exception.stack);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
