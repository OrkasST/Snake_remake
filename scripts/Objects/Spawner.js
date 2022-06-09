import { GameObject } from "./GameObject.js";
import { Ant } from "./SmartObjects/Ant.js";

export class Spawner extends GameObject {
  constructor({
    interval = 50000,
    position = { x: 0, y: 0 },
    spawnRadius = 200,
  }) {
    super({
      isDisplayed: false,
      position,
      type: "spawner",
      texture: { name: "ant", img: null },
    });
    this.interval = interval;
    this.previousSpawnTime = 0;
    this.spawnRadius = spawnRadius;
    this.path = [
      { x: 0, y: 0 },
      { x: 500, y: 30 },
      { x: 60, y: 700 },
      { x: 1000, y: 1050 },
    ];
  }

  spawn(time) {
    if (
      time - this.previousSpawnTime >= this.interval ||
      this.previousSpawnTime === 0
    ) {
      this._createObject(
        new Ant(
          {
            x: this.position.x + this.spawnRadius * Math.random(),
            y: this.position.y + this.spawnRadius * Math.random(),
          },
          { name: this.texture.name, img: this.texture.img, sx: 0, sy: 0 },
          this.path
        )
      );
      this.previousSpawnTime = time;
      console.log("Ant created");
    }
  }
}
