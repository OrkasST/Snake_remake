import { GameObject } from "./GameObject.js";

export class Shot extends GameObject {
  constructor({ position = { x, y }, direction = "none", status }) {
    super({
      name: "shot",
      type: "shot",
      size: {
        width: 20,
        height: 20,
      },
      position,
      status,
      movement: {
        disabledX: "none",
        disabledY: "none",
        direction,
        previousDirection: "none",
        speed: 4,
      },
      color: "#00FF00",
    });
  }
}
