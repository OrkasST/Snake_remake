import { GameObject } from "../Objects/GameObject.js";

export class VideoPlayer extends GameObject {
  constructor() {
    super({
      type: "video-player",
      texture: { name: "video", img: null, sx: 0, sy: 0 },
    });
    this.isAppended = false;
  }

  append() {
    document.body.appendChild(this.texture.img);
    this.texture.img.muted = "muted";
    this.texture.img.autoplay = true;
    this.isAppended = true;
  }

  delete() {
    this.texture.img.remove();
  }
}
