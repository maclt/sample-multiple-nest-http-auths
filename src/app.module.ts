import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiKeyHttpModule } from './common/module/apiKey.module';
import { Auth0HttpModule } from './common/module/auth0Http.module';
import { Sigv4HttpModule } from './common/module/sigv4Http.modules';
import { SampleRepository } from './common/repository/sample.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApiKeyHttpModule,
    Auth0HttpModule,
    Sigv4HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, SampleRepository],
})
export class AppModule {}
