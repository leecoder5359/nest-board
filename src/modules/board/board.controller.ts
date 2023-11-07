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
    UseGuards,
} from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Ip } from 'src/decorators/ip.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '../../decorators/user-info.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('board')
@ApiTags('Board')
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
    @UseGuards(JwtAuthGuard)
    create(@GetUserId() userId: number, @Body('contents') contents: string) {
        return this.boardService.create({ userId: userId, contents });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @GetUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateBoardDto,
    ) {
        return this.boardService.update(userId, id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@GetUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.boardService.remove(userId, id);
    }
}
