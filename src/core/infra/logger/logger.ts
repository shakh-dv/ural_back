import {Injectable, LoggerService} from '@nestjs/common';
import {createLogger, format, transports} from 'winston';
import {ClsService} from 'nestjs-cls';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class SystemLogger implements LoggerService {
  private readonly logger = createLogger({
    format: format.combine(
      format.label({
        label: `[${this.configService.getOrThrow<string>('APP_NAME')}]`,
      }),
      format.timestamp(),
      format.splat()
    ),
    transports: [
      new transports.Console({
        level: 'debug',
        format: format.combine(
          format.timestamp({
            format: () => {
              const now = new Date();
              return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            },
          }),
          format.colorize({
            all: true,
          }),
          format.printf(({label, level, message, timestamp}) => {
            return (
              `${label} - ` +
              `${this.cls.getId() || ''} ${timestamp} ${level} ${message}`.trim()
            );
          })
        ),
      }),
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: format.combine(format.json({space: 2})),
      }),
    ],
  });

  constructor(
    private readonly cls: ClsService,
    private readonly configService: ConfigService
  ) {}

  log(message: string, context: string): void {
    this.logger.log('info', `[%s] ${message}`, context);
  }

  error(message: string, context: string, stackTrace?: string): void {
    this.logger.error(message, {
      context,
      stackTrace,
      requestId: this.cls.getId(),
    });
  }

  warn(message: string, context: string): void {
    this.logger.warn(`[%s] ${message}`, context);
  }

  debug(message: string, context: string): void {
    this.logger.debug(`[%s] ${message}`, context);
  }

  verbose(message: string, context: string): void {
    this.logger.verbose(`[%s] ${message}`, context);
  }
}
