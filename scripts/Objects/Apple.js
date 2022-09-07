import { GameObject } from "./GameObject.js";

export class Apple extends GameObject {
  constructor(position, texture, id) {
    super({
      id,
      name: "Apple",
      type: "apple",
      position,
      status: {
        maxHP: 2,
        currentHP: 0,
        maxMP: 0,
        currentMP: 0,
        defence: 0,
        physicalAttack: 0,
        magicAttack: 0,
        points: 0,
        pointsToGrow: 2,
        upgrades: 0,
        level: 1,
      },
      texture,
      movement: {
        status: "standing",
        disabledX: "none",
        disabledY: "none",
        direction: "none",
        previousDirection: "none",
        speed: 0,
      },
      size: {
        width: 20,
        height: 20,
      },
      color: "#FF0000",
      isDisplayed: true,
      isDestructive: true,
    });
  }
}
