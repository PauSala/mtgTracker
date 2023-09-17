import { Controller, Get, Route, Path } from "tsoa";
import { GameRepository, IGameResult } from "./game-mongo-db-model";


@Route("games")
export class GetGamesController extends Controller {

    private gameRepository = new GameRepository();

    @Get("{deckId}")
    public async getDecks(
        @Path() deckId: string
    ): Promise<IGameResult[]> {
        return this.gameRepository.getManyByDeckId(deckId);
    }
}
