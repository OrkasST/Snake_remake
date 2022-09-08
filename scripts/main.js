import { Game } from "./Game.js";

let newGameBtn, continueBtn, startMenu;

window.addEventListener("DOMContentLoaded", (event) => {
  newGameBtn = document.getElementById("newGame");
  continueBtn = document.getElementById("continue");
  startMenu = document.querySelector(".start_menu");

  if (!localStorage.getItem("save")) continueBtn.disabled = true;

  newGameBtn.addEventListener("click", (e) => start(true));
  continueBtn.addEventListener("click", (e) => start(false));
});

// document.addEventListener("click", (e) => console.log(e.target));

function start(deleteProgress) {
  if (deleteProgress) localStorage.clear();
  document.documentElement.requestFullscreen();
  startMenu.classList.add("_hidden");
  const Saper = new Game({});
  Saper.init();
}
