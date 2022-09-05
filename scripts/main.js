import { Game } from "./Game.js";

// document.addEventListener('click', () => {
//     const Saper = new Game();
//     console.log(Saper);
//     Saper.init();
// });

window.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.getElementById("start");
  startBtn.addEventListener("click", (e) => {
    startBtn.classList.add("_hidden");
    const Saper = new Game({});
    Saper.init();
    //document.documentElement.requestFullscreen().catch((e) => console.log(e));
  });
});
