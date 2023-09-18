import Image from "next/image";

export default function DeckCards({ cards }: { cards: any[] }) {
  return (
    <div className="h-[40rem] overflow-y-auto">
      {cards.map((card) => {
        return (
          card.image_uris && (
            <div
              key={card?.id}
              className="m-2 p-1 w-60 flex items-center justify-between shadow-md shadow-indigo-100/10  bg-cyan-500 bg-opacity-10"
            >
              <div className="w-8 h-10 relative border border-slate-400">
                <Image
                  src={card.image_uris?.small}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt=""
                />
              </div>
              <div className="m-1 w-32  overflow-hidden  whitespace-nowrap text-sm text-ellipsis dark:text-gray-200">
                {" "}
                {card.name}
              </div>
              <div className="text-sm m-2 dark:text-gray-400">
                {card.quantity}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}
