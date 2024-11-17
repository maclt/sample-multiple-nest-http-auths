import { Module, Global, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthenticationClient } from 'auth0';

export abstract class Auth0HttpService extends HttpService {}

interface EnvironmentVariables {
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_AUDIENCE: string;
}

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Auth0HttpService,
      useExisting: HttpService,
    },
  ],
  exports: [Auth0HttpService],
})
export class Auth0HttpModule implements OnModuleInit {
  constructor(
    private httpService: Auth0HttpService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  private async getAccessTokenFromAuth0(): Promise<string> {
    const client = new AuthenticationClient({
      domain: this.configService.get('AUTH0_DOMAIN'),
      clientId: this.configService.get('AUTH0_CLIENT_ID'),
      clientSecret: this.configService.get('AUTH0_CLIENT_SECRET'),
    });

    const { data } = await client.oauth.clientCredentialsGrant({
      audience: this.configService.get('AUTH0_AUDIENCE'),
    });

    return data.access_token;
  }

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use(async (config) => {
      config.headers['Authorization'] =
        `Bearer ${await this.getAccessTokenFromAuth0()}`;
      return config;
    });
  }
}
