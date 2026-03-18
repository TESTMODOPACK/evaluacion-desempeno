import { Module } from '@nestjs/common';
import { ReviewCyclesController } from './review-cycles.controller';
import { ReviewCyclesService } from './review-cycles.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewCyclesController],
  providers: [ReviewCyclesService],
})
export class ReviewCyclesModule {}
