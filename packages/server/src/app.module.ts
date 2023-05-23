import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

const configService = new ConfigService();


@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid(
            'development',
            'dev',
            'develop',
            'prod',
            'production',
            'test',
            'provisional',
          )
          .default('development'),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASS'),
      database: configService.get<string>('DB_NAME'),
      // entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
