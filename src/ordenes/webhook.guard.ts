import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const secret = req.headers['x-webhook-secret'];
    if (!secret || secret !== this.config.get('WEBHOOK_SECRET')) {
      throw new UnauthorizedException('Webhook no autorizado');
    }
    return true;
  }
}