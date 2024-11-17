import { Module, Global, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { Sha256 } from '@aws-crypto/sha256-js';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';

import { SignatureV4 } from '@smithy/signature-v4';
import { HttpRequest } from '@smithy/protocol-http';
import {
  HttpRequest as IHttpRequest,
  AwsCredentialIdentity,
} from '@smithy/types';

import { InternalAxiosRequestConfig } from 'axios';

export abstract class Sigv4HttpService extends HttpService {}

interface EnvironmentVariables {
  AWS_REGION: string;
  ASSUME_ROLE_ARN: string;
}

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Sigv4HttpService,
      useExisting: HttpService,
    },
  ],
  exports: [Sigv4HttpService],
})
export class Sigv4HttpModule implements OnModuleInit {
  constructor(
    private httpService: Sigv4HttpService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  private async getCredentialsFromSts(): Promise<AwsCredentialIdentity> {
    const credentialProvider = fromTemporaryCredentials({
      params: {
        RoleArn: this.configService.get<string>('ASSUME_ROLE_ARN'),
      },
      clientConfig: { region: 'ap-northeast-1' },
    });

    const credentials = await credentialProvider();
    return credentials;
  }

  private async signRequest(
    axiosRequest: InternalAxiosRequestConfig,
  ): Promise<IHttpRequest> {
    const url = new URL(axiosRequest.url);

    const request = new HttpRequest({
      headers: {
        'Content-Type': 'application/json',
        host: url.hostname,
      },
      hostname: url.hostname,
      method: axiosRequest.method.toUpperCase(),
      path: url.pathname,
      body: JSON.stringify(axiosRequest.data),
    });

    const singer = new SignatureV4({
      service: 'execute-api',
      region: this.configService.get('AWS_REGION'),
      credentials: await this.getCredentialsFromSts(),
      sha256: Sha256,
    });

    return await singer.sign(request);
  }

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use(async (config) => {
      const signedRequest = await this.signRequest(config);

      Object.entries(signedRequest.headers).forEach(([key, value]) => {
        config.headers[key] = value;
      });

      return config;
    });
  }
}
