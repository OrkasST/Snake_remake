import { GameObject } from "../GameObject.js";

export class Ant extends GameObject {
  constructor(position = { x: 0, y: 0 }, texture, path) {
    super({
      AIType: "dummy",
      size: { width: 20, height: 40 },
      color: "#a7dc9b",
      position,
      movement: { speed: 3 },
      texture,
    });
    this.AI.setMe(this);
    this.AI.setPath(path);
  }

  update(time) {
    this.AI.followPath([1, 2, 3, 4, 5]);
    switch (this.movement.direction) {
      case "up":
        this.size.width = 20;
        this.size.height = 40;
        this.texture.sx = 0;
        this.texture.sy = 0;
        break;
      case "down":
        this.size.width = 20;
        this.size.height = 40;
        this.texture.sx = 20;
        this.texture.sy = 0;
        break;
      case "left":
        this.size.width = 40;
        this.size.height = 20;
        this.texture.sx = 80;
        this.texture.sy = 10;
        break;
      case "right":
        this.size.width = 40;
        this.size.height = 20;
        this.texture.sx = 40;
        this.texture.sy = 10;
        break;
      default:
        break;
    }
  }

  onCollision(object) {
    if (object.type === "shot") this.destroy();
  }
}
