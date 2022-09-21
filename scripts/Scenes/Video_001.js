import { VideoPlayer } from "../Utils/VideoPlayer.js";

export class Video_001 {
  constructor() {
    this.name = "Video_001";
    this.type = "video";
    this.objects = {};
    this.objects.videoPlayer = new VideoPlayer();
    this.textures = {
      video: "../../images/Video/0001-0302.mp4",
    };
    this.nextScene = "Part_001";
    this.time = 5200;
    this.isFinished = true;
  }

  _onFinish = () => {
    this.objects.videoPlayer.texture.img.remove();
  };
}
