import { DeckDTO, DeckToStore } from "../decks/deck";

export interface DeckRepository {
    save(item: DeckToStore): Promise<void>;
    any(id: string): Promise<boolean>;
    getManyByDeckId(id: string): Promise<DeckDTO[]>;
    updateMany(deckId: string, filter: Record<string, unknown>): Promise<void>;
}
