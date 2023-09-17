import { GameStateMessage } from "../domain/game-state-message";
import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { GreToClientMessageParser } from "../logParsing/parsers/greToClientEvent.parser";
import { MatchGameRoomStateChangedEventMessageParser } from "../logParsing/parsers/matchGameRoomStateChangedEventMessage.parser";
import { MatchGameRoomStateChangedEvent } from "../logParsing/parsers/messageTypes";
import { GameHandler } from "./game";
import { GameMongoDbModel } from "./game-mongo-db-model";
import { DeckRepository } from "../domain/messageRepository";
import { DeckDTO, DeckToStore } from "../decks/deck";


export class GameMessageHandler {

    constructor(private deckRepository: DeckRepository) { }

    public static games: Map<string, GameHandler> = new Map();

    public isGameMessage(message: CustomMessage<Record<string, unknown>>) {
        return this.isStartGameMessage(message)
            || this.isEndGameMessage(message)
            || this.isGameStateMessage(message)
            || this.isSetMatchDeckMessage(message)

    }

    private isSetMatchDeckMessage(message: CustomMessage<Record<string, unknown>>) {
        return message.type === FromClientMessageParser.MESSAGE_TYPE
            && message.name === "Deck_UpsertDeckV2";
    }

    private isStartGameMessage(message: CustomMessage<Record<string, unknown>>) {
        return message.type === MatchGameRoomStateChangedEventMessageParser.MESSAGE_TYPE
            && (<CustomMessage<MatchGameRoomStateChangedEvent>>message).message.matchGameRoomStateChangedEvent?.gameRoomInfo
            && !(<CustomMessage<MatchGameRoomStateChangedEvent>>message).message.matchGameRoomStateChangedEvent?.gameRoomInfo.finalMatchResult;
    }

    private isEndGameMessage(message: CustomMessage<Record<string, unknown>>) {
        return message.type === MatchGameRoomStateChangedEventMessageParser.MESSAGE_TYPE
            && "finalMatchResult" in (<CustomMessage<MatchGameRoomStateChangedEvent>>message).message.matchGameRoomStateChangedEvent?.gameRoomInfo;
    }

    private isGameStateMessage(message: CustomMessage<Record<string, unknown>>) {
        return message.type === GreToClientMessageParser.MESSAGE_TYPE
            && "greToClientMessages" in (<any>message.message.greToClientEvent);
    }

    private findActiveDeck(decks: DeckDTO[]) {
        const sorted = [...decks.sort(
            (a, b) => {
                const value = new Date(a.attributes.find(a => a.name === "LastPlayed")?.value?.replace(/"/g, "") || "").getTime()
                    - new Date(b.attributes.find(a => a.name === "LastPlayed")?.value?.replace(/"/g, "") || "").getTime()
                return value
            })
        ];
        return sorted.pop();

    }

    public async handleMessage(message: CustomMessage<Record<string, unknown>>) {

        if (this.isSetMatchDeckMessage(message)) {

            console.log("---------------------");
            console.log("   SET MATCH         ");
            console.log("---------------------");

            const game = new GameHandler("");
            const deckId = (<any>message.message.Summary).DeckId;
            const decks = await this.deckRepository.getManyByDeckId(deckId);
            const activeDeckId = this.findActiveDeck(decks as DeckDTO[])?.versionId as string;
            game.setDeck(activeDeckId);
            game.setPlayerDeck((<any>message.message.Summary).DeckId);
            GameMessageHandler.games.set("void", game);
            return
        }

        if (this.isStartGameMessage(message)) {
            console.log("---------------------");
            console.log("   GET MATCH ID      ");
            console.log("---------------------");
            let game = GameMessageHandler.games.get("void");
            if (game) {
                game.setId(message.matchId!);
                GameMessageHandler.games.set(message.matchId!, game);
                GameMessageHandler.games.delete("void");
            }
            return
        }

        let game = GameMessageHandler.games.get(message.matchId!);
        if (!game) {
            return
        }

        if (this.isGameStateMessage(message)) {
            game.setUserId(message.userMatchId!);
            const gameStateMessages: Array<GameStateMessage> = (<any>message.message.greToClientEvent)?.greToClientMessages
                .filter((e: any) => e.type === "GREMessageType_GameStateMessage");
            gameStateMessages.forEach(msg => game?.addGameStateMessage(msg));
            return;
        }

        if (this.isEndGameMessage(message)) {
            console.log("---------------------");
            console.log("   END GAME          ");
            console.log("---------------------");
            game.setEndGameMessage(message.message as MatchGameRoomStateChangedEvent);
            this.handleGame(game);
            return;
        }
    }

    private async handleGame(game: GameHandler) {
        const toStore = await game.build();
        const found = await GameMongoDbModel.findOne({ matchId: toStore.matchId });
        if (!found) {
            const model = new GameMongoDbModel(toStore);
            await model.save();
        }
        const gamesByDeck = await GameMongoDbModel.find({ playerDeckId: toStore.playerDeckId });
        const totalGames = gamesByDeck.length;
        const winrate = gamesByDeck.filter(game => game.result === "win").length / totalGames;
        await this.deckRepository.updateMany(toStore.playerDeckId, { winrate });
    }
}
