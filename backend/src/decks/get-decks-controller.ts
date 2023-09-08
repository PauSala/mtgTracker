import { Controller, Get, Route } from "tsoa";
import { DeckMongoDbModel } from "../infrastructure/mongoDb/deckMongoModel";
import { Deck } from "./decks-message-handler";

@Route("decks")
export class DeckController extends Controller {

    @Get()
    public async getDecks(): Promise<Deck[]> {
        return DeckMongoDbModel.find({});
    }
}
