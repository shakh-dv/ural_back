import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {SystemLogger} from './core/infra/logger/logger';
import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AllExceptionsFilter} from './core/infra/exception-filters/all-exceptions.filter';
import {ClsService} from 'nestjs-cls';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const cls = app.get(ClsService);
  const systemLogger = app.get(SystemLogger);
  const configService = app.get(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(bodyParser.urlencoded({extended: true}));
  app.useLogger(systemLogger);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, cls, systemLogger));
  app.enableCors({
    origin: configService.getOrThrow<string>('REACT_APP_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  if (
    ['development', 'staging'].includes(
      configService.getOrThrow<string>('NODE_ENV')
    )
  ) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.getOrThrow<string>('APP_NAME'))
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.getOrThrow<number>('SERVER_PORT'));

  await systemLogger.debug(
    `Server is running on port: ${configService.getOrThrow<number>('SERVER_PORT')}`,
    bootstrap.name
  );

}

bootstrap();
