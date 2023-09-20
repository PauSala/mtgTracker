import { ImStack, ImHome } from "react-icons/im";

export default function NavBar({ modeSelector }: { modeSelector: Function }) {
  const iconClass =
    "hover:text-sky-400 text-2xl text-slate-600 duration-200 text-2xl mb-4";
  return (
    <div className="min-h-screen w-12 bg-gray-900 p-1 flex flex-col items-center">
      <ImHome
        className={iconClass + " mt-2"}
        onClick={() => modeSelector("home")}
      />
      <ImStack className={iconClass} onClick={() => modeSelector("decks")} />
    </div>
  );
}
