export class Menu {
  constructor() {
    this.window = document.getElementById("menu");
    console.dir(this.window);
  }

  toggleMenu() {
    this.window.classList.toggle("_hidden");
  }
}
