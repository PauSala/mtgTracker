"use client";
import { useState } from "react";
import NavBar from "./components/nav-bar";
import Playground from "./components/playground";

export type Selector = "home" | "decks";

export default function Main() {
  const [selector, setSelector] = useState<Selector>("home");
  const modeSelectorHandler = (newSelector: Selector) => {
    setSelector(newSelector);
  };
  return (
    <div className="flex h-full">
      <NavBar modeSelector={modeSelectorHandler}></NavBar>
      <Playground selector={selector}></Playground>
    </div>
  );
}
