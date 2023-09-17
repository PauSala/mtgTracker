import { useEffect, useState } from "react";
import { IDeck } from "./deck-summary-card";
import DeckCards from "../cards/deck-cards";

export default function Deck({ deck }: { deck: IDeck }) {
  const [cardsMain, setCardsMain] = useState([] as any[]);
  const [cardsSideboard, setCardsSideboard] = useState([] as any[]);
  const [sideboard, setSideboard] = useState(false);

  useEffect(() => {
    const cards: Array<any> = [];
    const fetchCards = async () => {
      for (const card of [...deck.mainDeck]) {
        const responseCard = await (
          await fetch(`https://api.scryfall.com/cards/arena/${card.cardId}`)
        ).json();
        if (responseCard && !cards.map((c) => c.id).includes(responseCard.id)) {
          if (!responseCard.image_uris?.art_crop) {
            responseCard.image_uris = responseCard.card_faces[0]?.image_uris;
          }
          const fullCard = { ...responseCard, ...card };
          cards.push(fullCard);
        }
      }
      setCardsMain(
        cards
          .filter((card, index, arr) => arr.indexOf(card) === index)
          .sort((a: any, b: any) => (a.type_line.includes("Land") ? 1 : -1))
      );
    };
    fetchCards().catch((e) => console.log(e));
  }, [deck]);

  useEffect(() => {
    const cards: Array<any> = [];
    const fetchCards = async () => {
      for (const card of [...deck.sideboard]) {
        const responseCard = await (
          await fetch(`https://api.scryfall.com/cards/arena/${card.cardId}`)
        ).json();
        if (responseCard && !cards.map((c) => c.id).includes(responseCard.id)) {
          if (!responseCard.image_uris?.art_crop) {
            responseCard.image_uris = responseCard.card_faces[0]?.image_uris;
          }
          const fullCard = { ...responseCard, ...card };
          cards.push(fullCard);
        }
      }
      setCardsSideboard(
        cards
          .filter((card, index, arr) => arr.indexOf(card) === index)
          .sort((a: any, b: any) => (a.type_line.includes("Land") ? 1 : -1))
      );
    };
    fetchCards().catch((e) => console.log(e));
  }, [deck]);

  const sideBoardSelectedClass = (selected: boolean) =>
    selected ? "opacity-100" : "opacity-70";

  return (
    <div className="">
      <div className="flex rounded rounded justify-between m-2 w-64 text-gray-500 dark:text-gray-400 border">
        <div
          className={`p-1 m-1 w-full text-center cursor-pointer ${sideBoardSelectedClass(
            !sideboard
          )}`}
          onClick={() => setSideboard(false)}
        >
          Main Deck
        </div>
        <div
          className={` p-1 m-1 w-full text-center cursor-pointer ${sideBoardSelectedClass(
            sideboard
          )}`}
          onClick={() => setSideboard(true)}
        >
          Sideboard
        </div>
      </div>
      {!sideboard && (
        <DeckCards
          cards={cardsMain.filter((card) =>
            deck.mainDeck.map((card) => card.cardId).includes(card.cardId)
          )}
        ></DeckCards>
      )}
      {sideboard && (
        <DeckCards
          cards={cardsSideboard.filter((card) =>
            deck.sideboard.map((card) => card.cardId).includes(card.cardId)
          )}
        ></DeckCards>
      )}
    </div>
  );
}
