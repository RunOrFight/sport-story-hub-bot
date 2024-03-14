import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { GameService } from "../services/game.service";
import {
  TGameCreatePayload,
  TGameDeletePayload,
  TGameUpdatePayload,
} from "../types/game.types";
import { GameStatService } from "../services/game-stat.service";
import {
  TGameStatAddPayload,
  TGameStatDeletePayload,
} from "../types/game-stat.types";

@Route("/api/game")
@Tags("Games")
export class GameController {
  private gameService = new GameService();
  private gameStatService = new GameStatService();

  @Get("/getById/{id}")
  async getGameById(@Path() id: number) {
    return this.gameService.getGameById(id);
  }

  @Post("/create")
  async createGame(@Body() payload: TGameCreatePayload) {
    return this.gameService.createGame(payload);
  }

  @Put("/update")
  async updateGame(@Body() payload: TGameUpdatePayload) {
    return this.gameService.updateGame(payload);
  }

  @Delete("/delete")
  async deleteGame(@Body() payload: TGameDeletePayload) {
    return this.gameService.deleteGame(payload);
  }

  @Post("/stat/add")
  async addGameStat(@Body() payload: TGameStatAddPayload) {
    return this.gameStatService.addGameStat(payload);
  }

  @Delete("/stat/delete")
  async deleteGameStat(@Body() payload: TGameStatDeletePayload) {
    return this.gameStatService.deleteGameStat(payload);
  }
}
