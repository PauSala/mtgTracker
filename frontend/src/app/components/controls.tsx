"use client";

import { Button, ListItem } from "@material-tailwind/react";
import React from "react";
import { GameState } from "./types/gameState";

export default function Controls({
  currentGameMessage,
  handleMessageChange,
}: {
  currentGameMessage: GameState | undefined;
  handleMessageChange: (i: number) => void;
}) {
  return (
    <div className="flex justify-center bg-stack_bg">
      <div>
        <Button onClick={() => handleMessageChange(-1)} className="m-px">
          Prev
        </Button>
        <Button onClick={() => handleMessageChange(1)} className="m-px">
          next
        </Button>
      </div>

      <ListItem className="text-white">
        Turn: {currentGameMessage?.turnNumber || undefined}
      </ListItem>
      <ListItem className="text-white">
        Turn Player: {currentGameMessage?.turnPlayer || undefined}
      </ListItem>
      <ListItem className="text-white">
        Decision Player:
        {currentGameMessage?.decisionPlayer || undefined}
      </ListItem>
      <ListItem className="text-white">
        Priority Player:
        {currentGameMessage?.priorityPlayer || undefined}
      </ListItem>
      <ListItem className="text-white">
        Phase: {currentGameMessage?.phase || undefined}
      </ListItem>
      <ListItem className="text-white">
        Step: {currentGameMessage?.step || undefined}
      </ListItem>
    </div>
  );
}
