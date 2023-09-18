import React from "react";
import { winRateColor } from "./deck-summary-card";

export default function DeckWinrate({
  games,
}: {
  games: {
    result: string;
    date: string;
    onThePlay: boolean;
    oponentDeckColors: Array<string>;
    oponent: string;
    _id: string;
    versionDeckId: string;
  }[];
}) {
  const winrate =
    (games.filter((g) => g.result === "win").length / games.length) * 100 || 0;
  const onThePlay = games.filter((game) => game.onThePlay === true);
  const onTheDraw = games.filter((game) => game.onThePlay === false);
  const totalGames = games.length;
  const winrateOnPlay =
    (onThePlay.filter((game) => game.result === "win").length /
      onThePlay.length) *
      100 || 0;
  const winrateOnDraw =
    (onTheDraw.filter((game) => game.result === "win").length /
      onTheDraw.length) *
      100 || 0;
  const onPlayPercentage = ((onThePlay.length / totalGames) * 100).toFixed(0);
  const onDrawPercentage = ((onTheDraw.length / totalGames) * 100).toFixed(0);
  return (
    <div className="flex flex-row items-center justify-center pb-1">
      <div
        className="flex flex-1 flex-col rounded items-center justify-center
       items-center p-1 flex-1 p-1 m-1 bg-slate-700 shadow-sm shadow-slate-500/50"
      >
        <div className={`font-bold ${winRateColor(winrate / 100.0)}`}>
          WINRATE {winrate.toFixed()}%
        </div>
        <div className={`text-xs`}>{totalGames} games</div>
      </div>
      <div
        className="flex flex-col rounded
       items-center p-1 flex-1 p-1 m-1 bg-slate-700 shadow-sm shadow-slate-500/50"
      >
        <div className={`font-bold ${winRateColor(winrateOnPlay / 100.0)}`}>
          {" "}
          ON PLAY {winrateOnPlay.toFixed(0)}%
        </div>
        <div className="text-xs">{onPlayPercentage}% of total games</div>
      </div>
      <div
        className="flex flex-col rounded
       items-center p-1 flex-1 p-1 m-1 bg-slate-700 shadow-sm shadow-slate-500/50"
      >
        <div className={`font-bold ${winRateColor(winrateOnDraw / 100.0)}`}>
          ON DRAW {winrateOnDraw.toFixed(0)}%
        </div>
        <div className="text-xs">{onDrawPercentage}% of total games</div>
      </div>
    </div>
  );
}
