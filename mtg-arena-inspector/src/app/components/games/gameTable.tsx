import React from "react";

import W from "../../../../public/icons/W.svg";
import R from "../../../../public/icons/R.svg";
import U from "../../../../public/icons/U.svg";
import B from "../../../../public/icons/B.svg";
import G from "../../../../public/icons/G.svg";
import C from "../../../../public/icons/C.svg";
import Image from "next/image";

const imageSize = 17;
export function ColorMap(color: string) {
  switch (color) {
    case "W":
      return <Image src={W} alt="" width={imageSize} height={imageSize} />;
    case "R":
      return <Image src={R} alt="" width={imageSize} height={imageSize} />;
    case "U":
      return <Image src={U} alt="" width={imageSize} height={imageSize} />;
    case "B":
      return <Image src={B} alt="" width={imageSize} height={imageSize} />;
    case "G":
      return <Image src={G} alt="" width={imageSize} height={imageSize} />;
    default:
      return <></>;
  }
}

export default function GameTable({
  games,
}: {
  games: {
    result: string;
    date: string;
    onThePlay: boolean;
    oponentDeckColors: Array<string>;
    oponent: string;
    _id: string;
  }[];
}) {
  return (
    <div className="h-[44rem] overflow-y-auto p-1">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr className="rounded">
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              Deck type
            </th>
            <th scope="col" className="px-6 py-3">
              Result
            </th>
            <th scope="col" className="px-6 py-3">
              On the play
            </th>
            <th scope="col" className="px-6 py-3">
              Oponent
            </th>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              Played at
            </th>
          </tr>
        </thead>
        <tbody className="max-h-48 overflow-y-auto">
          {games
            .sort((a, b) =>
              b.date.toUpperCase().localeCompare(a.date.toUpperCase())
            )
            .map((game) => {
              return (
                <tr
                  key={game._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex-1 flex flex-row items-center justify-center">
                      {game.oponentDeckColors.map((color) => (
                        <div key={color} className="ml-1">
                          {ColorMap(color)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">{game.result}</td>
                  <td className="px-6 py-4">{game.onThePlay ? "Yes" : "No"}</td>
                  <td className="px-6 py-4 text-ellipsis">
                    {game.oponent.slice(0, game.oponent.indexOf("#"))}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(game.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
