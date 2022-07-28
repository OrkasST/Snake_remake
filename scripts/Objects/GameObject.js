import { AI } from "../AI/AI.js";

export class GameObject {
  constructor({
    name = "StandartObject", // shot, player,
    type = "solid", //player, spawner
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
      // attack: 0,
      physicalAttack: 0,
      magicAttack: 0,
    },
    movement = {
      status: "standing",
      disabledX: "none",
      disabledY: "none",
      direction: "none",
      previousDirection: "none",
      speed: 0,
    },
    size = {
      width: 10,
      height: 10,
    },
    color = "#000000",
    AIType = null,
    interactive = {
      status: false,
      trigger: "click",
      action: null,
    },
    isDamaging = true,
    isDisplayed = true,
    texture = null,
    objectCreatingFunction = null,
    isDestructive = false,
    isAlive = false,
    collisionBody = true,
  }) {
    this.name = name;
    this.type = type;
    this.position = position;
    this.status = status;
    this.movement = movement;
    this.size = size;
    this.color = color;
    this.AIType = AIType;
    if (this.AIType) this.AI = new AI({ type: this.AIType });
    this.texture = texture;
    this.isDestructive = isDestructive;
    /* 
        {
        name: 'some_image',
        img: null,
        sx: 0,
        sy: 0
        };
    */
    this.interactive = interactive;
    this.collisionBody = collisionBody;
    this.isAlive = isAlive;
    this.isDisplayed = isDisplayed;
    this.isInOrderToDestroy = false;
    this._createObject = objectCreatingFunction;
    this.objectCreatingFunctionIsSet = false;
    this.isUnderAttack = false;
    this.isDamaging = isDamaging;
  }
  imageLoaded() {}
  destroy() {
    this.isInOrderToDestroy = true;
  }
  _recalculateHP(damage) {
    this.status.currentHP -= damage - this.status.defence;
    if (this.type === "snake-body-part")
      console.log("HP: " + this.status.currentHP);
    if (this.status.currentHP <= 0) this.destroy();
  }
  setObjectCreatingFunction(callback, caller) {
    this._createObject = callback.bind(caller);
    this.objectCreatingFunctionIsSet = true;
  }
  onCollision(damage = null) {
    if (this.isDestructive && damage) this._recalculateHP(damage);
  }
}
