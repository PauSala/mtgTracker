import React from "react";
import Image from "next/image";

export default function CardSummary({ card }: { card: any }) {
  return (
    <div className="p-1 mb-1 rounded flex items-center justify-start shadow-lg shadow-indigo-100/10  bg-cyan-950 bg-opacity-40">
      <div className="w-8 h-10 relative rounded border border-slate-400">
        <Image
          src={card.image_uris?.small}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt=""
        />
      </div>
      <div className="m-1 overflow-hidden  whitespace-nowrap text-sm text-ellipsis dark:text-gray-200">
        {" "}
        {card.name}
      </div>
    </div>
  );
}
