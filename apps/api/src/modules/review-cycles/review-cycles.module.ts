import { Module } from '@nestjs/common';
import { ReviewCyclesController } from './review-cycles.controller';

@Module({
  controllers: [ReviewCyclesController],
})
export class ReviewCyclesModule {}
