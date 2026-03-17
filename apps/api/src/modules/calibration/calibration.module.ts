import { Module } from '@nestjs/common';
import { CalibrationController } from './calibration.controller';

@Module({
  controllers: [CalibrationController],
})
export class CalibrationModule {}
