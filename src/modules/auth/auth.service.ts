import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) return null;

        const isMatch = await compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }

    async login(user: User) {
        const accessToken = this.jwtService.sign({
            id: user.id,
            username: user.email,
            name: user.name,
        });

        return { accessToken };
    }
}
