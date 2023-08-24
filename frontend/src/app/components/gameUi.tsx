"use client";

import { Zone } from "./types/step.types";
import { UICard } from "./types/gameState";
import GameObjectCard from "./card";
import { Typography } from "@material-tailwind/react";

export function GameUi({
  zones,
  cards,
}: {
  zones: (Zone & {
    mappedInstances: {
      arena_id: number | undefined;
      instanceId: number;
    }[];
  })[];
  cards: UICard[];
}) {
  const p1_hand =
    zones
      .filter((z) => z.type === "ZoneType_Hand" && z.ownerSeatId === 1)
      .map((z) => {
        const zoneCards = z.objectInstanceIds;
        return cards.filter((card: any) =>
          zoneCards?.includes(card.instanceId)
        );
      })[0] || [];

  const p2_hand =
    zones
      .filter((z) => z.type === "ZoneType_Hand" && z.ownerSeatId === 2)
      .map((z) => {
        const zoneCards = z.objectInstanceIds;
        return zoneCards?.map((id: number) => {
          const found = cards.find((c) => c.instanceId === id);
          return (
            found || {
              name: "",
              instanceId: -1,
              type: "",
            }
          );
        });
      })[0] || [];

  const p1_battlefield =
    zones
      .filter((z) => z.type === "ZoneType_Battlefield")
      .map((z) => {
        const zoneCards = z.objectInstanceIds;
        return cards.filter(
          (card: UICard) =>
            zoneCards?.includes(card.instanceId) && card.controllerSeatId === 1
        );
      })[0] || [];

  const p2_battlefield =
    zones
      .filter((z) => z.type === "ZoneType_Battlefield")
      .map((z) => {
        const zoneCards = z.objectInstanceIds;
        return cards.filter(
          (card: UICard) =>
            zoneCards?.includes(card.instanceId) && card.controllerSeatId === 2
        );
      })[0] || [];

  const stack =
    (zones
      .find((zone) => zone.type === "ZoneType_Stack")
      ?.objectInstanceIds?.map((instanceId) => {
        const found = cards.find((c) => c.instanceId === instanceId);
        return found || null;
      })
      ?.filter((c) => c !== null) as UICard[]) || [];

  return (
    <div className="h-full grid gap-0 grid-cols-1 grid-rows-4">
      <div className="w-screen bg-hand_bg text-white grid gap-0 grid-cols-1 grid-rows-1">
        <div className="grid gap-0 grid-cols-3 grid-rows-1">
          <div className="col-span-2 flex">
            {p2_hand.map((card: any, index: number) => {
              return (
                <GameObjectCard
                  key={index}
                  card={card}
                  cards={cards}
                ></GameObjectCard>
              );
            })}
          </div>
          <div className="grid gap-0 grid-cols-3 grid-rows-1">
            <div className="">Deck</div>
            <div className="">Exile</div>
            <div className="">Graveyard</div>
          </div>
        </div>
      </div>
      <div className="w-screen bg-battelfield_bg grid gap-0 grid-cols-5 grid-rows-1 row-span-2">
        <div className="col-span-4 grid gap-0 grid-rows-2">
          <div className="flex ">
            {p2_battlefield.map((card: any, index: number) => {
              return (
                <GameObjectCard
                  key={index}
                  card={card}
                  cards={cards}
                ></GameObjectCard>
              );
            })}
          </div>
          <div className="flex">
            {p1_battlefield.map((card: UICard, index: number) => {
              return (
                <GameObjectCard
                  key={index}
                  card={card}
                  cards={cards}
                ></GameObjectCard>
              );
            })}
          </div>
        </div>
        <div className="col-span-1 bg-stack_bg">
          {stack.map((card) => (
            <Typography key={card.instanceId}>{card.name}</Typography>
          ))}
        </div>
      </div>
      <div className="w-screen bg-hand_bg text-white grid gap-0 grid-cols-1 grid-rows-1">
        <div className="grid gap-0 grid-cols-3 grid-rows-1">
          <div className="grid gap-0 grid-cols-3 grid-rows-1">
            <div className="">Graveyard</div>
            <div className="">Deck</div>
            <div className="">Exile</div>
          </div>
          <div className="col-span-2 flex">
            {p1_hand.map((card: UICard, index: number) => {
              return (
                <GameObjectCard
                  key={index}
                  card={card}
                  cards={cards}
                ></GameObjectCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
