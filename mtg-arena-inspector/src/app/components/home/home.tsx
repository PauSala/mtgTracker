import React, { useEffect, useState } from "react";
import { IPlayerStats } from "./stats/stats";
import PlayerStats from "./stats/player-stats";

export default function Home() {
  const [stats, setStats] = useState<IPlayerStats | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/user-stats/last`)
      .then((response) => response.json())
      .then((data: IPlayerStats) => {
        setStats(data);
      });
  }, []);
  return <div>{stats && <PlayerStats stats={stats}></PlayerStats>}</div>;
}
