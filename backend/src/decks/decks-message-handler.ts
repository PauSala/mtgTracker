import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { DeckRepository } from "../domain/messageRepository";
import hash from "hash-it";
import { DeckDTO, DeckToStore } from "./deck";



export class DeckMessageHandler {

    private static readonly MESSAGE_NAME = "Event_GetCoursesV2";

    constructor(private deckRepository: DeckRepository) { }

    isAllDecksMessage(message: CustomMessage<Record<string, unknown>>) {

        return message.name === DeckMessageHandler.MESSAGE_NAME
            && message.type === FromClientMessageParser.MESSAGE_TYPE
            && message.message.Courses;
    }

    isOneDeckMessage(message: CustomMessage<Record<string, unknown>>) {

        return message.type === FromClientMessageParser.MESSAGE_TYPE
            && message.name === "Deck_UpsertDeckV2";
    }

    async updateDeck(message: CustomMessage<Record<string, any>>) {
        console.log(`\x1b[36mUPDATE DECK ACTIVE\n\x1b[0m`);
        const name = message.message.Summary.Name;
        const deckId = message.message.Summary.DeckId;
        await this.deckRepository.updateMany(deckId, { name, active: true });
    }

    async updateDecks(message: CustomMessage<Record<string, unknown>>) {
        console.log(`\x1b[36mSAVE OR UPDATE ALL DECKS\n\x1b[0m`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decks: DeckToStore[] = (message.message.Courses as Array<any>)
            .filter(c => ["Complete", "CreateMatch"].includes(c.CurrentModule))
            .map(c => {
                const deck: DeckToStore = {
                    attributes: c.CourseDeckSummary?.Attributes,
                    deckId: c.CourseDeckSummary?.DeckId,
                    mana: c.CourseDeckSummary?.Mana,
                    name: c.CourseDeckSummary?.Name,
                    mainDeck: c.CourseDeck?.MainDeck,
                    reducedSideboard: c.CourseDeck?.ReducedSideboard,
                    sideboard: c.CourseDeck?.Sideboard,
                    commandZone: c.CourseDeck?.CommandZone,
                    companions: c.CourseDeck?.Companions,
                    active: false,
                    winrate: 0,
                    hash: 0
                }
                const deckHash = this.getHash(deck);
                deck.hash = deckHash;
                return deck;
            });
        for (const deck of decks) {

            const found = (await this.deckRepository.getManyByDeckId(deck.deckId))
                .filter(dbDeck => dbDeck.hash === deck.hash);

            if (!found.length) {
                await this.deckRepository.save(deck);
            }
        }
    }

    private getHash(deck: DeckToStore) {
        return hash({
            0: deck.mainDeck,
            1: deck.reducedSideboard,
            2: deck.sideboard,
            3: deck.commandZone,
            4: deck.companions
        })
    }
}
