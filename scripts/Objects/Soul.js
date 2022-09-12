import { GameObject } from "./GameObject.js";

export class Soul extends GameObject {
  constructor(position, texture, id, points) {
    super({
      id,
      name: "Soul",
      type: "soul",
      position,
      status: {
        maxHP: points,
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
        width: 40,
        height: 60,
      },
      color: "#FFFFFF",
      isDisplayed: true,
      isDestructive: true,
      isDamaging: false,
    });
  }

  onCollision(object = null) {
    if (!object || object.type !== "player") return;
    let damage = object.isDamaging
      ? object.type === "shot"
        ? object.status?.magicAttack
        : object.status?.physicalAttack
      : null;
    if (
      this.isDestructive &&
      damage &&
      (this.id !== object.id || object.type === "player")
    )
      this._recalculateHP(damage, object);
    // if (this.AIType) this.AI.handleCollision();
  }
}
