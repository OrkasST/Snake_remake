import { Empty } from "./Empty.js";
import { GameObject } from "./GameObject.js";
import { FastMagicBall } from "./Magic/FastMagicBall.js";
import { MagicBall } from "./Magic/MagicBall.js";
import { Shot } from "./Shot.js";

export class Player extends GameObject {
  constructor({
    name = "Player",
    type = "player",
    id = "player_01",
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
      physicalAttack: 1,
      control: 0,
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
      id,
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
      ["imageLoaded", () => {}],
    ]);
    this.cost = {
      defence: 1,
      attack: 1,
      magic: 1,
      control: 1,
      size: 1,
      resurrections: 3,
    };
    this.parms = {
      defence: "defence",
      attack: "physicalAttack",
      magic: "maxMP",
      control: "control",
      size: "size",
      resurrections: "resurrections",
    };
    this.lastStaminaRecoveryTime = 0;
    this.staminaRecoverySpeed = 100; // 1 point in 500 ms

    this.spellList = {
      magic_ball: {
        params: {
          speed: 4,
          attackMultiplier: 0,
        },
        cost: 1,
        control: 0,
        experiance: 0,
        needToUpdate: 10,
      },
      fast_magic_ball: {
        params: {
          speed: 12,
          attackMultiplier: 0,
        },
        cost: 3,
        control: 0,
        experiance: 0,
        needToUpdate: 10,
      },
    };
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
    if (parameter === "magic") this.status.currentMP = this.status.maxMP;
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
    if (
      this.status.currentMP >= 1 &&
      (time - this.lastMagicCreatedTime > this.magicCooldown ||
        this.lastMagicCreatedTime === 0)
    ) {
      this.status.currentMP -= this.spellList[magic].cost;
      this.isCreatingMagic = true;
      this.lastMagicCreatedTime = time;
      let data = {
        id: this.id,
        name: magic,
        position: this._setMagicPosition(),
        size: { width: 64, height: 64 },
        texture: this.classicMagicShotTexture.texture,
        time,
        ...this.spellList[magic].params,
      };
      this.currentSpell = this._createObject(new MagicBall(data));
      // switch (magic) {
      //   case "magic_ball":
      //     this.currentSpell = this._createObject(new MagicBall(data));
      //     break;
      //   case "fast_magic_ball":
      //     this.currentSpell = this._createObject(new FastMagicBall(data));
      //     break;
      // }
    }
  }

  _setMagicPosition() {
    return {
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
    };
  }

  releaseMagic(time) {
    this.isCreatingMagic = false;
    this.lastMagicCreatedTime = time;
    this.setSpellEXP(this.currentSpell.name);
    this.currentSpell.release(this.movement.direction, time);
    this.currentSpell = null;
  }

  update(time) {
    this.bodyObject.update(this);
    if (this.isCreatingMagic) {
      if (
        this.status.control + this.spellList[this.currentSpell.name].control >
        10
      )
        this.currentSpell.position = this._setMagicPosition();
      else this.movement.status = "standing";

      if (this.currentSpell.isInOrderToDestroy) {
        this.isCreatingMagic = false;
        this.currentSpell = null;
        this.lastMagicCreatedTime = time;
      }
    }

    if (
      this.isCreatingMagic &&
      time - this.lastMagicCreatedTime > 500 &&
      time - this.currentSpell.updateTime > 500 &&
      this.status.currentMP >= 1
    ) {
      if (
        this.currentSpell.upgrades >=
        this.status.control + this.spellList[this.currentSpell.name].control
      ) {
        this.isCreatingMagic = false;
        this.lastMagicCreatedTime = time;
        this._recalculateHP(
          this.currentSpell.status.magicAttack + this.currentSpell.upgrades
        );
        this.status.currentMP--;
        this.currentSpell.destroy();
        this.currentSpell = null;
        return;
      }
      this.status.currentMP--;
      this.currentSpell.upgrade(time);
    } else if (this.isCreatingMagic && this.status.currentMP <= 0)
      this.releaseMagic(time);
  }

  setSpellEXP(name) {
    let spell = this.spellList[name];
    spell.experiance++;
    if (spell.experiance === spell.needToUpdate) {
      spell.experiance = 0;
      spell.control++;
      spell.needToUpdate = Math.floor(spell.needToUpdate * 1.2);
    }
  }
}
