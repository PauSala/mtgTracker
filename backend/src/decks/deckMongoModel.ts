import { IfUnknown, Schema, Types, model } from "mongoose";
import { DeckRepository } from "../domain/messageRepository";
import { DeckDTO, DeckToStore } from "./deck";


const Deck = {

    attributes: [{ name: { type: Schema.Types.String, required: false }, value: { type: Schema.Types.String, required: false }, _id: false }],
    deckId: { type: Schema.Types.String, required: false },
    mana: { type: Schema.Types.String, required: false },
    mainDeck: [{ cardId: { type: Schema.Types.Number, required: false }, quantity: { type: Schema.Types.Number, required: false }, _id: false }],
    reducedSideboard: [{ cardId: { type: Schema.Types.Number, required: false }, quantity: { type: Schema.Types.Number, required: false }, _id: false }],
    sideboard: [{ cardId: { type: Schema.Types.Number, required: false }, quantity: { type: Schema.Types.Number, required: false }, _id: false }],
    commandZone: [],
    companions: [{ cardId: { type: Schema.Types.Number, required: false }, quantity: { type: Schema.Types.Number, required: false }, _id: false }],
    name: { type: Schema.Types.String, required: false },
    hash: { type: Schema.Types.Number, required: true },
    active: { type: Schema.Types.Boolean, required: true },
    winrate: { type: Schema.Types.Number, required: true },
}

export const DeckSchema = new Schema(Deck, { timestamps: true });
export const DeckMongoDbModel = model("Decks", DeckSchema);

export class DeckRepositoryMongoDB implements DeckRepository {

    async getManyByDeckId(deckId: string) {
        return (await DeckMongoDbModel.find({ deckId }))
            .map(item => this.toDTO(item))
    }

    async find(filter: Record<string, unknown>) {
        return (await DeckMongoDbModel.find(filter))
            .map(item => this.toDTO(item));
    }

    async save(item: DeckToStore): Promise<void> {
        const deck = new DeckMongoDbModel(item);
        await deck.save();
    }
    async any(id: string) {
        const elem = await DeckMongoDbModel.find({ deckId: id });
        if (elem) {
            return true;
        }
        return false;
    }

    async updateMany(deckId: string, filter: Record<string, unknown>) {
        await DeckMongoDbModel.updateMany({ deckId }, filter);
    }

    private toDTO(deck: DeckToStore & { _id: Types.ObjectId, createdAt: Date }) {
        return {
            versionId: deck._id.toString(),
            attributes: deck.attributes,
            deckId: deck.deckId,
            mana: deck.mana,
            mainDeck: deck.mainDeck,
            reducedSideboard: deck.reducedSideboard,
            sideboard: deck.sideboard,
            commandZone: deck.commandZone,
            companions: deck.companions,
            hash: deck.hash,
            name: deck.name,
            active: deck.active,
            winrate: deck.winrate,
            createdAt: deck.createdAt,
        }
    }

}
