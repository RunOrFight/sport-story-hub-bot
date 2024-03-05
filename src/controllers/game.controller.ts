import { Body, Delete, Get, Post, Put, Route, Tags } from "tsoa";
import { GameService } from "../services/game.service";
import {
  TGameCreatePayload,
  TGameDeletePayload,
  TGameUpdatePayload,
} from "../types/game.types";

@Route("/api/game")
@Tags("Games")
export class GameController {
  private gameService = new GameService();

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
}
