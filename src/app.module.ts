import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { PaginationModule } from './common/pagination/pagination.module';
import databaseConfig from './config/database.config';
import envValidation from './config/env.validation';

const ENV = process.env.NODE_ENV || 'dev';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env.${ENV}`,
      validationSchema: envValidation,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
        errors: {
          wrap: { label: '' },
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig =
          config.get<ConfigType<typeof databaseConfig>>('database');
        if (!dbConfig) {
          throw new Error('Database configuration is not defined');
        }
        return {
          type: dbConfig.type as 'postgres',
          url: dbConfig.url,
          autoLoadEntities: dbConfig.autoLoadEntities,
          synchronize: dbConfig.synchronize,
        };
      },
    }),
    UserModule,
    TweetModule,
    AuthModule,
    ProfileModule,
    HashtagModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
