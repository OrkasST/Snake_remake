import { Game } from "./Game.js";

// document.addEventListener('click', () => {
//     const Saper = new Game();
//     console.log(Saper);
//     Saper.init();
// });

window.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.getElementById("start");
  startBtn.addEventListener("click", (e) => {
    document.documentElement
      .requestFullscreen()
      // .then(() => {
      //   startBtn.classList.add("_hidden");
      //   const Saper = new Game({});
      //   Saper.init();
      // })
      .catch((e) => console.log(e));
    startBtn.classList.add("_hidden");
    const Saper = new Game({});
    Saper.init();
  });
});

document.addEventListener("click", (e) => console.log(e.target));
