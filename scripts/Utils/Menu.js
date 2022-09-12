export class Menu {
  constructor() {
    this.window = document.getElementById("menu");
    // console.dir(this.window);
  }

  getParams(params, spells) {
    this.params = params;
    this.attack = document.getElementById("attack").innerText =
      params.physicalAttack;
    this.defence = document.getElementById("defence").innerText =
      params.defence;
    this.magic = document.getElementById("magic").innerText = params.maxMP;
    this.magic = document.getElementById("control").innerText = params.control;
    this.size = document.getElementById("size").innerText = params.size;
    this.size = document.getElementById("upgrades").innerText = params.upgrades;
    this.size = document.getElementById("magic_1_control").innerText =
      spells[0].control;
    this.size = document.getElementById("magic_2_control").innerText =
      spells[1].control;
    this.resurrections = document.getElementById("resurrections").innerText =
      params.resurrections;
  }

  toggleMenu() {
    this.window.classList.toggle("_hidden");
  }
}
