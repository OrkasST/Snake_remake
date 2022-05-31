import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
  constructor({
    name = "Player",
    type = "player",
    position = {
      x: 0,
      y: 0,
    },
    status = "standing",
    movement = {
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
