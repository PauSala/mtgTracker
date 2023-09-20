import { Schema, model, Types } from "mongoose";
import { PlayerStats } from "../user-info/user-rank-info";
import { playerStatsSchema } from "../user-info/user-rank-info-mongo-model";
export interface IGameResult {
    playerDeckId: string;
    opponentDeckColors: string[];
    result: string;
    oponent: string;
    matchId: string;
    onThePlay: boolean;
    date: Date
}

const GameResult = {
    matchId: { type: Schema.Types.String, required: true },
    playerDeckId: { type: Schema.Types.String, required: true },
    versionDeckId: { type: Schema.Types.String, required: false },
    oponentDeckColors: [{ type: Schema.Types.String, required: true }],
    result: { type: Schema.Types.String, required: true },
    oponent: { type: Schema.Types.String, required: true },
    onThePlay: { type: Schema.Types.Boolean, required: true },
    date: { type: Schema.Types.Date, required: true }
}

export const DeckSchema = new Schema<IGameResult>(GameResult);
export const GameMongoDbModel = model<IGameResult>("Games", DeckSchema);

export class GameRepository {
    async getManyByDeckId(deckId: string) {
        return GameMongoDbModel.find({ playerDeckId: deckId });
    }

    async getManyByVersionId(versionDeckId: string) {
        return GameMongoDbModel.find({ versionDeckId });
    }
}
