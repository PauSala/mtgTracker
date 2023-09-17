import {
  DiApple,
  DiCodeigniter,
  DiGitBranch,
  DiSenchatouch,
  DiCoda,
  DiEnvato,
} from "react-icons/di";

export default function NavBar() {
  const iconClass =
    "hover:text-sky-400 text-2xl text-slate-600 duration-200 text-2xl mb-4";
  return (
    <div className="min-h-screen w-12 bg-gray-900 p-1 flex flex-col items-center">
      <DiApple className={iconClass + " mt-2"} />
      <DiCodeigniter className={iconClass} />
      <DiGitBranch className={iconClass} />
      <DiSenchatouch className={iconClass} />
      <DiCoda className={iconClass} />
      <DiEnvato className={iconClass} />
    </div>
  );
}
