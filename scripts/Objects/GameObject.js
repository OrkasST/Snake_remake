import { AI } from "../AI/AI.js";

export class GameObject {
  constructor({
    name = "StandartObject", // shot, player,
    type = "solid", //player, spawner
    position = {
      x: 0,
      y: 0,
    },
    status = "standing",
    movement = {
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
    isDisplayed = true,
    texture = null,
    objectCreatingFunction = null,
    isDestructive = false,
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
    this.collisionBody = true;
    this.isDisplayed = isDisplayed;
    this.isInOrderToDestroy = false;
    this._createObject = objectCreatingFunction;
    this.objectCreatingFunctionIsSet = false;
  }
  imageLoaded() {}
  destroy() {
    this.isInOrderToDestroy = true;
  }
  setObjectCreatingFunction(callback, caller) {
    this._createObject = callback.bind(caller);
    this.objectCreatingFunctionIsSet = true;
  }
  onCollision() {
    if (this.isDestructive) this.destroy();
  }
}
