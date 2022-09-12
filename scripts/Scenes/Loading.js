import { MediaLoader } from "../Utils/MediaLoader.js";
import { Scene } from "./Scene.js";

export class Loading extends Scene {
  constructor({ nextSceneName = "", loadList = {} }) {
    super({
      background: {
        width: window.outerWidth,
        height: window.outerHeight,
      },
      objects: {
        main: {
          text: {
            font: "40px TimesNewRoman",
            color: "#FFFFFF",
            x: 100,
            y: 100,
            text: "Loading...",
          },
        },
      },
      time: 2000,
    });

    this.loadList = loadList;
    this.inProcess = false;
    this.nextSceneName = nextSceneName;
    this.timeIsOut = false;
    this.loadingIsFinished = false;
    // this.startTime = null;
  }

  startProcess(scene) {
    this.inProcess = true;
    let subscribers = [];
    for (let i in scene.objects) {
      subscribers.push(scene.objects[i]);
    }
    if (this.loadList) this._loadTextures(subscribers, scene.type);
  }

  async _loadTextures(subscribers, type) {
    let loader = new MediaLoader(type);
    let connections = [];
    loader.setMedia(this.loadList);
    loader.loadMedia().then(
      (names) => {
        connections = subscribers
          .filter((subscriber) => subscriber.texture)
          .map((subscriber) => {
            subscriber.texture.img =
              loader.loadedMedia[subscriber.texture.name];
            return subscriber.imageLoaded();
          });

        Promise.all(connections).then(() => {
          // console.log("Process Finished");
          this.loadingIsFinished = true;
        });
      },
      (error) => console.error(error)
    );
  }
  update(time) {
    // console.group("Loading update");
    // console.log("time: ", time);
    // console.log("loadingIsFinished: ", this.loadingIsFinished);
    // console.log("startTime: ", this.startTime);
    // console.groupEnd();
    if (time - this.startTime >= this.time && this.loadingIsFinished) {
      this.isFinished = true;
      this._onFinish();
    }
  }
}
