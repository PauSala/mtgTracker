import { Schema, model, Types } from "mongoose";
export interface IMessage {
    type: string;
    name: string;
    belongsToMatch: boolean;
    matchId: string | null;
    message: Record<string, unknown>;
}

const Message = {
    type: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    belongsToMatch : {type: Schema.Types.Boolean, required: true},
    matchId : {type: Schema.Types.String, required: false},
    message: { type: Schema.Types.Mixed, required: true }
}

export const messageSchema = new Schema<IMessage>(Message, { timestamps: true });
export const FromClientMessageMongoDbModel = model<IMessage>("FromClientMessage", messageSchema);
export const FromServerMessageMongoDbModel = model<IMessage>("FromServerMessage", messageSchema);
export const GreToClientMessageMongoDbModel = model<IMessage>("GreToClientEvent", messageSchema);
export const ClientToGREMessageMongoDbModel = model<IMessage>("ClientToGREMessage", messageSchema);
export const MatchGameRoomStateMessageMongoDbModel = model<IMessage>("MatchGameRoomStateMessage", messageSchema);
