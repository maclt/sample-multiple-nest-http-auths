import { Injectable } from '@nestjs/common';
import { ApiKeyHttpService } from '../module/apiKey.module';
import { Auth0HttpService } from '../module/auth0Http.module';
import { Sigv4HttpService } from '../module/sigv4Http.modules';

@Injectable()
export class SampleRepository {
  constructor(
    private readonly apiKeyHttp: ApiKeyHttpService,
    private readonly auth0Http: Auth0HttpService,
    private readonly siv4Http: Sigv4HttpService,
  ) {}

  async getFromServerProtectedByApiKey() {
    return this.apiKeyHttp.get('https://order.api.example.com');
  }

  async getFromServerProtectedByAuth0() {
    return this.auth0Http.get('https://payment.api.example.com');
  }

  async getFromServerProtectedBySigv4() {
    return this.siv4Http.get('https://credit.api.example.com');
  }
}
