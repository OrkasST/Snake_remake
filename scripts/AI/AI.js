export class AI {
  constructor({ type = "dummy" }) {
    this.type = type;
    this.step = 0;
    this.isPathClosed = false;

    //Timely
    this.stepsCount = 0;
    this.min = 30;
  }

  setMe(me) {
    this.me = me;
    console.log("Me set");
  }

  setPath(path) {
    this.path = path;
    console.log("Path set");
  }

  followPath() {
    if (this.isPathClosed) return;
    if (this.step >= this.path.length && !this.isPathClosed) {
      this.isPathClosed = true;
      console.log("PathClosed");
    } else {
      this.me.status = "moving";
      if (this.goTo(this.path[this.step])) {
        this.step++;
        console.log(this.step);
      }
    }
  }

  prepare(destination) {
    this.me.status = "moving";
    // if (destination) this.chooseDirection(destination)
    // if (this.stepsCount <= 0) {
    //   this.chooseDirection();
    //   this.chooseStepsCount();
    // } else {
    //   this.stepsCount--;
    // }
  }

  chooseDirection() {
    let ind = Math.floor(Math.random() * 5);
    switch (ind) {
      case 0:
        this.me.movement.direction = "stop";
        break;
      case 1:
        this.me.movement.direction = "up";
        break;
      case 2:
        this.me.movement.direction = "right";
        break;
      case 3:
        this.me.movement.direction = "down";
        break;
      case 4:
        this.me.movement.direction = "left";
        break;
      default:
        break;
    }
  }

  chooseStepsCount() {
    let ind = Math.floor(Math.random() * 15) + this.min;
    this.stepsCount = ind;
  }

  goTo(point = { x: 0, y: 0 }) {
    if (this.stepsCount === 0) {
      if (
        Math.abs(point.x - this.me.position.x) <
        Math.abs(point.y - this.me.position.y)
      ) {
        this.me.movement.direction =
          this.me.position.y >= point.y ? "up" : "down";
        this.stepsCount = 5;
      } else {
        this.me.movement.direction =
          this.me.position.x >= point.x ? "left" : "right";
        this.stepsCount = 10;
      }
    } else {
      this.stepsCount--;
    }
    if (
      point.x >= this.me.position.x - 3 &&
      point.x <= this.me.position.x + this.me.size.width + 3 &&
      point.y >= this.me.position.y - 3 &&
      point.y <= this.me.position.y + this.me.size.height + 3
    ) {
      console.log("Point arrived");
      return true;
    }
    return false;
  }
}
