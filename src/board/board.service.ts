import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Board } from '../entities/board.entity';
import {UpdateBoardDto} from "./dto/update-board.dto";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    async findAll() {
        return this.boardRepository.find();
    }

    async findById(id: number) {
        const board = await this.getBoardById(id);

        if (!board) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

        return board;
    }

    async create(createBoardDto: CreateBoardDto) {
        return this.boardRepository.save(createBoardDto);
    }

    async update(id: number, updateBoardDto: UpdateBoardDto) {
        const board = await this.getBoardById(id);

        if (!board) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        return this.boardRepository.update(id, {...updateBoardDto});
    }

    async remove(id: number) {
        const board = await this.getBoardById(id);

        if (!board) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        await this.boardRepository.remove(board);
    }

    private async getBoardById(id: number) {
        return this.boardRepository.findOneBy({id});
    }
}
