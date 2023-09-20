import { GameStateMessage } from "../domain/game-state-message";
import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { GreToClientMessageParser } from "../logParsing/parsers/greToClientEvent.parser";
import { MatchGameRoomStateChangedEventMessageParser } from "../logParsing/parsers/matchGameRoomStateChangedEventMessage.parser";
import { MatchGameRoomStateChangedEvent } from "../logParsing/parsers/messageTypes";
import { GameHandler } from "./game";
import { GameMongoDbModel } from "./game-mongo-db-model";
import { DeckRepository } from "../domain/messageRepository";
import { DeckDTO } from "../decks/deck";


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

            console.log(`\x1b[36mSET MATCH ID\n\x1b[0m`);

            const game = new GameHandler("");
            const deckId = (<any>message.message.Summary).DeckId;
            game.setPlayerDeck(deckId);
            GameMessageHandler.games.set("void", game);
            return
        }

        if (this.isStartGameMessage(message)) {
            console.log(`\x1b[36mGET MATCH ID\n\x1b[0m`);
            let game = GameMessageHandler.games.get("void");
            if (game) {
                game.setId(message.matchId!);
                GameMessageHandler.games.set(message.matchId!, game);
                GameMessageHandler.games.delete("void");
            }
            return message.matchId!
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
            console.log(`\x1b[36mEND GAME\n\x1b[0m`);
            game.setEndGameMessage(message.message as MatchGameRoomStateChangedEvent);
            this.handleGame(game);
            return;
        }
    }

    private async handleGame(game: GameHandler) {

        const foundActiveDeck = this.findActiveDeck((await this.deckRepository.getManyByDeckId(game.getPlayerDeck())));
        if (foundActiveDeck) {
            console.log(`\x1b[36mFOUND IN POST GAME: ${foundActiveDeck.versionId}\n\x1b[0m`);
            await this.deckRepository.updateMany(foundActiveDeck?.deckId, { active: true })
        }
        const deckId = foundActiveDeck?.versionId || "";
        game.setDeckId(deckId);

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
