import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AprModule } from './apr/apr.module';

@Module({
  imports: [CoreModule, AprModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
