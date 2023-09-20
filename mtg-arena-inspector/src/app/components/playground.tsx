"use client";

import { Selector } from "../page";
import DecksDashboard from "./decks/decks-dashboard";
import Home from "./home/home";

export default function Playground({ selector }: { selector: Selector }) {
  return (
    <div className="flex flex-col flex-wrap content-center p-2 w-full">
      {selector === "home" && <Home></Home>}
      {selector === "decks" && <DecksDashboard></DecksDashboard>}
    </div>
  );
}
