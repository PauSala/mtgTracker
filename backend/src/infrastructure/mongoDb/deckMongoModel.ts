import { Schema, model } from "mongoose";
import { DeckRepository } from "../../domain/messageRepository";
import { Deck } from "../../decks/decks-message-handler";


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
    hash: { type: Schema.Types.Number, required: true }
}

export const DeckSchema = new Schema(Deck);
export const DeckMongoDbModel = model("Decks", DeckSchema);

export class DeckRepositoryMongoDB implements DeckRepository {

    async getManyByDeckId(deckId: string): Promise<Deck[]> {
        return DeckMongoDbModel.find({ deckId });
    }

    async save(item: Deck): Promise<void> {
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

}
