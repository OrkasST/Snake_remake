import { Apple } from "../Apple.js";
import { Spawner } from "./Spawner.js";

export class AppleSpawner extends Spawner {
  constructor({
    name = "",
    interval = 50000,
    position = { x: 0, y: 0 },
    spawnRadius = 200,
  }) {
    super({ name, interval, position, spawnRadius, image: "apple" });
    this.applesAmmount = 0;
    this.spawnLimit = 50;
  }
  spawn(time, position, system) {
    if (time - this.previousSpawnTime >= this.interval * 1000)
      this.apples.applesAmmount = 0;
    if (
      (time - this.previousSpawnTime >= this.interval ||
        this.previousSpawnTime === 0 ||
        system) &&
      this.applesAmmount < this.spawnLimit
    ) {
      this._createObject(
        new Apple(
          position || {
            x: this.position.x + this.spawnRadius * Math.random(),
            y: this.position.y + this.spawnRadius * Math.random(),
          },
          { name: this.texture.name, img: this.texture.img, sx: 0, sy: 0 },
          this.id
        )
      );
      this.applesAmmount++;
      this.previousSpawnTime = time;
    }
  }
}
