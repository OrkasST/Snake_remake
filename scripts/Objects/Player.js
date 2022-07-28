import { GameObject } from "./GameObject.js";
import { Shot } from "./Shot.js";

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
      maxMP: 3,
      currentMP: 3,
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
    this.magicCooldown = 500;
    this.lastMagicCreatedTime = 0;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  createMagic(time) {
    if (
      this.status.currentMP >= 1 &&
      (time - this.lastMagicCreatedTime > this.magicCooldown ||
        this.lastMagicCreatedTime === 0)
    ) {
      this.status.currentMP -= 1;
      this.lastMagicCreatedTime = time;
      this._createObject(
        new Shot({
          position: {
            x:
              Math.floor(this.position.x + this.size.width / 2) -
              10 -
              (this.movement.direction === "left"
                ? this.size.width
                : this.movement.direction === "right"
                ? -this.size.width - 10
                : 0),
            y:
              Math.floor(this.position.y + this.size.height / 2) -
              10 -
              (this.movement.direction === "up"
                ? this.size.height
                : this.movement.direction === "down"
                ? -this.size.height - 10
                : 0),
          },
          direction: this.movement.direction,
          attackMultiplier: this.status.magicAttack,
        })
      );
    }
  }
}
