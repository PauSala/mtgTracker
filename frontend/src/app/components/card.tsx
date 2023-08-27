import {
  CardBody,
  Typography,
  CardFooter,
  Card,
} from "@material-tailwind/react";
import React from "react";
import { UICard } from "./types/gameState";

const cardClass = (card: UICard, player: number) => {
  let cardClass = "h-full m-px w-36 max-h-52 justify-between";
  const rotate = player === 1 ? "rotate-15" : "-rotate-15";
  cardClass = card.isTapped ? `${cardClass} ${rotate}` : cardClass;
  cardClass = card.attackState
    ? `${cardClass} border border-solid border-amber-600`
    : cardClass;
  return cardClass;
};

export default function GameObjectCard({
  card,
  cards,
}: {
  card: UICard;
  cards: UICard[];
}) {
  const blockersIds = card.blockInfo?.attackerIds || [];
  const blockersToPrint = blockersIds.map((bk) => {
    const found = cards.find((_card) => _card.instanceId === bk);
    return found?.name || bk;
  });
  const attackTo =
    cards.find((cs) => cs.instanceId === card.attackInfo?.targetId)?.name ||
    card.attackInfo?.targetId;
  return (
    <div className="h-full">
      <Card
        key={card.instanceId}
        className={cardClass(card, 2)}
        color="gray"
        variant="gradient"
      >
        <CardBody>
          <Typography variant="h6" color="white" className="mb-1">
            {card.name}
          </Typography>
          <Typography variant="small">{card.type}</Typography>
        </CardBody>

        {card.attackState && card.attackInfo?.targetId && (
          <CardFooter className="pt-0">
            {(attackTo && (
              <Typography className="c-white" variant="small">
                Attack to {attackTo}
              </Typography>
            )) || <></>}
          </CardFooter>
        )}
        {card.blockState && card.blockInfo?.attackerIds && (
          <CardFooter className="pt-0">
            {blockersToPrint.map((name, idx) => {
              return (
                ({ name } && (
                  <Typography variant="small" key={idx}>
                    {" "}
                    Blocking to: {name}
                  </Typography>
                )) || <></>
              );
            })}
          </CardFooter>
        )}
        {(card.power || card.toughness) && (
          <CardFooter className="p-1 flex items-center justify-end">
            <div className="flex justify-end">
              {card.power}/{card.toughness}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
