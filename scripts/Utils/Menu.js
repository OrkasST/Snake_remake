export class Menu {
  constructor() {
    this.window = document.getElementById("menu");
    console.dir(this.window);
  }

  getParams(params) {
    this.params = params;
    this.attack = document.getElementById("attack").innerText =
      params.physicalAttack;
    this.defence = document.getElementById("defence").innerText =
      params.defence;
    this.magic = document.getElementById("magic").innerText =
      params.magicAttack;
    this.size = document.getElementById("size").innerText = params.size;
    this.resurrections = document.getElementById("resurrections").innerText =
      params.resurrections;
  }

  toggleMenu() {
    this.window.classList.toggle("_hidden");
  }
}
