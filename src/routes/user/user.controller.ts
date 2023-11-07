import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Post('login')
    login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto);
    }

    me() {}

    @Get()
    getUsers() {
        return this.userService.getUser();
    }
}
