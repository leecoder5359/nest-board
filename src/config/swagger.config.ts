import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export const SwaggerConfig = (app: INestApplication) => {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Nest Board')
        .setDescription('Board API description')
        .setVersion('1.0')
        .addTag('Board')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
}