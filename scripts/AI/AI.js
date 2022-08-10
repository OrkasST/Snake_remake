export class AI {
  constructor({ type = "dummy" }) {
    this.type = type;
    this.step = 0;
    this.isPathClosed = false;
    this.localPathIsCreated = false;
    this._localPath = [];
    this._localStep = 0;

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
      console.log("~~~~PathClosed~~~~");
      return;
    }
    this.me.movement.status = "moving";
    if (!this.localPathIsCreated) this._cteatePathTo(this.path[this.step]);
    if (this._isPointReached(this.path[this.step])) {
      this.step++;
      console.log(this.step);
      return;
    }
    if (!this._localPath[this._localStep]) {
      console.group("Path error");
      console.log("point: ", this.path[this.step]);
      console.log("me: ", this.me.position);
      console.log("size: ", this.me.size);
      console.groupEnd();
      debugger;
    }
    console.log(this._localStep);
    this.me.movement.direction = this._localPath[this._localStep];
    console.log(this._localPath[this._localStep]);
    this._localStep++;
  }

  prepare(destination) {
    this.me.movement.status = "moving";
    // if (destination) this.chooseDirection(destination)
    // if (this.stepsCount <= 0) {
    //   this.chooseDirection();
    //   this.chooseStepsCount();
    // } else {
    //   this.stepsCount--;
    // }
  }

  // chooseDirection() {
  //   let ind = Math.floor(Math.random() * 5);
  //   switch (ind) {
  //     case 0:
  //       this.me.movement.direction = "stop";
  //       break;
  //     case 1:
  //       this.me.movement.direction = "up";
  //       break;
  //     case 2:
  //       this.me.movement.direction = "right";
  //       break;
  //     case 3:
  //       this.me.movement.direction = "down";
  //       break;
  //     case 4:
  //       this.me.movement.direction = "left";
  //       break;
  //     default:
  //       break;
  //   }
  // }

  chooseStepsCount() {
    let ind = Math.floor(Math.random() * 15) + this.min;
    this.stepsCount = ind;
  }

  _isPointReached(point = { x: 0, y: 0, i: 0 }, i = 0) {
    if (
      point.x >= this.me.position.x &&
      point.x <= this.me.position.x + this.me.size.width &&
      point.y >= this.me.position.y &&
      point.y <= this.me.position.y + this.me.size.height
    ) {
      console.log(`****Point ${i} arrived`);
      this.localPathIsCreated = false;
      return true;
    } else return false;
  }

  _cteatePathTo(point = { x: 0, y: 0 }) {
    this._localStep = 0;
    let distX = point.x - this.me.position.x - this.me.size.width / 2,
      distY = point.y - this.me.position.y - this.me.size.height / 2;

    let xAxis = distX > 0 ? "right" : "left",
      yAxis = distY > 0 ? "down" : "up";

    let stepsX = Math.ceil(Math.abs(distX / this.me.movement.speed)),
      stepsY = Math.ceil(Math.abs(distY / this.me.movement.speed));

    console.group("Path params");
    console.log("speed: ", this.me.movement.speed);
    console.log("me: ", this.me.position);
    console.log("distX: ", distX);
    console.log("stepsX: ", stepsX);
    console.log("stepsY: ", stepsY);
    console.log("distY: ", distY);
    console.groupEnd();

    this._localPath =
      stepsX > stepsY
        ? this._fillArray(stepsX, stepsY, xAxis, yAxis)
        : this._fillArray(stepsY, stepsX, yAxis, xAxis);

    this.localPathIsCreated = true;
    console.log(this._localPath);
  }

  _fillArray(a, b, firstVal, secVal) {
    // console.log("a: ", a);
    let diff = a - b;
    let arr = [];
    let isFirst = true;
    let count = 1;
    for (let i = 1; i <= b * 2; i++) {
      if (count > (b > 10 ? 10 : b)) {
        isFirst = !isFirst;
        count = 1;
      }
      arr[i - 1] = isFirst ? firstVal : secVal;
      count++;
    }

    for (let i = 0; i < diff; i++) {
      arr.push(firstVal);
    }
    // console.log(arr);
    return arr;
  }

  handleCollision() {
    this.localPathIsCreated = false;
  }
}
