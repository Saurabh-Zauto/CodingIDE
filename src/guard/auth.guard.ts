import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization token is missing or invalid',
      );
    }
    const token = authorizationHeader.split(' ')[1];
    
      const isValidTenant = this.validateTenant(token);
      if (!isValidTenant) {
        throw new UnauthorizedException(
          'Invalid tenant associated with the provided token',
        );
      }
      request.token = token;
      return true;
    
  }

  private validateTenant(tenantId: string): boolean {
    return !!tenantId;
  }
}
