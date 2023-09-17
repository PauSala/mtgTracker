import React, { useEffect, useState } from "react";
import { IDeck } from "./deck-summary-card";
import Image from "next/image";
import CardSummary from "../cards/card-summary";

export default function VersionInfoPopOver({
  isOpen,
  versions,
  deck,
}: {
  isOpen: boolean;
  versions: IDeck[];
  deck: IDeck;
}) {
  const lastPlayed = deck.attributes.find((a) => a.name === "LastPlayed");
  const lastUpdated = deck.attributes.find((a) => a.name === "LastUpdated");
  const format = deck.attributes.find((a) => a.name === "Format");
  const [cardsMap, setCardsMap] = useState(new Map());
  const changes = setChanges(versions, deck);

  console.log(changes, cardsMap);

  useEffect(() => {
    const toMap = [
      ...changes.incommingMain,
      ...changes.incommingSideBoard,
      ...changes.outgoingMain,
      ...changes.outgoingSideBoard,
    ];
    const fetchCards = async () => {
      const map = new Map();
      for (const card of toMap) {
        const responseCard = await (
          await fetch(`https://api.scryfall.com/cards/arena/${card}`)
        ).json();
        if (responseCard) {
          if (!responseCard.image_uris) {
            responseCard.image_uris = responseCard.card_faces[0]?.image_uris;
          }
          const fullCard = { ...responseCard, ...card };
          map.set(fullCard.arena_id, fullCard);
        }
      }
      setCardsMap(map);
    };
    fetchCards().catch((e) => console.log(e));
  }, []);

  return (
    <div
      className={`absolute left-0 top-full mt-1 z-10 shadow-lg shadow-indigo-100/10  bg-teal-600  p-2 rounded ${
        isOpen ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300  w-max flex flex-col`}
    >
      <div className="p-1">
        <span className="font-bold">Last Played: </span>
        {new Date(lastPlayed?.value?.replace(/"/g, "") || "").toLocaleString()}
      </div>
      <div className="p-1">
        <span className="font-bold"> Last Updated: </span>
        {new Date(lastUpdated?.value?.replace(/"/g, "") || "").toLocaleString()}
      </div>
      <div className="p-1">
        {" "}
        <span className="font-bold">Format: </span> {format?.value}
      </div>
      <div className="p-1">
        {changes.incommingMain.length > 0 && (
          <p className="font-bold">Incomming Main</p>
        )}
        <div>
          {changes.incommingMain.map((card) => {
            const _card = cardsMap.get(card);
            return (
              _card && (
                <CardSummary key={_card?.arena_id} card={_card}></CardSummary>
              )
            );
          })}
        </div>
        {changes.incommingSideBoard.length > 0 && (
          <p className="font-bold">Incomming SideBoard</p>
        )}
        <div>
          {changes.incommingSideBoard.map((card) => {
            const _card = cardsMap.get(card);
            return (
              _card && (
                <CardSummary key={_card?.arena_id} card={_card}></CardSummary>
              )
            );
          })}
        </div>
        {changes.outgoingMain.length > 0 && (
          <p className="font-bold">Ourgoing Main</p>
        )}

        <div>
          {changes.outgoingMain.map((card) => {
            const _card = cardsMap.get(card);
            return (
              _card && (
                <CardSummary key={_card?.arena_id} card={_card}></CardSummary>
              )
            );
          })}
        </div>

        {changes.outgoingSideBoard.length > 0 && (
          <p className="font-bold">Ourgoing Sideboard</p>
        )}
        <div>
          {changes.outgoingSideBoard.map((card) => {
            const _card = cardsMap.get(card);
            return (
              _card && (
                <CardSummary key={_card?.arena_id} card={_card}></CardSummary>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}

const setChanges = (versions: IDeck[], deck: IDeck) => {
  const sorted = [
    ...versions.sort((b, a) => {
      const value =
        new Date(
          a.attributes
            .find((a) => a.name === "LastPlayed")
            ?.value?.replace(/"/g, "") || ""
        ).getTime() -
        new Date(
          b.attributes
            .find((a) => a.name === "LastPlayed")
            ?.value?.replace(/"/g, "") || ""
        ).getTime();
      return value;
    }),
  ];
  const currentIndex = sorted.indexOf(deck);
  const previousVersion = versions[currentIndex + 1];

  let status: Record<
    | "incommingMain"
    | "incommingSideBoard"
    | "outgoingMain"
    | "outgoingSideBoard",
    any[]
  > = {
    incommingMain: [],
    incommingSideBoard: [],
    outgoingMain: [],
    outgoingSideBoard: [],
  };

  if (previousVersion) {
    status = getDeckDiff(previousVersion, deck);
  }
  return status;
};

const getDeckDiff = (prev: IDeck, current: IDeck) => {
  const incommingMain = current.mainDeck
    .map((c) => c.cardId)
    .filter((card) => !prev.mainDeck.map((c) => c.cardId).includes(card));
  const incommingSideBoard = current.sideboard
    .map((c) => c.cardId)
    .filter((card) => !prev.sideboard.map((c) => c.cardId).includes(card));
  const outgoingMain = prev.mainDeck
    .map((c) => c.cardId)
    .filter((card) => !current.mainDeck.map((c) => c.cardId).includes(card));
  const outgoingSideBoard = prev.sideboard
    .map((c) => c.cardId)
    .filter((card) => !current.sideboard.map((c) => c.cardId).includes(card));

  return {
    incommingMain,
    incommingSideBoard,
    outgoingMain,
    outgoingSideBoard,
  };
};
