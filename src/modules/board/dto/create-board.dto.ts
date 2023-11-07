import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreateBoardDto {
    @IsNumber()
    @ApiProperty({ description: '작성자 아이디', required: true, example: '1' })
    userId: number;

    @ApiProperty({ description: '내용', required: true, example: 'leecoder-contents' })
    @IsNotEmpty()
    contents: string;
}
