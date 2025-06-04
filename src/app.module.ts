import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CustomJwtModule } from './custom-jwt/custom-jwt.module';
import { CookieModule } from './cookie/cookie.module';
import { QuestModule } from './quest/quest.module';
import { QuestionModule } from './question/question.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomJwtModule,
    CookieModule,
    QuestModule,
    QuestionModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes({ path: '/*api', method: RequestMethod.ALL });
  }
}
