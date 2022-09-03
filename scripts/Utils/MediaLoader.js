export class MediaLoader {
  constructor(type) {
    this.mediaToLoad = null;
    this.loadedMedia = {};
    this.promises = [];
    this.type = type;
  }

  setMedia(media) {
    this.mediaToLoad = media;
    this.loadedMedia = {};
    this.promises = [];
  }

  loadMedia() {
    console.log("Media loading started...");
    for (let name in this.mediaToLoad) {
      this.promises.push(this.load(name, this.mediaToLoad[name]));
    }
    return Promise.all(this.promises);
  }

  load(name, src) {
    return new Promise((resolve, reject) => {
      const img =
        this.type === "video" ? document.createElement("video") : new Image();
      this.loadedMedia[name] = img;
      this.type === "video"
        ? (img.oncanplaythrough = () => resolve(name))
        : (img.onload = () => resolve(name));
      img.onerror = (error) => reject(error);
      console.log(window.location.origin + src);
      img.src = "Snake_remake" + src;
    });
  }
}
