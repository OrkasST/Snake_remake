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
      0.0
    );
    this.objects.appleIsEaten = new AudioPlayer("music_apple_eaten", false, 1);
    this.textures = {
      "map-tiles": "/Snake_remake/media/images/tiles.png",
      snake: "/Snake_remake/media/images/snake_10.png",
      ant: "/Snake_remake/media/images/ant.png",
      apple: "/Snake_remake/media/images/apple.png",
      magic: "/Snake_remake/media/images/Magic_ball.png",
      soul: "/Snake_remake/media/images/Soul.png",
      UI: "/Snake_remake/media/images/UI.png",
      music_background: "/Snake_remake/media/music/backgroung_2.mp3",
      music_apple_eaten: "/Snake_remake/media/music/eating_apple_2.wav",
    };
  }

  _update() { }
}

//{ x: 1432, y: 1198 }
//{ x: 125, y: 125 }

// for git-pages
// {
//   "map-tiles": "/Snake_remake/media/images/tiles.png",
//   snake: "/Snake_remake/media/images/snake_10.png",
//   ant: "/Snake_remake/media/images/ant.png",
//   apple: "/Snake_remake/media/images/apple.png",
//   magic: "/Snake_remake/media/images/Magic_ball.png",
//   soul: "/Snake_remake/media/images/Soul.png",
//   UI: "/Snake_remake/media/images/UI.png",
//   music_background: "/Snake_remake/media/music/backgroung_2.mp3",
//   music_apple_eaten: "/Snake_remake/media/music/eating_apple_2.wav",
// };

// for pc
// {
//   "map-tiles": "./../../media/images/tiles.png",
//   snake: "./../../media/images/snake_10.png",
//   ant: "./../../media/images/ant.png",
//   apple: "./../../media/images/apple.png",
//   magic: "./../../media/images/Magic_ball.png",
//   soul: "./../../media/images/Soul.png",
//   UI: "./../../media/images/UI.png",
//   music_background: "./../../media/music/backgroung_2.mp3",
//   music_apple_eaten: "./../../media/music/eating_apple_2.wav",
// };
