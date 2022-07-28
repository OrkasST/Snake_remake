import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
  constructor({
    name = "Player",
    type = "player",
    position = {
      x: 0,
      y: 0,
    },
    status = {
      maxHP: 10,
      currentHP: 10,
      maxMP: 0,
      currentMP: 0,
      defence: 0,
      // attack: 1,
      physicalAttack: 1,
      magicAttack: 3,
    },
    movement = {
      status: "standing",
      disabledX: "none",
      disabledY: "none",
      direction: "left",
      previousDirection: "none",
      speed: 2,
    },
    size = {
      width: 32,
      height: 32,
    },
    color = "#0000FF",
    interactive = {
      status: false,
      trigger: "click",
      action: null,
    },
    isDisplayed,
  }) {
    super({
      name,
      type,
      position,
      status,
      movement,
      size,
      color,
      interactive,
      isDisplayed,
    });
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }
}
