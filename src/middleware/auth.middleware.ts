import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from '../auth/auth.service';
  
  @Injectable()
  export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}
  
    async use(req: any, res: any, next: () => void) {
      const user = await this.authService.validateToken(
        req.headers['authorization'],
      );
      if (user.status === 'error') {
        throw new UnauthorizedException();
      }
      next();
    }
  }
  