import { Schema, model, Types } from "mongoose";
export interface ICard {
    arena_id: number;
    name: string;
    lang: string;
    image_uris: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
    }[];
}


const Card = {
    arena_id: { type: Schema.Types.Number, required: true },
    name: { type: Schema.Types.String, required: true },
    lang: { type: Schema.Types.String, required: true },
    image_uris: [{
        small: { type: Schema.Types.String, required: false },
        normal: { type: Schema.Types.String, required: false },
        large: { type: Schema.Types.String, required: false },
        png: { type: Schema.Types.String, required: false },
        art_crop: { type: Schema.Types.String, required: false },
        border_crop: { type: Schema.Types.String, required: false }
    }]
}

export const CardSchema = new Schema<ICard>(Card);
export const CardMongoDbModel = model<ICard>("Cards", CardSchema);
