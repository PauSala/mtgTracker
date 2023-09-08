import NavBar from "./components/nav-bar";
import Playground from "./components/playground";

export default function Main() {
  return (
    <div id="main-container">
      <div className="flex">
        <NavBar></NavBar>
        <Playground></Playground>
      </div>
    </div>
  );
}
