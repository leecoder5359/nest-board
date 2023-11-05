import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateBoardDto {
    @MinLength(2)
    @MaxLength(20)
    @IsOptional()
    @ApiProperty({
        description: '이름',
        required: false,
        example: 'leecoder',
    })
    name?: string;

    @ApiProperty({
        description: '제목',
        required: false,
        example: 'leecoder-title',
    })
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: '내용',
        required: false,
        example: 'leecoder-contents',
    })
    @IsOptional()
    contents: string;
}
