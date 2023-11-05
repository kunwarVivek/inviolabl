// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule,RequestMethod  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenants/tenants.module';
import { TenantMiddleware } from './tenants/middleware/middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '1234',
      database: 'multitenant',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
   
    TenantModule,
    AuthModule,
    UserModule,
 
  ],
  controllers: [],
  providers: [],
})
export class AppModule   {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: 'tenant', method: RequestMethod.POST })  // Exclude registration route
      .forRoutes('*');  // Apply to all routes. Adjust as needed.
  }
}
