import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { DeckRepository } from "./messageRepository";
export type DeckStringAttributes = "Version" | "Format";
export type DeckDateAttributes = | "LastPlayed" | "LastUpdated";
export type DeckCard = { cardId: number, quantity: number };
import hash from "hash-it";

export interface Deck {
    attributes: Array<{ name: DeckStringAttributes, value: string } | { name: DeckDateAttributes, value: Date }>
    deckId: string;
    mana: string;
    mainDeck: DeckCard[];
    reducedSideboard: DeckCard[];
    sideboard: DeckCard[];
    commandZone: unknown;
    companions: DeckCard[];
    hash?: number;
    name: string;
}

export class DeckMessageHandler {

    private static readonly MESSAGE_NAME = "Event_GetCoursesV2";

    constructor(private messageRepository: DeckRepository) { }

    isDeckMessage(message: CustomMessage<Record<string, unknown>>) {

        return message.name === DeckMessageHandler.MESSAGE_NAME
            && message.type === FromClientMessageParser.MESSAGE_TYPE
            && message.message.Courses;
    }

    async saveDecks(message: CustomMessage<Record<string, unknown>>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decks: Deck[] = (message.message.Courses as Array<any>)
            .filter(c => c.CurrentModule === "Complete")
            .map(c => {
                const deck: Deck = {
                    attributes: c.CourseDeckSummary?.Attributes,
                    deckId: c.CourseDeckSummary?.DeckId,
                    mana: c.CourseDeckSummary?.Mana,
                    name: c.CourseDeckSummary?.Name,
                    mainDeck: c.CourseDeck?.MainDeck,
                    reducedSideboard: c.CourseDeck?.ReducedSideboard,
                    sideboard: c.CourseDeck?.Sideboard,
                    commandZone: c.CourseDeck?.CommandZone,
                    companions: c.CourseDeck?.Companions,
                }
                const deckHash = this.getHash(deck);
                deck.hash = deckHash;
                return deck;
            });
        for (const deck of decks) {
            const found = (await this.messageRepository.getManyByDeckId(deck.deckId))
                .filter(dbDeck => dbDeck.hash === deck.hash);
            if (!found.length) {
                await this.messageRepository.save(deck);
            }
        }
    }

    private getHash(deck: Deck) {
        return hash({
            0: deck.name,
            1: deck.mainDeck,
            2: deck.reducedSideboard,
            3: deck.sideboard,
            4: deck.commandZone,
            5: deck.companions
        })
    }
}
