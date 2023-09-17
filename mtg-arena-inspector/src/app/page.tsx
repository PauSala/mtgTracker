import NavBar from "./components/nav-bar";
import Playground from "./components/playground";

export default function Main() {
  return (
    <div className="flex h-full">
      <NavBar></NavBar>
      <Playground></Playground>
    </div>
  );
}
