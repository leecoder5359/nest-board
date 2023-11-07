import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Board } from '../../entities/board.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcrypt';
import { CipherUtil } from '../../utils/cipher.util';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getUser() {
        const queryBuilder = this.userRepository.createQueryBuilder();

        queryBuilder.addSelect((subQuery) => {
            return subQuery
                .select('count(id)')
                .from(Board, 'Board')
                .where('Board.userId = User.id');
        }, 'User_boardCount');

        return queryBuilder.getMany();
    }

    async createUser(createUserDto: CreateUserDto) {
        const password = createUserDto.password;

        createUserDto.password = await CipherUtil.hashText(password);

        return await this.userRepository.save(createUserDto);
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new HttpException('NOT FOUND USER', HttpStatus.NOT_FOUND);

        const isMatch = await CipherUtil.isHashValid(password, user.password);
        if (!isMatch) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

        return user;
    }
}
