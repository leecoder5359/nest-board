import { BoardService } from './board.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Put,
    ValidationPipe,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Ip } from 'src/decorators/ip.decorator';

@Controller('board')
export class BoardController {
    private readonly logger = new Logger();

    constructor(private readonly boardService: BoardService) {}

    @Get()
    findAll(@Ip() ip: string) {
        this.logger.log('ip', ip);
        return this.boardService.findAll();
    }

    @Get('error')
    error() {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }

    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.boardService.findById(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) data: CreateBoardDto) {
        return this.boardService.create(data);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateBoardDto) {
        return this.boardService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.boardService.remove(id);
    }
}
