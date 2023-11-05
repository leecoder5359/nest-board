import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exceptions/http.exceptions';
import {SwaggerConfig} from "./config/swagger.config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new HttpExceptionFilter());

    SwaggerConfig(app);
    await app.listen(3000);
}
bootstrap();
