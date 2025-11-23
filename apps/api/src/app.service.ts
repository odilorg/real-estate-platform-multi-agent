import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): { message: string; version: string; docs: string } {
    return {
      message: 'Real Estate Platform API',
      version: '1.0.0',
      docs: '/api/docs',
    };
  }
}
