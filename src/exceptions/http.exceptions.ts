import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const massage = exception.getResponse();
        const request = ctx.getRequest<Request>();

        response.status(status).json({
            statusCode: status,
            massage: massage,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
