import { Soul } from "../Soul.js";
import { Spawner } from "./Spawner.js";

export class SoulSpawner extends Spawner {
  constructor({
    type = "soul_spawner",
    name = "soulSpawner",
    interval = 0,
    position = { x: 0, y: 0 },
    spawnRadius = 0,
  }) {
    super({ type, name, interval, position, spawnRadius, image: "soul" });
  }

  spawn(position, points = 2, id) {
    this._createObject(
      new Soul(
        position,
        { name: this.texture.name, img: this.texture.img, sx: 0, sy: 0 },
        id,
        points
      )
    );
  }
}
