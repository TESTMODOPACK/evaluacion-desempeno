import { Module } from '@nestjs/common';
import { NominationsController } from './nominations.controller';

@Module({
  controllers: [NominationsController],
})
export class NominationsModule {}
