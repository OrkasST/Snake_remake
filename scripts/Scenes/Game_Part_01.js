import { Player } from "../Objects/Player.js";
import { SnakeBody } from "../Objects/SnakeBody.js";
import { AntSpawner } from "../Objects/Spawners/AntSpawner.js";
import { AppleSpawner } from "../Objects/Spawners/AppleSpawner.js";
import { SoulSpawner } from "../Objects/Spawners/SoulSpawner.js";
import { AudioPlayer } from "../Utils/AudioPlayer.js";
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
        id: this.objects.player.id,
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
    this.objects.soulSpawner = new SoulSpawner({});
    this.objects.magic = this.objects.player.classicMagicShotTexture;
    this.objects.backgroundMusic = new AudioPlayer(
      "music_background",
      true,
      0.05
    );
    this.objects.appleIsEaten = new AudioPlayer("music_apple_eaten");
    this.textures = {
      "map-tiles": "./../../images/tiles.png",
      snake: "./../../images/snake_10.png",
      ant: "./../../images/ant.png",
      apple: "./../../images/apple.png",
      magic: "./../../images/Magic_ball.png",
      soul: "./../../images/Soul.png",
      music_background: "./../../images/music/backgroung_2.mp3",
      music_apple_eaten: "./../../images/music/eating_apple_2.wav",
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
//   soul: "/Snake_remake/images/Soul.png",
// };

// for pc
// {
//   "map-tiles": "./../../images/tiles.png",
//   snake: "./../../images/snake_10.png",
//   ant: "./../../images/ant.png",
//   apple: "./../../images/apple.png",
//   magic: "./../../images/Magic_ball.png",
//   soul: "./../../images/Soul.png",
// };
