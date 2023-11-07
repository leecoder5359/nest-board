import { ExecutionContext, createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    return getUserInExecutionContext(ctx);
});

export const GetUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const user = getUserInExecutionContext(ctx);
    return Number(user.id);
});

const getUserInExecutionContext = (ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;
    if (!user) throw new UnauthorizedException();

    return user;
};
