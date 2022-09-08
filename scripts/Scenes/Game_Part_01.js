import { Player } from "../Objects/Player.js";
import { SnakeBody } from "../Objects/SnakeBody.js";
import { AntSpawner } from "../Objects/Spawners/AntSpawner.js";
import { AppleSpawner } from "../Objects/Spawners/AppleSpawner.js";
import { Map } from "../Utils/Map.js";

export class Game_Part_001 {
  constructor() {
    this.name = "Part_001";
    this.type = "game";
    this.objects = {};
    this.objects.map = new Map({});
    this.objects.player = new Player({
      isDisplayed: false,
      position: { x: 1432, y: 1198 },
    });
    this.objects.player.setSpawnPoint(1432, 1198);
    this.objects.player.setBody(
      new SnakeBody({
        head: this.objects.player,
        bodyLength: 65,
        name: "playerSnake",
      })
    );
    this.objects.playerSnake = this.objects.player.bodyObject;
    this.objects.antSpawner = new AntSpawner({ name: "antSpawner" });
    this.objects.appleSpawner = new AppleSpawner({
      name: "appleSpawner",
      interval: 2000,
      position: { x: 1532, y: 1298 },
      spawnRadius: 800,
    });
    this.objects.magic = this.objects.player.classicMagicShotTexture;
    this.textures = {
      "map-tiles": "/Snake_remake/images/tiles.png",
      snake: "/Snake_remake/images/snake_10.png",
      ant: "/Snake_remake/images/ant.png",
      apple: "/Snake_remake/images/apple.png",
      magic: "/Snake_remake/images/Magic_ball.png",
    };
  }

  _update() {}
}

//{ x: 1432, y: 1198 }
//{ x: 125, y: 125 }

// for git-pages
// {
//   "map-tiles": "/Snake_remake/images/tiles.png",
//   snake: "/Snake_remake/images/snake_10.png",
//   ant: "/Snake_remake/images/ant.png",
//   apple: "/Snake_remake/images/apple.png",
//   magic: "/Snake_remake/images/Magic_ball.png",
// };

// for pc
// {
//   "map-tiles": "./../../images/tiles.png",
//   snake: "./../../images/snake_10.png",
//   ant: "./../../images/ant.png",
//   apple: "./../../images/apple.png",
//   magic: "./../../images/Magic_ball.png",
// };
