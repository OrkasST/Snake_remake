import { Player } from "../Objects/Player.js";
import { SnakeBody } from "../Objects/SnakeBody.js";
import { AntSpawner } from "../Objects/Spawners/AntSpawner.js";
import { AppleSpawner } from "../Objects/Spawners/AppleSpawner.js";
import { Map } from "../Utils/Map.js";

export class Game_Part_001 {
  constructor() {
    this.type = "game";
    this.objects = {};
    this.objects.map = new Map({});
    this.objects.player = new Player({
      isDisplayed: false,
      position: { x: 1432, y: 1198 },
    });
    this.objects.player.setSpawnPoint(1432, 1198);
    this.objects.playerSnake = new SnakeBody({
      head: this.objects.player,
      bodyLength: 65,
      name: "playerSnake",
    });
    this.objects.player.setBody(this.objects.playerSnake);
    this.objects.antSpawner = new AntSpawner({});
    this.objects.appleSpawner = new AppleSpawner({
      interval: 2000,
      position: { x: 1932, y: 1698 },
      spawnRadius: 800,
    });
    this.textures = {
      "map-tiles": "../../images/tiles.png",
      snake: "../../images/snake_10.png",
      ant: "../../images/ant.png",
      apple: "../../images/apple.png",
    };
  }

  _update() {}
}

//{ x: 1432, y: 1198 }
//{ x: 125, y: 125 }
