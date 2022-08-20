import { Shot } from "../Shot.js";

export class FastMagicBall extends Shot {
  constructor(params) {
    super({ ...params, speed: 16 });
  }
}
