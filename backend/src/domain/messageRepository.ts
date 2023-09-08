import { Deck } from "../decks/decks-message-handler";

export interface DeckRepository {
    save(item: Deck): Promise<void>;
    any(id: string): Promise<boolean>;
    getManyByDeckId(id: string): Promise<Deck[]>;
}
