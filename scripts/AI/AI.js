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
  }

  setPath(path, isClosed) {
    this.isPathClosed = isClosed;
    this.path = path;
    // console.log("Path set");
  }

  setStep(step) {
    this.step = step;
  }
  setStepsCount(count) {
    this.stepsCount = count;
  }
  setLocalPath(path, isCreated) {
    this._localPath = path;
    this.localPathIsCreated = isCreated;
  }
  setLocalStep(step) {
    this._localStep = step;
  }

  followPath(me) {
    if (this.isPathClosed) return;
    if (this.step >= this.path.length && !this.isPathClosed) {
      this.isPathClosed = true;
      // console.log("~~~~PathClosed~~~~");
      return;
    }
    me.movement.status = "moving";
    if (!this.localPathIsCreated) this._cteatePathTo(me, this.path[this.step]);
    if (this._isPointReached(me, this.path[this.step])) {
      this.step++;
      // console.log("step: ", this.step);
      return;
    }
    if (!this._localPath[this._localStep]) {
      // console.group("Path error");
      // console.log("point: ", this.path[this.step]);
      // console.log("me: ", this.me.position);
      // console.log("size: ", this.me.size);
      // console.groupEnd();
      // debugger;
    }
    me.movement.direction = this._localPath[this._localStep];
    this._localStep++;
  }

  prepare(me, destination) {
    me.movement.status = "moving";
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

  _isPointReached(me, point = { x: 0, y: 0, i: 0 }, i = 0) {
    if (
      point.x >= me.position.x &&
      point.x <= me.position.x + me.size.width &&
      point.y >= me.position.y &&
      point.y <= me.position.y + me.size.height
    ) {
      // console.log(`****Point ${i} arrived`);
      this.localPathIsCreated = false;
      return true;
    } else return false;
  }

  _cteatePathTo(me, point = { x: 0, y: 0 }) {
    this._localStep = 0;
    let distX = point.x - me.position.x, // - this.me.size.width / 2,
      distY = point.y - me.position.y; // - this.me.size.height / 2;

    let xAxis = distX > 0 ? "right" : "left",
      yAxis = distY > 0 ? "down" : "up";

    let stepsX = Math.abs(distX / me.movement.speed),
      stepsY = Math.abs(distY / me.movement.speed);

    stepsX = distX > 0 ? Math.floor(stepsX) : Math.ceil(stepsX);
    stepsY = distY > 0 ? Math.floor(stepsY) : Math.ceil(stepsY);

    // console.group("Path params");
    // console.log("speed: ", this.me.movement.speed);
    // console.log("me: ", this.me.position);
    // console.log("distX: ", distX);
    // console.log("distY: ", distY);
    // console.log("stepsX: ", stepsX);
    // console.log("stepsY: ", stepsY);
    // console.groupEnd();

    this._localPath =
      stepsX > stepsY
        ? this._fillArray(stepsX, stepsY, xAxis, yAxis)
        : this._fillArray(stepsY, stepsX, yAxis, xAxis);

    this.localPathIsCreated = true;
    // console.log(this._localPath);
  }

  _fillArray(a, b, firstVal, secVal) {
    let diff = a - b;
    let arr = [];
    let isFirst = true;
    let count = 1;
    let step = b;
    for (let i = 1; i <= b * 2; i++) {
      if (count > (step > 20 ? 20 : step)) {
        isFirst = !isFirst;
        count = 1;
        if (isFirst) step = step - (step > 20 ? 20 : 0);
      }
      arr[i - 1] = isFirst ? firstVal : secVal;
      count++;
    }

    for (let i = 0; i < diff; i++) {
      arr.push(firstVal);
    }
    return arr;
  }

  handleCollision() {
    this.localPathIsCreated = false;
  }
}
