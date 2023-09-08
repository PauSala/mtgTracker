import { DeckMessageHandler } from "../decks/decks-message-handler";
import { GameMessageHandler } from "../games/game-message-handler";
import { DeckRepositoryMongoDB } from "../infrastructure/mongoDb/deckMongoModel";
import { CustomMessage } from "./custom-message";

export class MessageHandler {

    private decksMessageHandler = new DeckMessageHandler(new DeckRepositoryMongoDB());
    private gameMessageHandler = new GameMessageHandler();

    public async handleMessage(message: CustomMessage<Record<string, unknown>>) {
        if (this.decksMessageHandler.isAllDecksMessage(message)) {
            await this.decksMessageHandler.updateDecks(message);
            return;
        }
        if (this.gameMessageHandler.isGameMessage(message)) {
            await this.gameMessageHandler.handleMessage(message);
            return;
        }
    }
}
