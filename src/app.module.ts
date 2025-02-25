import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { LpModule } from 'src/lps/lps.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ResponseInterceptor],
})
export class AppModule {}
