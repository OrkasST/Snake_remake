import { Player } from "../Objects/Player.js";
import { SnakeBody } from "../Objects/SnakeBody.js";
import { Spawner } from "../Objects/Spawner.js";
import { Map } from "../Utils/Map.js";

export class Game_Part_001 {
  constructor() {
    this.type = "game";
    this.objects = {};
    this.objects.map = new Map({});
    this.objects.player = new Player({
      isDisplayed: false,
      position: { x: 125, y: 125 },
    });
    this.objects.player.setSpawnPoint(1432, 1198);
    this.objects.playerSnake = new SnakeBody({
      head: this.objects.player,
      bodyLength: 65,
      name: "playerSnake",
    });
    this.objects.player.setBody(this.objects.playerSnake.body);
    this.objects.spawner = new Spawner({});
    this.textures = {
      "map-tiles": "../../images/tiles.png",
      snake: "../../images/snake.png",
      ant: "../../images/ant.png",
    };
  }

  _update() {}
}

//{ x: 1432, y: 1198 }
