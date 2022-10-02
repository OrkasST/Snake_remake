import { AI } from "../AI/AI.js";

export class GameObject {
  constructor({
    name = "StandartObject", // shot, player,
    type = "solid", //player, spawner
    id = "",
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
      physicalAttack: 0,
      magicAttack: 0,
      points: 0,
      pointsToGrow: 12,
      upgrades: 0,
      level: 1,
      size: 0,
      maxStamina: 100,
      currentStamina: 100,
      control: 1,
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
    hitBox = null, // {x1,x2,y1,y2}
    isAbleToGrow = false,
    isGrown = false,
  }) {
    this.name = name;
    this.type = type;
    this.id = id;
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
    if (this.collisionBody)
      this.hitBox = {
        x1: this.position.x + (hitBox?.x || 0),
        x2: this.position.x + (hitBox?.x + hitBox?.width || this.size.width),
        y1: this.position.y + (hitBox?.y || 0),
        y2: this.position.y + (hitBox?.y + hitBox?.height || this.size.height),
      };
    this.isAlive = isAlive;
    this.isDisplayed = isDisplayed;
    this.isInOrderToDestroy = false;
    this._createObject = objectCreatingFunction;
    this.objectCreatingFunctionIsSet = false;
    this.isUnderAttack = false;
    this.isDamaging = isDamaging;
    this.isAbleToGrow = isAbleToGrow;
    this.isCreatingMagic = false;
    this.currentSpell = {};
    this.killedBy = "";

    this.isScaled = false;
    // if (isGrown) debugger;
    this.isGrown = isGrown;
  }
  imageLoaded() {}
  destroy(enemy) {
    if (enemy) this.killedBy = enemy;
    if (this.type === "player") return this.death();
    this.isInOrderToDestroy = true;
  }
  _recalculateHP(damage, object) {
    this.status.currentHP -=
      damage - this.status.defence > 0 ? damage - this.status.defence : 0;
    if (this.status.currentHP <= 0) {
      if (object) {
        let pointsToGive = this.status.maxHP;
        object.status.currentHP = object.raiseHP(
          Math.floor(pointsToGive / 2) || 1
        );
        object.raisePoints(Math.floor(pointsToGive / 1.2) || 1);
        object.status.currentMP = object.raiseMP(
          Math.floor(pointsToGive / 3) || 1
        );
      }
      this.destroy(object?.type);
    }
  }
  setObjectCreatingFunction(callback, caller) {
    this._createObject = callback.bind(caller);
    this.objectCreatingFunctionIsSet = true;
  }
  onCollision(object = null) {
    if (!object) return;
    let damage = object.isDamaging
      ? object.type === "shot"
        ? object.status?.magicAttack
        : object.status?.physicalAttack
      : null;
    if (this.isDestructive && damage && this.id !== object.id)
      this._recalculateHP(damage, object);
    if (this.AIType) this.AI.handleCollision();
  }

  raisePoints(points) {
    if (this.status.points + points >= this.status.pointsToGrow) {
      let difference = this.status.pointsToGrow - this.status.points;
      this.status.pointsToGrow =
        this.status.pointsToGrow < 100
          ? Math.floor(this.status.pointsToGrow * 1.5)
          : Math.floor(this.status.pointsToGrow * 1.2);
      this.status.upgrades++;
      this.status.points = 0;
      if (this.isAbleToGrow) this.grow();
      return this.raisePoints(points - difference);
    }
    this.status.points += points;
  }

  raiseMP(MP) {
    return this.status.currentMP + MP >= this.status.maxMP
      ? this.status.maxMP
      : this.status.currentMP + MP;
  }
  raiseHP(HP) {
    return this.status.currentHP + HP >= this.status.maxHP
      ? this.status.maxHP
      : this.status.currentHP + HP;
  }

  setScale(scale) {
    this.position.x *= scale;
    this.position.y *= scale;
    this.movement.speed *= scale;
  }

  modifyParameter(parameter, modifier) {
    if (this.status.upgrades < this.cost[parameter]) return;
    modifier === "+"
      ? this.status[this.parms[parameter]]++
      : this.status[this.parms[parameter]]--;
    this.status.upgrades -= this.cost[parameter];
    this.status.maxHP -= 2;
    this.status.currentHP -= 2;
    this.status.level++;
  }

  setScale(scale) {
    if (this.type !== "shot") {
      this.position.x *= scale;
      this.position.y *= scale;
    }
    if (this.texture) {
      this.texture.width = this.size.width;
      this.texture.height = this.size.height;
    } else debugger;

    this.size.width *= scale;
    this.size.height *= scale;

    this.movement.speed *= scale;

    if (this.type === "shot")
      console.log(
        `magic position after scaling: ${this.position.x}, ${this.position.y}`
      );
    this.isScaled = true;
  }
}
