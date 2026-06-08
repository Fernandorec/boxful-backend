import { Module } from '@nestjs/common';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { AuthModule } from '../auth/auth.module';
import { WebhookGuard } from './webhook.guard';

@Module({
  imports: [AuthModule],
  controllers: [OrdenesController],
  providers: [OrdenesService, WebhookGuard],
})
export class OrdenesModule {}