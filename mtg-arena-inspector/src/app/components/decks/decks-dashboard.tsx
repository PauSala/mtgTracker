import React, { useEffect, useState } from "react";
import DeckSummaryCard, { IDeck } from "./deck-summary-card";
import DeckDashboard from "./deck-dashboard";

export default function DecksDashboard() {
  const [decks, setDecks] = useState<{ current: IDeck; versions: IDeck[] }[]>(
    []
  );
  const [games, setGames] = useState<
    {
      result: string;
      date: string;
      onThePlay: boolean;
      oponentDeckColors: Array<string>;
      oponent: string;
      _id: string;
      versionDeckId: string;
    }[]
  >([]);
  const [selectedDeck, setSelectedDek] = useState<IDeck | undefined>(undefined);

  const statsHandler = (games: any) => {
    setGames(games);

    setSelectedDek(
      decks.find((d) => d.current.deckId === games[0].playerDeckId)?.current
    );
  };

  useEffect(() => {
    fetch(`http://localhost:3001/decks`)
      .then((response) => response.json())
      .then((data: IDeck[]) => {
        setDecks(groupDecks(data));
      });
  }, []);

  return (
    <div className="flex flex-row ">
      <div className="flex flex-col ">
        <div className="text-xl m-2 border-b">Your decks</div>
        <div className="p-2">
          {decks.map((deck) => (
            <DeckSummaryCard
              active={selectedDeck?.deckId === deck.current.deckId}
              key={deck.current.hash}
              deck={deck.current}
              statsHandler={statsHandler}
            ></DeckSummaryCard>
          ))}
        </div>
      </div>
      {selectedDeck && (
        <DeckDashboard
          decks={
            decks.find((d) => d.current.deckId === selectedDeck?.deckId) as {
              current: IDeck;
              versions: IDeck[];
            }
          }
          games={games}
          selectedDeck={selectedDeck}
        ></DeckDashboard>
      )}
    </div>
  );
}

const groupDecks = (decks: IDeck[]) => {
  const deckMap: Map<string, { current: IDeck; versions: IDeck[] }> = new Map();
  for (const deck of decks) {
    let node = deckMap.get(deck.deckId);
    if (!node) {
      deckMap.set(deck.deckId, { current: deck, versions: [] });
    } else {
      if (deck.createdAt > node.current.createdAt) {
        node.versions.push(node.current);
        node.current = deck;
      } else {
        node.versions.push(deck);
      }
    }
  }
  return [...deckMap.values()];
};
