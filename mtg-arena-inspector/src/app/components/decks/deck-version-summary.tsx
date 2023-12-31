import { IDeck, ColorMap, winRateColor } from "./deck-summary-card";
import { useState } from "react";

import { IoInformationCircle } from "react-icons/io5";
import VersionInfoPopOver from "./version-info-popover";

export default function DeckVersionSummaryCard({
  deck,
  onclickHandler,
  active,
  games,
  versions,
}: {
  deck: IDeck;
  onclickHandler: Function;
  active: boolean;
  games: any[];
  versions: IDeck[];
}) {
  const [showPopover, setShowPopover] = useState(false);

  const deckColors = deck.mana.split("");
  const backgroundClass = active ? " bg-cyan-700" : " bg-cyan-800";

  const winrate =
    games.filter((g) => g.result === "win").length / games.length || 0;

  return (
    <div
      onClick={() => onclickHandler()}
      className={
        "cursor-pointer flex flex-col justify-center p-2 mb-2 shadow-lg shadow-cyan-500/10 rounded relative h-12 w-52 text-sm" +
        backgroundClass
      }
    >
      <div className="flex flex-row justify-between items-center">
        <p className="text-center font-bold text-xs capitalize ">{deck.name}</p>
        <IoInformationCircle
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
        ></IoInformationCircle>
        {
          <VersionInfoPopOver
            isOpen={showPopover}
            versions={versions}
            deck={deck}
          ></VersionInfoPopOver>
        }
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex-1 flex flex-row items-center justify-center">
          {deckColors.map((color) => (
            <div key={color} className="ml-1 flex-row">
              {ColorMap(color, 12)}
            </div>
          ))}
        </div>
        <div className="flex-1 font-bold text-center">
          <span className={"font-bold " + winRateColor(deck.winrate)}>
            {(winrate * 100).toFixed(0)}%{" "}
          </span>
        </div>
        <div className="flex-1  text-center">
          <span className="font-bold">
            {games.filter((g) => g.result === "win").length} -{" "}
            {games.filter((g) => g.result === "lose").length}
          </span>
        </div>
      </div>
    </div>
  );
}
