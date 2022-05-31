import { Camera } from "./Utils/Camera.js";
import { MediaLoader } from "./Utils/MediaLoader.js";

export class Screen {
  constructor({ width = 200, height = 200 }) {
    this.height = height;
    this.width = width;
    this.cnv =
      document.querySelector("canvas") ||
      document.body.appendChild(document.createElement("canvas"));
    this.cnv.width = this.width;
    this.cnv.height = this.height;
    this.ctx = this.cnv.getContext("2d");
    this.camera = new Camera();
    this.loader = new MediaLoader();
  }

  setSize({ width, height }) {
    this.height = height;
    this.width = width;
    this.cnv.width = width;
    this.cnv.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  _draw({
    x = 0,
    y = 0,
    color = "#000000",
    texture = null,
    width = 10,
    height = 10,
  }) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    texture
      ? this.ctx.drawImage(
          texture.img,
          texture.sx,
          texture.sy,
          texture.width ? texture.width : width,
          texture.height ? texture.height : height,
          x,
          y,
          texture.width ? texture.width : width,
          texture.height ? texture.height : height
        )
      : this.ctx.fillRect(x, y, width, height);
    this.ctx.closePath();
  }
  drawText({
    font = "30px Arial",
    color = "#000000",
    x = 10,
    y = 10,
    text = "NO USER TEXT",
  }) {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  drawObject(obj) {
    if (!obj.isDisplayed) return;
    this._draw({
      x: obj.position.x + this.camera.position.x,
      y: obj.position.y + this.camera.position.y,
      color: obj.color,
      texture: obj.texture,
      width: obj.size.width,
      height: obj.size.height,
    });
  }

  drawArray(array) {
    for (let i = array.length - 1; i >= 0; i--) this.drawObject(array[i]);
  }

  drawScene(scene) {
    this._draw(scene.background);
    for (let el in scene.objects) {
      if (scene.objects[el].body) this.draw(scene.objects[el].body);
      if (scene.objects[el].text) this.drawText(scene.objects[el].text);
    }
  }
}
