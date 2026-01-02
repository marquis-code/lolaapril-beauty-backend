// monitoring/monitoring.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggerService, MetricsService],
  exports: [LoggerService, MetricsService],
})
export class MonitoringModule {}