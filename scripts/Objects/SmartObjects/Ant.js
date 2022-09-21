import { GameObject } from "../GameObject.js";

export class Ant extends GameObject {
  constructor(
    position = { x: 0, y: 0 },
    texture,
    path,
    id,
    params = {
      isPathClosed: null,
      localPathIsCreated: null,
      step: null,
      stepsCount: null,
      _localPath: null,
      _localStep: null,
    }
  ) {
    super({
      id,
      name: "ant",
      AIType: "dummy",
      size: { width: 20, height: 40 },
      color: "#a7dc9b",
      position,
      movement: { speed: 3 },
      texture,
      isAlive: true,
      isDestructive: true,
      status: {
        maxHP: 10,
        currentHP: 10,
        maxMP: 0,
        currentMP: 0,
        defence: 0,
        // attack: 0,
        magicAttack: 0,
        physicalAttack: 1,
      },
    });
    this.AI.setPath(path);
    if (params) {
      this.AI.setPath(path, params.isPathClosed);
      this.AI.setLocalPath(params._localPath, params.localPathIsCreated);
      this.AI.setStep(params.step);
      this.AI.setStepsCount(params.stepsCount);
      this.AI.setLocalStep(params._localStep);
    }
  }

  update(time) {
    this.AI.followPath(this, [1, 2, 3, 4, 5]);
    let long =
      this.size.height > this.size.width ? this.size.height : this.size.width;
    let short =
      this.size.height < this.size.width ? this.size.height : this.size.width;

    switch (this.movement.direction) {
      case "up":
        this.size.width = short;
        this.size.height = long;
        this.texture.sx = 0;
        this.texture.sy = 0;
        break;
      case "down":
        this.size.width = short;
        this.size.height = long;
        this.texture.sx = 20;
        this.texture.sy = 0;
        break;
      case "left":
        this.size.width = long;
        this.size.height = short;
        this.texture.sx = 80;
        this.texture.sy = 10;
        break;
      case "right":
        this.size.width = long;
        this.size.height = short;
        this.texture.sx = 40;
        this.texture.sy = 10;
        break;
      default:
        break;
    }
  }

  // onCollision(object, damage) {
  //   if (object.type === "shot") this.destroy();
  // }
}
