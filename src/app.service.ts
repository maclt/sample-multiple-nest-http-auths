import { Injectable } from '@nestjs/common';
import { SampleRepository } from './common/repository/sample.repository';

@Injectable()
export class AppService {
  constructor(readonly sampleRepository: SampleRepository) {}

  async getOrders() {
    return await this.sampleRepository.getFromServerProtectedByApiKey();
  }

  async getPayments() {
    return await this.sampleRepository.getFromServerProtectedByAuth0();
  }

  async getCredits() {
    return await this.sampleRepository.getFromServerProtectedByAuth0();
  }
}
