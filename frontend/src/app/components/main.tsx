"use client";

import { Button, ThemeProvider } from "@material-tailwind/react";
import { Dashboard } from "./dashboard";
import { useEffect, useState } from "react";
import { GameState, UICard } from "./types/gameState";
import { List, ListItem, Card } from "@material-tailwind/react";

export function Container() {
  const [cards, setCards] = useState<Array<UICard>>([]);
  const [gameMessages, setGameMessages] = useState<Array<GameState>>([]);
  const [msgIndex, setMessageIndex] = useState(0);
  const [currentGameMessage, setCurrentGameMessage] = useState<GameState>();

  useEffect(() => {
    if (currentGameMessage?.gameObjects) {
      const msgCards = currentGameMessage?.gameObjects.filter(
        (object) => object.type === "GameObjectType_Card"
      );

      const toRemove = cards.filter((c) =>
        !msgCards.map((card) => card.instanceId).includes(c.instanceId)
      );
      console.log(toRemove)
      const newCards: any[] = [];

      const fetchData = async () => {
        for (const msgCard of msgCards) {
          if (
            cards.find(
              (currentCard) =>
                currentCard.instanceId === msgCard.instanceId &&
                msgCard.grpId === currentCard.arena_id
            )
          ) {
            continue;
          }

          const card = await (
            await fetch(`http://localhost:3001/card/${msgCard.grpId}`)
          ).json();
          newCards.push({ ...msgCard, ...card });
        }
        setCards((old) => {
          let updated = old.filter(
            (c) => !toRemove.map((r) => r.instanceId).includes(c.instanceId)
          );
          updated = [...updated, ...newCards];
          return updated;
        });
      };

      fetchData().catch((e) => console.log(e));
    }
  }, [currentGameMessage?.gameObjects]);

  const nextMessage = () => {
    setMessageIndex((curr) => curr + 1);
    setCurrentGameMessage(gameMessages[msgIndex + 1]);
  };

  const prevMessage = () => {
    setMessageIndex((curr) => curr - 1);
    setCurrentGameMessage(gameMessages[msgIndex - 1]);
  };

  useEffect(() => {
    fetch(`http://localhost:3001/gamePlay`)
      .then((response) => response.json())
      .then((data) => {
        setGameMessages(data);
        setCurrentGameMessage(data[0]);
      });
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <div className="flex justify-center">
          <div>
            <Button onClick={prevMessage} className="m-px">
              Prev
            </Button>
            <Button onClick={nextMessage} className="m-px">
              next
            </Button>
          </div>

          <ListItem>
            Turn: {currentGameMessage?.turnNumber || undefined}
          </ListItem>
          <ListItem>
            Turn Player: {currentGameMessage?.turnPlayer || undefined}
          </ListItem>
          <ListItem>
            Decision Player:
            {currentGameMessage?.decisionPlayer || undefined}
          </ListItem>
          <ListItem>
            Priority Player:
            {currentGameMessage?.priorityPlayer || undefined}
          </ListItem>
          <ListItem>Phase: {currentGameMessage?.phase || undefined}</ListItem>
          <ListItem>Step: {currentGameMessage?.step || undefined}</ListItem>
        </div>
        <Dashboard
          zones={currentGameMessage?.zones || []}
          cards={cards}
        ></Dashboard>
      </div>
    </ThemeProvider>
  );
}
