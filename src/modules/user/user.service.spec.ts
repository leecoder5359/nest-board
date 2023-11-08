import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fakerDE as faker } from '@faker-js/faker';
import { CipherUtil } from '../../utils/cipher.util';
import { CreateUserDto } from './dto/create-user.dto';

const getRandomUsers = () => {
    const users: User[] = new Array(10);
    return users.fill(getRandomUser());
};

const getRandomUser = () => {
    const user = new User();
    user.id = faker.number.int();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.name = faker.internet.userName();
    user.boardCount = faker.number.int();

    return user;
};

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<User>;
    const userRepositoryToken = getRepositoryToken(User);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: userRepositoryToken,
                    useValue: {
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                        createQueryBuilder: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(userRepositoryToken);
    });

    it('userService should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('userRepository should be defined', () => {
        expect(userRepository).toBeDefined();
    });

    describe('유저목록 가져오기', () => {
        it('성공시', async () => {
            const expectedUsers = getRandomUsers();
            const createQueryBuilderSpy = jest
                .spyOn(userRepository, 'createQueryBuilder')
                .mockReturnValue({
                    addSelect: jest.fn().mockReturnThis() as any,
                    getMany: jest.fn().mockResolvedValue(expectedUsers) as any,
                } as any as SelectQueryBuilder<User>);

            const users = await userService.getUser();

            expect(createQueryBuilderSpy).toHaveBeenCalled();

            for (const user of users) {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('email');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('boardCount');
            }
        });
    });

    describe('유저 생성', () => {
        it('성공 시', async () => {
            const plainPassword = 'testpassword';
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: plainPassword,
                name: 'Test User',
            };

            const hashedPassword = 'hashed_password';
            jest.spyOn(CipherUtil, 'hashText').mockResolvedValue(hashedPassword);

            const savedUser: User = {
                id: 1,
                email: createUserDto.email,
                password: hashedPassword,
                name: createUserDto.name,
            };

            jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

            const createdUser = await userService.createUser(createUserDto);

            expect(CipherUtil.hashText).toHaveBeenCalledWith(plainPassword);
            expect(userRepository.save).toHaveBeenCalledWith(createUserDto);

            expect(createdUser).toEqual(savedUser);
        });
    });

    describe('email로 유저정보 찾기', () => {
        it('성공 시', async () => {
            const expectedBoard = getRandomUser();
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(expectedBoard);
            const result = await userService.getUserByEmail(expectedBoard.email);
            expect(expectedBoard).toEqual(result);
        });
    });
});
