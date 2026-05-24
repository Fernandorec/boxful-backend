import { Module } from '@nestjs/common';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}