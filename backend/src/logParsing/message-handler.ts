import { DeckMessageHandler } from "../decks/decks-message-handler";
import { GameMessageHandler } from "../games/game-message-handler";
import { DeckRepositoryMongoDB } from "../decks/deckMongoModel";
import { CustomMessage } from "./custom-message";

export class MessageHandler {

    private decksMessageHandler = new DeckMessageHandler(new DeckRepositoryMongoDB());
    private gameMessageHandler = new GameMessageHandler(new DeckRepositoryMongoDB());

    public async handleMessage(message: CustomMessage<Record<string, unknown>>) {
        if (this.decksMessageHandler.isAllDecksMessage(message)) {
            await this.decksMessageHandler.updateDecks(message);
        }
        if (this.decksMessageHandler.isOneDeckMessage(message)) {
            await this.decksMessageHandler.updateDeck(message);
        }
        if (this.gameMessageHandler.isGameMessage(message)) {
            await this.gameMessageHandler.handleMessage(message);
        }
    }
}
