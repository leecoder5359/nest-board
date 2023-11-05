import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateBoardDto} from './dto/create-board.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entities/user.entity";
import {Board} from "../entities/board.entity";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ) {
    }

    async findAll() {
        return this.boardRepository.find();
    }

    async findById(id: number) {
        const board = await this.boardRepository.findOneBy({id});

        if (!board) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

        return board
    }
    async update(id: number, data: any) {

    }

    getBoardIndexById(id) {
    }

    async remove(id: number) {
    }

    async create(data: CreateBoardDto) {
    }

    private getNewId() {
    }
}
