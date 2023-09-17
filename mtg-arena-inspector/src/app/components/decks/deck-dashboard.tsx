import React, { useEffect, useState } from "react";
import GameTable from "../games/gameTable";
import Deck from "./deck";
import { IDeck } from "./deck-summary-card";
import DeckVersionSummaryCard from "./deck-version-summary";

export default function DeckDashboard({
  selectedDeck,
  games,
  decks,
}: {
  selectedDeck?: IDeck;
  decks: { current: IDeck; versions: IDeck[] }[];
  games: any[];
}) {
  const [currentVersion, setCurrentVersion] = useState<IDeck | null>(null);

  const versions = decks
    .filter((deck) => deck.current.deckId === selectedDeck?.deckId)
    .map((decks) => [decks.current, ...decks.versions])
    .pop()
    ?.reverse();

  const updateCurrentVersion = (versionId: string) => {
    setCurrentVersion(() => {
      return versions?.find((v) => v.versionId === versionId) as IDeck;
    });
  };

  return (
    <div className="flex-1">
      <div className="m-2 p-2"> Versions </div>
      <div className="flex flex-row justify-start gap-1 items-center flex-wrap p-2">
        {versions?.map((version, index) => (
          <DeckVersionSummaryCard
            key={version.versionId}
            active={
              version.versionId === currentVersion?.versionId ||
              (!currentVersion && version.versionId === selectedDeck?.versionId)
            }
            deck={version}
            games={games.filter(
              (game) => game?.versionDeckId === version?.versionId
            )}
            onclickHandler={() => updateCurrentVersion(version.versionId)}
          ></DeckVersionSummaryCard>
        ))}
      </div>
      <div className="flex flex-row ">
        {currentVersion ? (
          <Deck deck={currentVersion}></Deck>
        ) : (
          selectedDeck && <Deck deck={selectedDeck}></Deck>
        )}
        <div className="p-2">
          <GameTable
            games={games.filter(
              (game) =>
                game?.versionDeckId === currentVersion?.versionId ||
                game?.versionDeckId === selectedDeck?.versionId
            )}
          ></GameTable>
        </div>
      </div>
    </div>
  );
}
