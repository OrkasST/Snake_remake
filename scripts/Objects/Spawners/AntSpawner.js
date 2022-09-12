import { Ant } from "../SmartObjects/Ant.js";
import { Spawner } from "./Spawner.js";

export class AntSpawner extends Spawner {
  constructor({
    name = "",
    interval = 5000,
    position = { x: 0, y: 0 },
    spawnRadius = 200,
  }) {
    super({ name, interval, position, spawnRadius, image: "ant" });
    this.path = [
      { x: 0, y: 0 },
      { x: 500, y: 30 },
      { x: 60, y: 700 },
      { x: 1000, y: 1050 },
    ];
  }

  spawn({time, position, system, params}) {
    if (
      time - this.previousSpawnTime >= this.interval ||
      this.previousSpawnTime === 0 ||
      system
    ) {
      this._createObject(
        new Ant(
          position || {
            x: this.position.x + this.spawnRadius * Math.random(),
            y: this.position.y + this.spawnRadius * Math.random(),
          },
          { name: this.texture.name, img: this.texture.img, sx: 0, sy: 0 },
          this.path,
          this.id,
          params
        )
      );
      this.previousSpawnTime = time;
      // console.log("Ant created");
    }
  }
}
