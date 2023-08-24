"use client";

import { Button, ThemeProvider } from "@material-tailwind/react";
import { GameUi } from "./gameUi";
import { SetStateAction, useEffect, useState } from "react";
import { GameState, UICard } from "./types/gameState";
import Controls from "./controls";
import { GameObject } from "./types/step.types";

export function Container() {
  const [cards, setCards] = useState<Array<UICard>>([]);
  const [gameMessages, setGameMessages] = useState<Array<GameState>>([]);
  const [msgIndex, setMessageIndex] = useState(0);
  const [currentGameMessage, setCurrentGameMessage] = useState<GameState>();

  useEffect(() => {
    fetch(`http://localhost:3001/gamePlay`)
      .then((response) => response.json())
      .then((data) => {
        setGameMessages(data);
        setCurrentGameMessage(data[0]);
      });
  }, []);

  const handleMessageChange = (num: number) => {
    setMessageIndex((curr) => curr + num);
    setCurrentGameMessage(gameMessages[msgIndex + num]);
    if (gameMessages[msgIndex + num]?.gameObjects) {
      updateCards(
        gameMessages[msgIndex + num]?.gameInfo?.matchState,
        gameMessages[msgIndex + num].gameObjects,
        cards,
        setCards
      );
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <Controls
          currentGameMessage={currentGameMessage}
          handleMessageChange={handleMessageChange}
        ></Controls>
        <GameUi zones={currentGameMessage?.zones || []} cards={cards}></GameUi>
      </div>
    </ThemeProvider>
  );
}

export const updateCards = (
  matchState: string,
  gameObjects: GameObject[],
  cards: UICard[],
  setCards: (value: SetStateAction<UICard[]>) => void
) => {
  if (matchState === "MatchState_GameComplete") {
    setCards((old) => []);
    return;
  }

  const msgCards = [...gameObjects];
  const toRemove = cards.filter(
    (c) => !msgCards.map((card) => card.instanceId).includes(c.instanceId)
  );

  const newCards: any[] = [];

  const fetchData = async () => {
    for (const msgCard of msgCards) {
      const card = await (
        await fetch(`http://localhost:3001/card/${msgCard.grpId}`)
      ).json();
      newCards.push({ ...msgCard, ...card });
    }
    setCards((old) => {
      let updated = old
        .filter(
          (c) => !toRemove.map((r) => r.instanceId).includes(c.instanceId)
        )
        .filter(
          (c) => !newCards.map((r) => r.instanceId).includes(c.instanceId)
        );
      updated = [...updated, ...newCards];
      return updated;
    });
  };
  fetchData().catch((e) => console.log(msgCards));
};
