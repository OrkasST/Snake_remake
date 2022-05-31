import { Game } from "./Game.js";

// document.addEventListener('click', () => {
//     const Saper = new Game();
//     console.log(Saper);
//     Saper.init();
// });

window.addEventListener("DOMContentLoaded", (event) => {
  const Saper = new Game({});
  Saper.init();
});
