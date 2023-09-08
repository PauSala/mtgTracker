import { Schema, model, Types } from "mongoose";
export interface IGameResult {
    playerDeckId: string;
    opponentDeckColors: string[];
    result: string;
    oponent: string;
    matchId: string;
    onThePlay: boolean
}

const GameResult = {
    matchId: { type: Schema.Types.String, required: true },
    playerDeckId: { type: Schema.Types.String, required: true },
    oponentDeckColors: [{ type: Schema.Types.String, required: true }],
    result: { type: Schema.Types.String, required: true },
    oponent: { type: Schema.Types.String, required: true },
    onThePlay: { type: Schema.Types.Boolean, required: true },
}

export const DeckSchema = new Schema<IGameResult>(GameResult);
export const GameMongoDbModel = model<IGameResult>("Games", DeckSchema);
