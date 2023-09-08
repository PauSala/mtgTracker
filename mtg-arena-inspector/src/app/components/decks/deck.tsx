export type DeckStringAttributes = "Version" | "Format";
export type DeckDateAttributes = "LastPlayed" | "LastUpdated";
export type DeckCard = { cardId: number; quantity: number };
export interface IDeck {
  attributes: Array<
    | { name: DeckStringAttributes; value: string }
    | { name: DeckDateAttributes; value: Date }
  >;
  deckId: string;
  mana: string;
  mainDeck: DeckCard[];
  reducedSideboard: DeckCard[];
  sideboard: DeckCard[];
  commandZone: unknown;
  companions: DeckCard[];
  hash?: number;
  name: string;
}
import Image from "next/image";
import W from "../../../../public/icons/W.svg";
import R from "../../../../public/icons/R.svg";
import U from "../../../../public/icons/U.svg";
export default function Deck({ deck }: { deck: IDeck }) {
  return (
    <div className="flex flex-row items-center justify-between p-2 m-2 bg-sky-800 shadow-lg shadow-cyan-500/10 rounded h-10 w-60 text-sm">
      <div>{deck.name}</div>
      <div className="flex flex-row items-center">
        <div className="ml-1">
          <Image src={W} alt="" width={14} height={14} />
        </div>
        <div className="ml-1">
          <Image src={R} alt="" width={14} height={14} />
        </div>
        <div className="ml-1">
          <Image src={U} alt="" width={14} height={14} />
        </div>
      </div>
    </div>
  );
}
