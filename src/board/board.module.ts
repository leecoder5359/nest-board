import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Board} from "../entities/board.entity";
import {User} from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Board, User])],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
