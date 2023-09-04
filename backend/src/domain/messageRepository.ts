import { Deck } from "./decks-message";

export interface DeckRepository {
    save(item: Deck): Promise<void>;
    any(id: string): Promise<boolean>;
    getManyByDeckId(id: string): Promise<Deck[]>;
}
