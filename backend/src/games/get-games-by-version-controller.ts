import { Controller, Get, Route, Path } from "tsoa";
import { GameRepository, IGameResult } from "./game-mongo-db-model";


@Route("games/version")
export class GetGamesByVersionController extends Controller {

    private gameRepository = new GameRepository();

    @Get("{deckId}")
    public async getDecksByVersion(
        @Path() deckId: string
    ): Promise<IGameResult[]> {
        return this.gameRepository.getManyByVersionId(deckId);
    }
}
