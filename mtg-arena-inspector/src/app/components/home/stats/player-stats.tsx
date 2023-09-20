import React from "react";
import { IPlayerStats } from "./stats";

export default function PlayerStats({ stats }: { stats: IPlayerStats }) {
  return (
    <div>
      <p>user Stats</p>
      <p>{stats.constructedClass}</p>
    </div>
  );
}
