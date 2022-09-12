import { Shot } from "../Shot.js";

export class MagicBall extends Shot {
  constructor(params) {
    super(params);
    this.creationTime = params.time;
    this.updateTime = 0;
    this.upgrades = 0;
  }

  upgrade(time) {
    this.status.magicAttack++;
    this.updateTime = time;
    this.upgrades++;
  }
}
