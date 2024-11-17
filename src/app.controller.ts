import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('orders')
  async getOrders() {
    return await this.appService.getOrders();
  }

  @Get('payments')
  async getPayments() {
    return await this.appService.getPayments();
  }

  @Get('credits')
  async getCredits() {
    return await this.appService.getCredits();
  }
}
