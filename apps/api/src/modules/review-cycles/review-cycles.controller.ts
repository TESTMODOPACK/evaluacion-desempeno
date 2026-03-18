import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewCyclesService } from './review-cycles.service';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'review-cycles', version: '1' })
export class ReviewCyclesController {
  constructor(private readonly reviewCyclesService: ReviewCyclesService) {}

  @Get('organization/:orgId')
  list(@Param('orgId') orgId: string) {
    return this.reviewCyclesService.getCycles(orgId);
  }

  @Post('organization/:orgId')
  create(@Param('orgId') orgId: string, @Body() body: any) {
    return this.reviewCyclesService.createCycle(orgId, body);
  }
}
