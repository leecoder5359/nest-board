import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Ip = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => ctx.switchToHttp().getRequest().ip,
);
