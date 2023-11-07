import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { LocalAuthGuard } from '../src/modules/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let localAuthGuard: LocalAuthGuard;
    let jwtAuthGuard: JwtAuthGuard;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    context.switchToHttp().getRequest().getContext().req.user = {
                        id: 1,
                        email: 'test@test.com',
                        password: '12345678',
                    };
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        authService = moduleFixture.get<AuthService>(AuthService);
        localAuthGuard = moduleFixture.get<LocalAuthGuard>(LocalAuthGuard);
        jwtAuthGuard = moduleFixture.get<JwtAuthGuard>(JwtAuthGuard);
    });

    it('/ (GET)', async () => {
        const response = await request(app.getHttpServer()).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('/login (POST) - with valid credentials', async () => {
        jest.spyOn(localAuthGuard, 'canActivate').mockImplementation(() => true);
        jest.spyOn(authService, 'login').mockResolvedValue({ accessToken: 'accessToken' });

        const response = await request(app.getHttpServer()).post('/login').send({
            email: 'test@test.com',
            password: '12345678',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
    });

    it('/me (GET) - with JWT', async () => {
        jest.spyOn(jwtAuthGuard, 'canActivate').mockImplementation(() => true);
        const response = await request(app.getHttpServer())
            .get('/me')
            .set('Authorization', `Bearer accessToken`);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('/me (GET) - 인증 실패한 유저', async () => {
        jest.spyOn(jwtAuthGuard, 'canActivate').mockImplementation(() => false);

        const response = await request(app.getHttpServer())
            .get('/me')
            .set('Authorization', `Bearer accessToken`);

        expect(response.status).toBe(403);
    });
});
