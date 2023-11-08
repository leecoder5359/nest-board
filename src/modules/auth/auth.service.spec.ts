import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CipherUtil } from '../../utils/cipher.util';

const getExpectedUser = async (email: string, password: string) => {
    const hashPassword = await CipherUtil.hashText(password);
    return {
        id: 1,
        email,
        password: hashPassword,
        name: 'Test User',
    };
};

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    const mockUserService = {
        getUserByEmail: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('AuthService should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('UserService should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('JwtService should be defined', () => {
        expect(jwtService).toBeDefined();
    });

    describe('이메일 패스워드로 유저 검증', () => {
        const email = 'test@example.com';
        const password = 'password';

        it('성공 시', async () => {
            const expectedUser = await getExpectedUser(email, password);
            mockUserService.getUserByEmail.mockResolvedValue(expectedUser);
            const result = await authService.validateUser(email, password);
            expect(result).toEqual(expectedUser);
        });

        it('실패 시 - 올바른 이메일, 비밀번호 불일치 - null 반환', async () => {
            const expectedUser = await getExpectedUser(email, password);
            mockUserService.getUserByEmail.mockResolvedValue(expectedUser);
            const result = await authService.validateUser(email, 'wrongPassword');
            expect(result).toBeNull();
        });

        it('실패 시 - 존재하지 않는 이메일 - null 반환', async () => {
            mockUserService.getUserByEmail.mockResolvedValue(null);
            const result = await authService.validateUser('nonexistent@example.com', 'password');
            expect(result).toBeNull();
        });
    });

    describe('로그인 accessToken 발급', () => {
        const email = 'test@example.com';
        const password = 'password';

        it('성공시', async () => {
            const accessToken = 'fakeAccessToken';
            const expectedUser = await getExpectedUser(email, password);

            mockJwtService.sign.mockReturnValue(accessToken);

            const result = await authService.login(expectedUser);

            expect(result).toEqual({ accessToken });
        });
    });
});
