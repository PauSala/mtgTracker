"use client";

import DecksDashboard from "./decks/decks-dashboard";

export default function Playground() {
  return (
    <div className="flex flex-col flex-wrap p-2 w-full">
      <DecksDashboard></DecksDashboard>
    </div>
  );
}
