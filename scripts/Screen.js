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
    if (obj.isAlive || obj._isUnderAttack)
      this.drawObjectHP(
        obj.position.x + this.camera.position.x + obj.size.width / 2,
        obj.position.y + this.camera.position.y,
        obj.status.maxHP,
        obj.status.currentHP
      );
  }

  drawArray(array) {
    for (let i = array.length - 1; i >= 0; i--) this.drawObject(array[i]);
  }

  drawObjectHP(centerX, y, maxHP, currentHP, color = "#FF0000") {
    this._draw({
      x: centerX - 11,
      y: y - 6,
      color: "#FFFFFF",
      width: 22,
      height: 3,
    });
    this._draw({
      x: centerX - 10.5,
      y: y - 5.5,
      color,
      width: (21 / maxHP) * currentHP,
      height: 2,
    });
  }

  drawUI(status) {
    // draw HP bar
    this._draw({
      x: 50,
      y: 30,
      width: 162,
      height: 22,
      color: "#000000",
    });
    this._draw({
      x: 51,
      y: 31,
      width: 160,
      height: 20,
      color: "#FFFFFF",
    });

    let hpGradient = this.ctx.createLinearGradient(0, 31, 0, 51);
    hpGradient.addColorStop(0, "#fad7d7");
    hpGradient.addColorStop(0.5, "#7c1515");
    hpGradient.addColorStop(1, "#b57e7e");
    this._draw({
      x: 51,
      y: 31,
      width: (160 / status.maxHP) * status.currentHP,
      height: 20,
      color: hpGradient,
    });
    this.drawText({
      font: "15px Arial",
      color: "#FFFFFF",
      x: 56,
      y: 47,
      text: `${status.currentHP}/${status.maxHP}`,
    });

    // draw MP bar
    this._draw({
      x: 50,
      y: 60,
      width: 162,
      height: 17,
      color: "#000000",
    });
    this._draw({
      x: 51,
      y: 61,
      width: 160,
      height: 15,
      color: "#FFFFFF",
    });
    let mpGradient = this.ctx.createLinearGradient(0, 61, 0, 76);
    mpGradient.addColorStop(0, "#b4c2f9");
    mpGradient.addColorStop(0.5, "#18157c");
    mpGradient.addColorStop(1, "#4b66ff");
    this._draw({
      x: 51,
      y: 61,
      width: (160 / status.maxMP) * status.currentMP,
      height: 15,
      color: mpGradient,
    });
    this.drawText({
      font: "13px Arial",
      color: "#FFFFFF",
      x: 58,
      y: 73,
      text: `${status.currentMP}/${status.maxMP}`,
    });
  }

  drawScene(scene) {
    this._draw(scene.background);
    for (let el in scene.objects) {
      if (scene.objects[el].body) this.draw(scene.objects[el].body);
      if (scene.objects[el].text) this.drawText(scene.objects[el].text);
    }
  }
}
