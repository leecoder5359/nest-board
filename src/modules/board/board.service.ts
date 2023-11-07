import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../../entities/board.entity';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    async findAll() {
        return this.boardRepository.find();
    }

    async findById(id: number) {
        const board = await this.boardRepository.findOne({
            where: {
                id,
            },
            relations: {
                user: true,
            },
        });

        if (!board) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

        return board;
    }

    async create(createBoardDto: CreateBoardDto) {
        return this.boardRepository.save(createBoardDto);
    }

    async update(userId: number, id: number, updateBoardDto: UpdateBoardDto) {
        const board = await this.getBoardById(id);

        if (!board) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        await this.validUserForBoard(userId, board.userId);

        return this.boardRepository.update(id, { ...updateBoardDto });
    }

    async remove(userId: number, id: number) {
        const board = await this.getBoardById(id);

        if (!board) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        await this.validUserForBoard(userId, board.userId);

        await this.boardRepository.remove(board);
    }

    private async getBoardById(id: number) {
        return this.boardRepository.findOneBy({ id });
    }

    private async validUserForBoard(userId: number, boardUserId: number) {
        if (userId !== boardUserId) throw new UnauthorizedException();
    }
}
