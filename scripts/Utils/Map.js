import { GameObject } from "../Objects/GameObject.js";
import { SpriteSheet } from "./SpriteSheet.js";

export class Map {
  constructor({ width = 640, height = 640, mapName = "new_world_map_2" }) {
    this.type = "map";
    this.width = width;
    this.height = height;
    this.screen = document.createElement("canvas");
    this.screen.width = width;
    this.screen.height = height;
    this.ctx = this.screen.getContext("2d");
    this.mapData = null;
    this.texture = {
      name: "map-tiles",
      img: null,
    };
    this.image = null;
    this.spawnPoints = null;
    this.hitboxes = null;
    this.mapName = mapName;
  }

  async imageLoaded() {
    console.log("Creating Map....");
    const got = await fetch(`./../../maps/${this.mapName}.json`);
    //for git-pages:
    //fetch(`/Snake_remake/maps/${this.mapName}.json`);
    this.mapData = await got.json();
    this.createMap(1);
    console.log("Map Created");
    return true;
  }
  createMap(GS) {
    this.screen.width = this.mapData.width * this.mapData.tilewidth;
    this.screen.height = this.mapData.height * this.mapData.tileheight;
    let tileset = new SpriteSheet({
      imageName: "tiles",
      imageWidth: 640,
      imageHeight: 640,
    });
    const hitboxes = [];
    const spawnPoints = [];
    let row, col;
    this.mapData.layers.forEach((layer) => {
      if (layer.type === "tilelayer") {
        row = 0;
        col = 0;
        layer.data.forEach((index) => {
          if (index > 0) {
            this.ctx.drawImage(
              this.texture.img,
              tileset.getSourceX(index),
              tileset.getSourceY(index),
              this.mapData.tilewidth,
              this.mapData.tileheight,
              col * this.mapData.tilewidth,
              row * this.mapData.tileheight,
              this.mapData.tilewidth,
              this.mapData.tileheight
            );
          }
          col++;
          if (col > this.mapData.width - 1) {
            col = 0;
            row++;
          }
        });
      }
      if (layer.type === "objectgroup") {
        if (layer.id !== 21)
          spawnPoints[layer.name] = [
            ...layer.objects.map((obj) => ({ x: obj.x, y: obj.y })),
          ];
        else
          hitboxes.push(
            ...layer.objects.map((obj) => ({
              x1: obj.x,
              x2: obj.x + obj.width,
              y1: obj.y,
              y2: obj.y + obj.height,
              type: obj.type,
              id: obj.id,
            }))
          );
      }
    });

    // images[name] = mapScreen;
    // return new TileMap({
    //     imageName: name,
    //     sourceX: 0,
    //     sourceY: 0,
    //     width: mapScreen.width,
    //     height: mapScreen.height,
    //     hitboxes: hitboxes
    // });

    this.image = new GameObject({
      type: "map_image",
      position: {
        x: 0,
        y: 0,
      },
      color: "#000000",
      texture: {
        img: this.screen,
        sx: 0,
        sy: 0,
      },
      size: {
        width: this.screen.width * GS,
        height: this.screen.height * GS,
      },
      movement: {
        disabled: "all",
      },
      isDisplayed: true,
    });
    this.image.collisionBody = false;
    this.spawnPoints = spawnPoints;
    this.hitboxes = hitboxes;
    // console.log(this.spawnPoints);
  }
}
