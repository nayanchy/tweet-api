import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly dataSource: DataSource) {}
  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('Database connected!');
    } else {
      this.logger.error('Database not connected!');
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
