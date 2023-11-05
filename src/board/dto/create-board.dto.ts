import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBoardDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty({
        description: '이름',
        required: true,
        example: 'leecoder',
    })
    name: string;

    @IsNotEmpty()
    @ApiProperty({
        description: '제목',
        required: true,
        example: 'leecoder-title',
    })
    title: string;

    @ApiProperty({
        description: '내용',
        required: true,
        example: 'leecoder-contents',
    })
    @IsNotEmpty()
    contents: string;
}
