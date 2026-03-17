import { Module } from '@nestjs/common';
import { ReviewInstancesController } from './review-instances.controller';

@Module({
  controllers: [ReviewInstancesController],
})
export class ReviewInstancesModule {}
