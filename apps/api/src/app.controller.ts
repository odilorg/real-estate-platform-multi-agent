import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API root information' })
  @ApiResponse({ status: 200, description: 'API information returned successfully' })
  getRoot(): { message: string; version: string; docs: string } {
    return this.appService.getRoot();
  }
}
