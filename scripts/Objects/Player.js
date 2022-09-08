import { Empty } from "./Empty.js";
import { GameObject } from "./GameObject.js";
import { FastMagicBall } from "./Magic/FastMagicBall.js";
import { MagicBall } from "./Magic/MagicBall.js";
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
      points: 0,
      pointsToGrow: 2,
      upgrades: 0,
      level: 1,
      resurrections: 0,
      size: 0,
      maxStamina: 100,
      currentStamina: 100,
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
      isAbleToGrow: true,
    });
    this.magicCooldown = 500;
    this.lastMagicCreatedTime = 0;
    this.classicMagicShotTexture = new Empty([
      [
        "texture",
        {
          name: "magic",
          img: null,
          sx: 0,
          sy: 0,
        },
      ],
      [
        "imageLoaded",
        () => {
          console.log(this.classicMagicShotTexture);
        },
      ],
    ]);
    this.cost = { defence: 1, attack: 1, magic: 1, size: 1, resurrections: 3 };
    this.parms = {
      defence: "defence",
      attack: "physicalAttack",
      magic: "magicAttack",
      size: "size",
      resurrections: "resurrections",
    };
    this.lastStaminaRecoveryTime = 0;
    this.staminaRecoverySpeed = 100; // 1 point in 500 ms
  }

  setBody(bodyObject) {
    this.bodyObject = bodyObject;
    this.body = bodyObject.body;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  setSpawnPoint(x, y) {
    this.spawnPoint = { x, y };
  }

  death() {
    this.runStop();
    this.body.splice(this.bodyObject.bodyLength);
    this.moveTo({ x: this.spawnPoint.x, y: this.spawnPoint.y });
    this.status.points = 0;
    this.status.upgrades = 0;
    this.status.pointsToGrow = this._calculatePoints(this.status.level);
    this.status.maxHP = 10 + this.status.size * 2;
    this.status.currentHP = this.status.maxHP + 0;
    this.status.currentStamina = this.status.maxStamina + 0;
    console.log(this.body.length);
  }

  moveTo(position) {
    this.setPosition(position.x, position.y);
    this.body.forEach((el) => (el.position = position));
  }

  _calculatePoints(level) {
    let points = 2;
    for (let i = 1; i < level; i++) {
      points = Math.floor(points * (i > 11 ? 1.2 : 1.5));
    }
    return points;
  }

  modifyParameter(parameter, modifier) {
    if (this.status.upgrades < this.cost[parameter]) return;
    modifier === "+"
      ? this.status[this.parms[parameter]]++
      : this.status[this.parms[parameter]]--;
    this.status.upgrades -= this.cost[parameter];
    if (parameter === "size") this.bodyObject.bodyLength += 20;
    else {
      this.body.splice(-20);
      this.status.maxHP -= 2;
      this.status.currentHP -= 2;
    }
    this.status.level++;
  }

  runStart() {
    if (this.status.currentStamina < 10) return;
    this.bodyObject.isRunning = true;
    this.movement.speed += 2;
    this.bodyLength = this.body.length;
    this.body.splice(Math.floor(this.bodyLength / 2));
  }
  runStop() {
    if (!this.bodyObject.isRunning) return;
    this.bodyObject.isRunning = false;
    this.movement.speed -= 2;
    this.bodyObject.grow(Math.floor(this.bodyLength / 2) + 1, this);
    for (let i = 0; i < this.body.length / 2.5; i++)
      this.bodyObject.renew(this);
  }

  grow() {
    this.bodyObject.grow(20, this);
    this.status.maxHP += 2;
    this.status.currentHP += 2;
  }

  setLength(length) {
    this.body.splice(1);
    this.bodyObject.grow(length - 1, this);
  }

  createMagic(time, magic) {
    console.log(magic);
    if (
      this.status.currentMP >= 1 &&
      (time - this.lastMagicCreatedTime > this.magicCooldown ||
        this.lastMagicCreatedTime === 0)
    ) {
      this.status.currentMP -= 1;
      this.lastMagicCreatedTime = time;
      let data = {
        position: {
          x:
            Math.floor(this.position.x + this.size.width / 2) -
            32 -
            (this.movement.direction === "left"
              ? 64
              : this.movement.direction === "right"
              ? -64
              : 0),
          y:
            Math.floor(this.position.y + this.size.height / 2) -
            32 -
            (this.movement.direction === "up"
              ? 64
              : this.movement.direction === "down"
              ? -64
              : 0),
        },
        size: { width: 64, height: 64 },
        texture: this.classicMagicShotTexture.texture,
        direction: this.movement.direction,
        attackMultiplier: this.status.magicAttack,
      };
      switch (magic) {
        case "magic_ball":
          this._createObject(new MagicBall(data));
          break;
        case "fast_magic_ball":
          this._createObject(new FastMagicBall(data));
          break;
      }
    }
  }

  update() {
    this.bodyObject.update(this);
  }
}
