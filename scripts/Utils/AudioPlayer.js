import { GameObject } from "../Objects/GameObject.js";

export class AudioPlayer extends GameObject {
  constructor(name, isRepeating = false, volume = 1) {
    super({
      name,
      type: "audio_player",
      texture: { name, img: null, sx: 0, sy: 0 },
      isDisplayed: false,
    });
    this.isRepeating = isRepeating;
    this.isStarted = false;
    this.volume = volume;
  }

  play() {
    if (this.isStarted) this.sound.currentTime = 0;
    this.sound.volume = this.volume;
    this.sound.loop = this.isRepeating;
    this.sound.play();
    this.isStarted = true;
  }

  stop() {
    this.sound.pause();
    this.sound.currentTime = 0;
    this.isStarted = false;
  }

  delete() {
    this.sound.remove();
  }

  imageLoaded() {
    this.sound = this.texture.img;
  }
}
