import { Module } from '@nestjs/common';
import { AprController } from './controllers/apr.controller';

@Module({
  controllers: [AprController],
})
export class AprModule {}
