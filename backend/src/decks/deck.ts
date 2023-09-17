export type DeckStringAttributes = "Version" | "Format";
export type DeckDateAttributes = | "LastPlayed" | "LastUpdated";
export type DeckCard = { cardId: number, quantity: number };

export interface DeckToStore {
    attributes: Array<{ name: string, value: string }>
    deckId: string;
    mana: string;
    mainDeck: DeckCard[];
    reducedSideboard: DeckCard[];
    sideboard: DeckCard[];
    commandZone: unknown;
    companions: DeckCard[];
    hash: number;
    name: string;
    active: boolean;
    winrate: number;
}

export interface DeckDTO {
    versionId: string;
    attributes: Array<{ name: string, value: string }>;
    deckId: string;
    mana: string;
    mainDeck: DeckCard[];
    reducedSideboard: DeckCard[];
    sideboard: DeckCard[];
    commandZone: unknown;
    companions: DeckCard[];
    hash: number;
    name: string;
    active: boolean;
    winrate: number;
    createdAt: Date;
}
