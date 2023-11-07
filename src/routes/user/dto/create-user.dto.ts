import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: '이메일', required: true, example: 'leecoder5359@gmail.com' })
    email: string;

    @MinLength(8)
    @IsNotEmpty()
    @ApiProperty({ description: '비밀번호', required: true, example: '12345678' })
    password: string;

    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty({ description: '유저 이름', required: true, example: 'leecoder' })
    name: string;
}
