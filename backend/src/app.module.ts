import './boilerplate.polyfill';

import path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { PostModule } from './modules/post/post.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { ClerkModule } from './modules/clerkUsers/clerk.module';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { PrivyModule } from './modules/privyUsers/privy.module';
import { FilesModule } from './modules/files/files.module';
import { CountsModule } from './modules/count/counts.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProxyModule } from './modules/proxy/proxy.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    WalletModule,
    TenantModule,
    ClerkModule,
    PrivyModule,
    FilesModule,
    CountsModule,
    OrganizationModule,
    ProxyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
        resolvers: [
          { use: QueryResolver, options: ['lang'] },
          AcceptLanguageResolver,
          new HeaderResolver(['x-lang']),
        ],
      }),
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
  ],
  providers: [],
})
export class AppModule {}
