export type DeckStringAttributes = "Version" | "Format";
export type DeckDateAttributes = "LastPlayed" | "LastUpdated";
export type DeckCard = { cardId: number; quantity: number };

import Image from "next/image";
import W from "../../../../public/icons/W.svg";
import R from "../../../../public/icons/R.svg";
import U from "../../../../public/icons/U.svg";
import B from "../../../../public/icons/B.svg";
import G from "../../../../public/icons/G.svg";
import C from "../../../../public/icons/C.svg";
import { useEffect, useState } from "react";

export interface IDeck {
  attributes: Array<
    | { name: DeckStringAttributes; value: string }
    | { name: DeckDateAttributes; value: Date }
  >;
  deckId: string;
  versionId: string;
  mana: string;
  mainDeck: DeckCard[];
  reducedSideboard: DeckCard[];
  sideboard: DeckCard[];
  commandZone: unknown;
  companions: DeckCard[];
  hash?: number;
  name: string;
  createdAt: string;
  winrate: number;
}

export function ColorMap(color: string, imageSize: number) {
  switch (color) {
    case "W":
      return <Image src={W} alt="" width={imageSize} height={imageSize} />;
    case "R":
      return <Image src={R} alt="" width={imageSize} height={imageSize} />;
    case "U":
      return <Image src={U} alt="" width={imageSize} height={imageSize} />;
    case "B":
      return <Image src={B} alt="" width={imageSize} height={imageSize} />;
    case "G":
      return <Image src={G} alt="" width={imageSize} height={imageSize} />;
    default:
      return <Image src={C} alt="" width={imageSize} height={imageSize} />;
  }
}

export const winRateColor = (winrate: number) =>
  winrate > 0.5
    ? "text-emerald-500"
    : winrate < 0.5
    ? "text-red-400"
    : "text-emerald-200";

export default function DeckSummaryCard({
  deck,
  statsHandler,
  active,
}: {
  deck: IDeck;
  statsHandler: Function;
  active: boolean;
}) {
  const [games, setGames] = useState<any[]>([]);
  const deckColors = deck.mana.split("");
  const backgroundClass = active ? " bg-emerald-800" : " bg-sky-800";

  useEffect(() => {
    fetch(`http://localhost:3001/games/${deck.deckId}`)
      .then((response) => response.json())
      .then((data: IDeck[]) => {
        setGames(data);
      });
  }, []);

  return (
    <div
      onClick={() => statsHandler(games)}
      className={
        "cursor-pointer flex flex-row justify-between items-center p-2 mb-2 shadow-lg shadow-cyan-500/10 rounded h-12 w-96 text-sm" +
        backgroundClass
      }
    >
      <div className="w-12 flex-1 font-bold">{deck.name}</div>
      <div className="flex-1 flex flex-row items-center justify-center">
        {deckColors.map((color) => (
          <div key={color} className="ml-1">
            {ColorMap(color, 17)}
          </div>
        ))}
      </div>
      <div className="flex-1 font-bold text-center">
        <span className={"font-bold " + winRateColor(deck.winrate)}>
          {(deck.winrate * 100).toFixed(0)}%{" "}
        </span>
      </div>
      <div className="flex-1  text-center">
        <span className="font-bold">
          ({games.filter((g) => g.result === "win").length} -{" "}
          {games.filter((g) => g.result === "lose").length})
        </span>
      </div>
    </div>
  );
}
