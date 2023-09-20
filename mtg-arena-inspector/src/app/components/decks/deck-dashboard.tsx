import React, { useEffect, useState } from "react";
import GameTable from "../games/gameTable";
import Deck from "./deck";
import { IDeck } from "./deck-summary-card";
import DeckVersionSummaryCard from "./deck-version-summary";
import DeckWinrate from "./deck-winrate";

export default function DeckDashboard({
  games,
  decks,
}: {
  selectedDeck?: IDeck;
  decks: { current: IDeck; versions: IDeck[] };
  games: {
    result: string;
    date: string;
    onThePlay: boolean;
    oponentDeckColors: Array<string>;
    oponent: string;
    versionDeckId: string;
    _id: string;
  }[];
}) {
  const [currentVersion, setCurrentVersion] = useState<IDeck | null>(null);
  const [currentGames, setCurrentGames] = useState(games);

  useEffect(() => {
    setCurrentVersion(decks.current);
    setCurrentGames(() => {
      return [
        ...games.filter(
          (game) => game?.versionDeckId === decks.current.versionId
        ),
      ];
    });
  }, [decks]);

  const versions = [decks?.current, ...decks?.versions].sort((b, a) => {
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
  });

  const updateCurrentVersion = (versionId: string) => {
    setCurrentVersion(() => {
      return versions?.find((v) => v.versionId === versionId) as IDeck;
    });
    setCurrentGames(() => {
      return [...games.filter((game) => game?.versionDeckId === versionId)];
    });
  };

  return (
    <div className="flex-1 shrink-0">
      <div className="text-xl m-2 border-b"> Versions </div>
      <div className="flex flex-row justify-start gap-1 items-center flex-wrap p-2">
        {versions?.map((version, index) => (
          <DeckVersionSummaryCard
            key={version.versionId}
            active={
              version.versionId === currentVersion?.versionId ||
              (!currentVersion && version.versionId === decks.current.versionId)
            }
            deck={version}
            games={games.filter(
              (game) => game?.versionDeckId === version.versionId
            )}
            onclickHandler={() => updateCurrentVersion(version.versionId)}
            versions={versions}
          ></DeckVersionSummaryCard>
        ))}
      </div>
      <div className="flex flex-row shrink-0">
        {currentVersion ? (
          <Deck deck={currentVersion}></Deck>
        ) : (
          <Deck deck={decks.current}></Deck>
        )}
        <div className="flex flex-col w-[50rem]">
          {currentGames.length > 0 && (
            <DeckWinrate games={currentGames}></DeckWinrate>
          )}
          <GameTable games={currentGames}></GameTable>
        </div>
      </div>
    </div>
  );
}
