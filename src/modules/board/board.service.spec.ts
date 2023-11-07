import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository, UpdateResult } from 'typeorm';
import { Board } from '../../entities/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fakerDE as faker } from '@faker-js/faker';
import {
    HttpException,
    HttpStatus,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

const getRandomBoards = () => {
    const boards: Board[] = new Array(10);
    return boards.fill(getRandomBoard());
};

const getRandomBoard = () => ({
    user: undefined,
    id: faker.number.int(),
    userId: faker.number.int(),
    contents: faker.lorem.sentence(),
    updatedAt: faker.date.past(),
    createdAt: faker.date.recent(),
});

describe('BoardService', () => {
    let boardService: BoardService;
    let boardRepository: Repository<Board>;
    const boardRepositoryToken = getRepositoryToken(Board);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BoardService,
                {
                    provide: boardRepositoryToken,
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        boardService = module.get<BoardService>(BoardService);
        boardRepository = module.get<Repository<Board>>(boardRepositoryToken);
    });

    it('boardService be defined', () => {
        expect(boardService).toBeDefined();
    });

    it('boardRepository be defined', () => {
        expect(boardRepository).toBeDefined();
    });

    describe('전체 게시글 조회', () => {
        it('성공시', async () => {
            const expectedBoards = getRandomBoards();
            jest.spyOn(boardRepository, 'find').mockResolvedValue(expectedBoards);
            const boards: Board[] = await boardService.findAll();
            expect(boards).toEqual(expectedBoards);
        });

        it('게시물이 없을경우', async () => {
            const expectedBoards = new Array<Board>();
            jest.spyOn(boardRepository, 'find').mockResolvedValue(expectedBoards);
            const boards = await boardService.findAll();
            expect(boards).toEqual(expectedBoards);
        });
    });

    describe('게시글 조회', () => {
        it('성공 시', async () => {
            const expectedBoard = getRandomBoard();
            jest.spyOn(boardRepository, 'findOne').mockResolvedValue(expectedBoard);
            const board = await boardService.findById(expectedBoard.id);
            expect(board).toBe(expectedBoard);
        });

        it('해당하는 게시글 id가 없을 경우', async () => {
            jest.spyOn(boardRepository, 'findOne').mockResolvedValue(undefined);

            try {
                await boardService.findById(999); // 여기에 존재하지 않는 ID를 전달
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
                expect(e.message).toBe('NotFound');
                expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('게시글 생성', () => {
        it('성공 시', async () => {
            const expectedBoard = getRandomBoard();

            const createBoardDto = new CreateBoardDto();
            createBoardDto.userId = expectedBoard.userId;
            createBoardDto.contents = expectedBoard.contents;

            jest.spyOn(boardRepository, 'save').mockResolvedValue(expectedBoard);
            const createdBoard = await boardService.create(createBoardDto);
            expect(createdBoard).toEqual(expectedBoard);
        });
    });

    describe('게시글 수정', () => {
        const expectedBoard = getRandomBoard();
        const updateBoardDto = new UpdateBoardDto();
        updateBoardDto.contents = 'change contents';

        it('성공 시', async () => {
            const expectedUpdateResult = UpdateResult.from({
                raw: null,
                affected: 1,
                records: [],
            });

            jest.spyOn(boardRepository, 'findOneBy').mockResolvedValue(expectedBoard);
            jest.spyOn(boardRepository, 'update').mockResolvedValue(expectedUpdateResult);

            const updatedBoard = await boardService.update(
                expectedBoard.userId,
                expectedBoard.id,
                updateBoardDto,
            );

            expect(updatedBoard).toBeInstanceOf(UpdateResult);
            expect(updatedBoard).toEqual(updatedBoard);
        });

        it('조회된 게시물 id 가 없을 경우', async () => {
            jest.spyOn(boardRepository, 'findOneBy').mockResolvedValue(expectedBoard);

            try {
                await boardService.update(
                    expectedBoard.userId,
                    expectedBoard.id - 1,
                    updateBoardDto,
                );
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });

        it('작성자와 수정하는 사람의 id가 다를 경우', async () => {
            jest.spyOn(boardRepository, 'findOneBy').mockResolvedValue(expectedBoard);
            try {
                await boardService.update(
                    expectedBoard.userId - 1, // 다른 사용자 ID
                    expectedBoard.id,
                    updateBoardDto,
                );
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
            }
        });
    });

    describe('게시물 삭제', () => {
        const expectedBoard = getRandomBoard();

        it('성공 시', async () => {
            jest.spyOn(boardRepository, 'findOneBy').mockResolvedValue(expectedBoard);
            const { userId, id } = expectedBoard;
            await boardService.remove(userId, id);
            expect(boardRepository.remove).toHaveBeenCalledWith(expectedBoard);
        });

        it('조회된 게시물 id 가 없을 경우 ', async () => {
            try {
                await boardService.remove(1, 1);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
                expect(e.message).toBe('NOT_FOUND');
                expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
            }
        });

        it('작성자와 삭제하는 사람의 id가 다를 경우', async () => {
            const userId = 1;
            const boardId = 1;

            try {
                jest.spyOn(boardRepository, 'findOneBy').mockResolvedValue(expectedBoard);

                await boardService.remove(
                    expectedBoard.userId - 1, // 다른 사용자 ID
                    expectedBoard.id,
                );
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
            }
        });
    });
});
