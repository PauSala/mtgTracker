import { DeckMessageHandler } from "../decks/decks-message-handler";
import { GameMessageHandler } from "../games/game-message-handler";
import { DeckRepositoryMongoDB } from "../decks/deckMongoModel";
import { CustomMessage } from "./custom-message";
import { SeasonInfoMessageHandler } from "../seasonInfo/season-info-message-handler";
import { SeasonInfoRepository } from "../seasonInfo/season-info-mongo-model";
import { UserInfoRepository } from "../user-info/user-rank-info-mongo-model";
import { UserRankInfoMessagehandler } from "../user-info/user-rank-info-message-handler";

export class MessageHandler {

    private userInfoRepository = new UserInfoRepository();
    private decksMessageHandler = new DeckMessageHandler(new DeckRepositoryMongoDB());
    private gameMessageHandler = new GameMessageHandler(new DeckRepositoryMongoDB());
    private seasonInfoMessageHandler = new SeasonInfoMessageHandler(new SeasonInfoRepository());
    private userRankInfoMessagehandler = new UserRankInfoMessagehandler(this.userInfoRepository);
    private matchId!: string;

    public async handleMessage(message: CustomMessage<Record<string, unknown>>) {

        if (this.decksMessageHandler.isAllDecksMessage(message)) {
            await this.decksMessageHandler.updateDecks(message);
        }
        if (this.decksMessageHandler.isOneDeckMessage(message)) {
            await this.decksMessageHandler.updateDeck(message);
        }
        if (this.gameMessageHandler.isGameMessage(message)) {
            const matchId = await this.gameMessageHandler.handleMessage(message);
            if (matchId) {
                this.matchId = matchId;
            }
        }
        if (this.seasonInfoMessageHandler.isSeasonInfoMessage(message)) {
            await this.seasonInfoMessageHandler.saveSeasonInfo(message);
        }
        if (this.userRankInfoMessagehandler.isUserRankInfo(message)) {
            await this.userRankInfoMessagehandler.saveUserRankInfo(message, this.matchId);
        }
    }
}
