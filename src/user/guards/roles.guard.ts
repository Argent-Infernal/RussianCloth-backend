import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Доступ запрещен');
        }

        if (user.role === 'admin') {
            return true;
        }

        throw new ForbiddenException('Доступ запрещен');
    }
}