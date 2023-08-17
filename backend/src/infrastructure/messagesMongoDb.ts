import { Schema, model, Types } from "mongoose";
export interface IMessage{
    type: string;
    message: Record<string, unknown>;
}

const Message = {
    type: { type: Schema.Types.String, required: true },
    message: { type: Schema.Types.Mixed, required: true }
}

export const messageSchema = new Schema<IMessage>(Message, {timestamps: true});
export const MessageMongoDbModel = model<IMessage>("message", messageSchema);
