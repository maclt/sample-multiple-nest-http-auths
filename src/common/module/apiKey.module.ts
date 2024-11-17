import { Module, Global, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export abstract class ApiKeyHttpService extends HttpService {}

interface EnvironmentVariables {
  API_KEY: string;
}

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: ApiKeyHttpService,
      useExisting: HttpService,
    },
  ],
  exports: [ApiKeyHttpService],
})
export class ApiKeyHttpModule implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  onModuleInit() {
    this.httpService.axiosRef.defaults.headers.common['x-api-key'] =
      this.configService.get('API_KEY');
  }
}
