import { Apple } from "../Apple.js";
import { Spawner } from "./Spawner.js";

export class AppleSpawner extends Spawner {
  constructor({
    interval = 50000,
    position = { x: 0, y: 0 },
    spawnRadius = 200,
  }) {
    super({ interval, position, spawnRadius, image: "apple" });
    this.applesAmmount = 0;
    this.spawnLimit = 50;
  }
  spawn(time) {
    if (time - this.previousSpawnTime >= this.interval * 1000)
      this.apples.applesAmmount = 0;
    if (
      (time - this.previousSpawnTime >= this.interval ||
        this.previousSpawnTime === 0) &&
      this.applesAmmount < this.spawnLimit
    ) {
      this._createObject(
        new Apple(
          {
            x: this.position.x + this.spawnRadius * Math.random(),
            y: this.position.y + this.spawnRadius * Math.random(),
          },
          { name: this.texture.name, img: this.texture.img, sx: 0, sy: 0 },
          this.path
        )
      );
      this.applesAmmount++;
      this.previousSpawnTime = time;
    }
  }
}
