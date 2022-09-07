export class Scene {
  constructor({
    name = "Default Loading Scene",
    type = "loading", //game, loading, video
    background = {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    objects = {
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
    textures = {},
    time = 2000,
    nextScene = "",
    _onFinish = () => {},
    _update = null,
  }) {
    this.name = name;
    this.type = type;
    this.background = background;
    this.objects = objects;
    this.time = time;
    this.isFinished = false;
    this.data = [];
    this.textures = textures;
    this.isPrepared = false;
    this.nextScene = nextScene;
    this.startTime = null;
    this._onFinish = _onFinish;
    if (_update) this.update = _update;
  }

  setStartTime(time) {
    console.group("Set Start Time");
    console.log("start time set");
    console.log("time: ", time);
    this.startTime = time || 0;
    console.log("startTime: ", this.startTime);
    console.groupEnd();
  }

  setData(data) {
    this.data = data;
  }

  update(time) {
    if (time - this.startTime >= this.time) {
      this.isFinished = true;
      this._onFinish();
    }
  }
}
