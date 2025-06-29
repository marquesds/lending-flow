import { Module } from '@nestjs/common';
import { LendingController } from './controller/lending.controller';
import { TemporalClientService } from './temporal/temporal.client';
import { TemporalWorkerService } from './temporal/temporal-worker.service';

@Module({
  controllers: [LendingController],
  providers: [TemporalClientService, TemporalWorkerService],
})
export class CoreModule {}
