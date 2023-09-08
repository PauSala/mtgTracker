import { GameObject, GameStateMessage } from "../domain/game-state-message";
import { DeckMongoDbModel } from "../infrastructure/mongoDb/deckMongoModel";
import { getCard } from "../infrastructure/sqliteDb/sqliteCardRepository";
import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { GreToClientMessageParser } from "../logParsing/parsers/greToClientEvent.parser";
import { MatchGameRoomStateChangedEventMessageParser } from "../logParsing/parsers/matchGameRoomStateChangedEventMessage.parser";
import { MatchGameRoomStateChangedEvent } from "../logParsing/parsers/messageTypes";
import { GameHandler } from "./game";
import { GameMongoDbModel } from "./game-mongo-db-model";


export class GameMessageHandler {

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

    public async handleMessage(message: CustomMessage<Record<string, unknown>>) {

        if (this.isSetMatchDeckMessage(message)) {
            const game = new GameHandler("");
            game.setPlayerDeck((<any>message.message.Summary).DeckId);
            GameMessageHandler.games.set("void", game);
            return
        }

        if (this.isStartGameMessage(message)) {
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
            game.setEndGameMessage(message.message as MatchGameRoomStateChangedEvent);
            this.handleGame(game);
            return;
        }
    }

    private async handleGame(game: GameHandler) {
        const toStore = await game.build();
        const model = new GameMongoDbModel(toStore);
        await model.save();
    }
}
