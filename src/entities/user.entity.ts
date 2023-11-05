import { ApiProperty } from '@nestjs/swagger';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Board} from "./board.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: '유저이메일',
        example: 'leecoder5359@gmail.com',
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        description: '비밀번호',
        example: '12345',
    })
    @Column({ select: false })
    password: string;

    @ApiProperty({
        description: '이름',
        example: 'leecoder',
    })
    @Column()
    name: string;

    @ApiProperty({
        description: '작성한 게시물 리스트',
    })
    @OneToMany(() => Board, (board) => board.userId)
    boards: Board[]
}
