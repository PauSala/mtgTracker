import { Controller, Get, Route } from "tsoa";
import { DeckRepositoryMongoDB } from "./deckMongoModel";
import { DeckDTO } from "./deck";

@Route("decks")
export class DeckController extends Controller {

    private deckRepository = new DeckRepositoryMongoDB();

    @Get()
    public async getDecks(): Promise<DeckDTO[]> {
        return this.deckRepository.find({ active: true });
    }
}
