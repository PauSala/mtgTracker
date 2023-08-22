"use client";
import { useEffect, useState } from "react";
import { Zone } from "./types/step.types";

export function Dashboard({
  zones,
  cards,
}: {
  zones: (Zone & {
    mappedInstances: {
      arena_id: number | undefined;
      instanceId: number;
    }[];
  })[];
  cards: any;
}) {
  const p1_hand =
    zones
      .filter((z) => z.type === "ZoneType_Hand" && z.ownerSeatId === 1)
      .map((z) => {
        const zoneCards = z.objectInstanceIds;
        return cards
          .filter((card: any) => zoneCards?.includes(card.instanceId))
          .map((card: any) => card?.image_uris ? card?.image_uris[0] : "");
      })[0] || [];

  const p1_battlefield =
    zones
      .filter((z) => z.type === "ZoneType_Battlefield")
      .map((z) => {
        const zoneCards = z.objectInstanceIds;
        return cards
          .filter(
            (card: any) =>
              zoneCards?.includes(card.instanceId) &&
              card.controllerSeatId === 1
          )
          .map((card: any) =>  card?.image_uris ? card?.image_uris[0] : "");
      })[0] || [];

  return (
    <div className="h-full grid gap-0 grid-cols-1 grid-rows-4">
      <div className="w-screen bg-blue-200 grid gap-0 grid-cols-1 grid-rows-1">
        <div className="grid gap-0 grid-cols-3 grid-rows-1">
          <div className="col-span-2 border-solid border-2 border-white-500">
            Hand
          </div>
          <div className="grid gap-0 grid-cols-3 grid-rows-1">
            <div className="border-solid border-2 border-white-500">Deck</div>
            <div className="border-solid border-2 border-white-500">Exile</div>
            <div className="border-solid border-2 border-white-500">
              Graveyard
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen bg-grey-800 grid gap-0 grid-cols-5 grid-rows-1 row-span-2">
        <div className="col-span-4 grid gap-0 grid-rows-2">
          <div>p2</div>
          <div className="flex">
            {p1_battlefield.map((card: any, index: number) => {
              return (
                <div
                  className="border-solid border-2 border-white-500"
                  key={index}
                >
                  <img src={card.small} alt="" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-1 bg-green-200">Stack</div>
      </div>
      <div className="w-screen bg-blue-200 grid gap-0 grid-cols-1 grid-rows-1">
        <div className="grid gap-0 grid-cols-3 grid-rows-1">
          <div className="grid gap-0 grid-cols-3 grid-rows-1">
            <div className="border-solid border-2 border-white-500">
              Graveyard
            </div>
            <div className="border-solid border-2 border-white-500">Deck</div>
            <div className="border-solid border-2 border-white-500">Exile</div>
          </div>
          <div className="col-span-2 border-solid border-2 border-white-500 flex">
            {p1_hand.map((card: any, index: number) => {
              return (
                <div
                  className="border-solid border-2 border-white-500"
                  key={index}
                >
                  <img src={card.small} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
