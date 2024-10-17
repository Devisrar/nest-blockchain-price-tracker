import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];

    if (!apiKey || apiKey !== process.env.MORALIS_API_KEY) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
