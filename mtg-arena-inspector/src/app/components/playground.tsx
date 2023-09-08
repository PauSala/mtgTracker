"use client";
import React, { useEffect, useState } from "react";
import Deck, { IDeck } from "./decks/deck";

export default function Playground() {
  const [decks, setDecks] = useState<IDeck[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/decks`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDecks(data);
      });
  }, []);
  return (
    <div className="flex flex-col max-h-screen flex-wrap p-8">
      {decks.map((deck) => (
        <Deck key={deck.hash} deck={deck}></Deck>
      ))}
    </div>
  );
}
