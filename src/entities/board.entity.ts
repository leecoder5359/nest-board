import {
    Column,
    CreateDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import {User} from "./user.entity";
import {ApiProperty} from '@nestjs/swagger';

@Entity()
export class Board {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @ApiProperty({description: 'user_id'})
    @Column()
    userId: number;

    @ApiProperty({description: '내용'})
    @Column()
    contents: string;

    @ApiProperty({description: '수정일'})
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({description: '생성일'})
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({description: '유저정보'})
    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user: User;
}