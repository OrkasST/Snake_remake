import { GameObject } from "../GameObject.js";
import { Ant } from "../SmartObjects/Ant.js";

export class Spawner extends GameObject {
  constructor({
    name = "Default Spawner",
    interval = 50000,
    position = { x: 0, y: 0 },
    spawnRadius = 200,
    image = "",
  }) {
    super({
      name,
      id: `spawner_${name}_${position.x}${position.y}`,
      isDisplayed: false,
      position,
      type: "spawner",
      texture: { name: image, img: null },
      collisionBody: false,
    });
    this.interval = interval;
    this.previousSpawnTime = 0;
    this.spawnRadius = spawnRadius;
  }

  spawn(time) {}
}

// x: this.position.x + this.spawnRadius * Math.random(),
// y: this.position.y + this.spawnRadius * Math.random(),

// x: 46,
// y: 29.8,
