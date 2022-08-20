import { GameObject } from "./GameObject.js";

export class Shot extends GameObject {
  constructor({
    position = { x, y },
    size = {
      width: 20,
      height: 20,
    },
    direction = "none",
    speed = 4,
    status = {
      maxHP: 10,
      currentHP: 10,
      maxMP: 0,
      currentMP: 0,
      defence: 0,
      // attack: 2,
      physicalAttack: 0,
      magicAttack: 2,
    },
    attackMultiplier = 0,
    texture = null,
  }) {
    super({
      name: "shot",
      type: "shot",
      size,
      position,
      status: {
        ...status,
        magicAttack: status.magicAttack + attackMultiplier,
      },
      movement: {
        status: "moving",
        disabledX: "none",
        disabledY: "none",
        direction,
        previousDirection: "none",
        speed,
      },
      color: "#00FF00",
      texture,
      isDestructive: true,
    });
  }

  onCollision() {
    this.destroy();
  }
}
