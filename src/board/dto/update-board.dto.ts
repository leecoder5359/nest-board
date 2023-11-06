import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';

export class UpdateBoardDto {
    @ApiProperty({
        description: '내용',
        required: true,
        example: 'leecoder-contents',
    })
    @IsNotEmpty()
    contents: string;
}
