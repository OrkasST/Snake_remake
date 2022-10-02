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
    this.UI = {
      img: null,
      sx: 0,
      sy: 0,
      width: 300,
      height: 200,
    };

    screen.orientation.onchange = () => {
      screen.orientation.type !== "portrait-primary"
        ? this.setSize({ width: window.outerWidth, height: window.outerHeight })
        : this.setSize({
            width: window.outerHeight,
            height: window.outerWidth,
          });
    };
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
    width = this.width,
    height = this.height,
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
          // texture.width ? texture.width : width,
          // texture.height ? texture.height : height
          width || texture.width,
          height || texture.height
        )
      : this.ctx.fillRect(x, y, width, height);
    this.ctx.closePath();
  }

  _strokeRct({ x = 0, y = 0, color = "#000000", width = 10, height = 10 }) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 0.2;
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.closePath();
  }

  _drawArc({
    x = 10,
    y = 10,
    radius = 10,
    angleStart = 0,
    angleEnd = Math.PI * 2,
    color = "#000000",
    filled = true,
  }) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, radius, angleStart, angleEnd);
    this.ctx.closePath();
    filled ? this.ctx.fill() : this.ctx.stroke();
  }

  _drawShiningParticle({ x, y, radius, color }) {
    this._drawArc({ x, y, radius: radius + 9, color: color + "05" });
    this._drawArc({ x, y, radius: radius + 7, color: color + "0F" });
    this._drawArc({ x, y, radius: radius + 4, color: color + "1A" });
    this._drawArc({ x, y, radius: radius + 2, color: color + "26" });
    this._drawArc({ x, y, radius, color: color + "66" });
    this._drawArc({ x, y, radius: radius - 1, color: "#FFFFFF26" });
    this._drawArc({ x, y, radius: radius - 2, color: "#FFFFFF4D" });
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
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i].type !== "particle") this.drawObject(array[i]);
      else {
        this._drawShiningParticle({
          ...array[i],
          x: array[i].x + this.camera.position.x,
          y: array[i].y + this.camera.position.y,
        });
      }
    }
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
    let hpGradient = this.ctx.createLinearGradient(0, 16, 0, 44);
    hpGradient.addColorStop(0, "#fad7d7");
    hpGradient.addColorStop(0.5, "#7c1515");
    hpGradient.addColorStop(1, "#b57e7e");
    this._draw({
      x: 40,
      y: 16,
      width: (200 / status.maxHP) * status.currentHP,
      height: 28,
      color: "#FF0000",
    });

    // draw MP bar
    this._draw({
      x: 40,
      y: 49,
      width: (160 / status.maxMP) * status.currentMP,
      height: 20,
      color: "#0000FF",
    });

    // draw stamina bar
    this._draw({
      x: 40,
      y: 74,
      width: (160 / status.maxStamina) * status.currentStamina,
      height: 20,
      color: "#157c70",
    });

    // draw groth status bar
    this.drawText({
      font: "24px TimesNewRoman",
      color: "#000000",
      x: this.width - 280,
      y: 37,
      text: status.upgrades,
    });
    this._draw({
      x: this.width - 248,
      y: 16,
      width: (200 / status.pointsToGrow) * status.points,
      height: 28,
      color: "#22f835",
    });

    //screen info
    //  this.drawText({
    //    font: "20px Arial",
    //    color: "#000000",
    //    x: this.width - 240,
    //    y: 80,
    //    text: `orientation angle: ${screen.orientation.angle}`,
    //  });
    //  this.drawText({
    //    font: "20px Arial",
    //    color: "#000000",
    //    x: 50,
    //    y: 100,
    //    text: `orientation type: ${screen.orientation.type}`,
    //  });
    // this.drawText({
    //   font: "20px Arial",
    //   color: "#000000",
    //   x: this.width - 240,
    //   y: 120,
    //   text: `outer_width: ${window.outerWidth}`,
    // });
    // this.drawText({
    //   font: "20px Arial",
    //   color: "#000000",
    //   x: this.width - 240,
    //   y: 140,
    //   text: `outer_height: ${window.outerHeight}`,
    // });

    //UI image
    this._draw({ texture: this.UI, width: 300, height: 200 });
    this._draw({
      x: this.width - 300,
      y: 0,
      texture: { ...this.UI, sx: 1628, sy: 0, width: 300, height: 200 },
      width: 300,
      height: 200,
    });

    this.drawText({
      font: "18px TimesNewRoman",
      color: "#FFFFFF",
      x: 56,
      y: 35,
      text: `${status.currentHP} / ${status.maxHP}`,
    });
    this.drawText({
      font: "15px Arial",
      color: "#FFFFFF",
      x: 56,
      y: 64,
      text: `${status.currentMP} / ${status.maxMP}`,
    });
    this.drawText({
      font: "15px TimesNewRoman",
      color: "#FFFFFF",
      x: 58,
      y: 88,
      text: `${status.currentStamina} / ${status.maxStamina}`,
    });
    this.drawText({
      font: "18px TimesNewRoman",
      color: "#FFFFFF",
      x: this.width - 240,
      y: 36,
      text: `${status.points} / ${status.pointsToGrow}`,
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
