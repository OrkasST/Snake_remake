import { GameObject } from "./GameObject.js";

export class SnakeBody {
  constructor({
    head = {},
    bodyLength = 10,
    name = "",
    imageName = "snake",
    id = "",
  }) {
    this.type = "snake";
    // this.head = head;
    this.bodyLength = bodyLength;
    this.name = name;
    this.id = id;
    this.texture = { name: "snake", img: null };
    this.directionCodes = {
      left: 0,
      right: 1,
      up: 2,
      down: 3,
    };
    //for fast monving
    this.isInJerk = false;
    this.isRunning = false;
    this.axis = {
      right: "y",
      left: "y",
      up: "x",
      down: "x",
    };
    this.path = [
      0.9974949866040544, 0.963558185417193, 0.8912073600614354,
      0.7833269096274835, 0.6442176872376912, 0.47942553860420317,
      0.29552020666133977, 0.09983341664682835, -0.09983341664682796,
      -0.2955202066613394, -0.47942553860420284, -0.6442176872376909,
      -0.7833269096274833, -0.8912073600614353, -0.963558185417193,
      -0.99749498660405444,
    ];
    this.count = 0;
    this.forward = true;
    this.isRenewing = false;

    this.body = new Array(bodyLength).fill(null).map(
      (el, i, body) =>
        new GameObject({
          name: name,
          type: "snake-body-part",
          id: this.id,
          position: {
            x: head.position.x + head.movement.speed * i,
            y: head.position.y,
          },
          status: head.status,
          size: {
            width: head.size.width,
            height: head.size.height,
          },
          movement: {
            direction: head.movement.direction,
            previousDirection: head.movement.direction,
          },
          color: i === 0 ? "#FF0000" : "#000000",
          // isDisplayed:
          //   i === 0
          //     ? true
          //     : i === body.length - 1
          //     ? true
          //     : i % 16 === 0 && body.length - 1 - i >= 16
          //     ? true
          //     : false,
          texture: {
            name: "image",
            img: null,
            sx: i === 0 ? 0 : i === body.length - 1 ? 72 : 36,
            sy:
              this.directionCodes[head.movement.direction] *
                (head.size.height + 4) +
              2,
            // width:
            //   i === 0
            //     ? head.size.width
            //     : i === body.length - 1
            //     ? head.size.width
            //     : head.movement.speed + 1,
          },
          isDamaging: false,
          isDestructive: true,
        })
    );
  }

  update(head) {
    // if (this.body.length < this.bodyLength) this._fillBody();
    // console.log("this.head.status.currentHP: ", this.head.status.currentHP);
    if (this.isInJerk) this._jerk();
    if (
      (this.body[0].position.x === head.position.x &&
        this.body[0].position.y === head.position.y) ||
      this.isRenewing
    )
      return;
    this.body[0].color = "#000000";
    this.renew(head);
    this._brushTextures();
    if (this.isRunning) this._run(this.axis[head.movement.direction], head);

    // console.log(this.body[0].movement);
  }

  renew(head) {
    this.body.unshift(
      new GameObject({
        name: this.name,
        type: "snake-body-part",
        id: this.id,
        position: {
          x: head.position.x,
          y: head.position.y,
        },
        size: {
          width: head.size.width,
          height: head.size.height,
        },
        status: head.status,
        texture: {
          img: this.texture.img,
          sx: 0,
          sy:
            this.directionCodes[head.movement.direction] *
              (head.size.height + 4) +
            2,
        },
        color: "#FF0000",
        movement: {
          direction: head.movement.direction,
          previousDirection: this.body[0].movement.direction,
        },
        isDamaging: false,
        isDestructive: true,
      })
    );
    this.body.pop();
  }

  imageLoaded() {
    this.body.forEach((el) => (el.texture.img = this.texture.img));
  }

  grow(ammount, head) {
    for (let i = 0; i < ammount; i++) {
      this.body.push(
        new GameObject({
          isDisplayed: true,
          texture: {
            img: this.texture.img,
            sx: 0,
            sy:
              this.directionCodes[head.movement.direction] *
                (head.size.height + 4) +
              2,
          },
          position: this.body[this.body.length - 1].position,
        })
      );
      switch (this.body[this.body.length - 2].movement.direction) {
        case "right":
          this.body[this.body.length - 1].position.x +=
            head.movement.speed * (i + 1);
          break;
        case "left":
          this.body[this.body.length - 1].position.x -=
            head.movement.speed * (i + 1);
          break;
        case "up":
          this.body[this.body.length - 1].position.y -=
            head.movement.speed * (i + 1);
          break;
        case "down":
          this.body[this.body.length - 1].position.y +=
            head.movement.speed * (i + 1);
          break;
        default:
          break;
      }
    }
    this._brushTextures();
  }

  _jerk() {}

  _run(axis, head) {
    let n = 4;
    this.body[n].position[axis] =
      head.position[axis] + 8 * this.path[this.count];

    for (let i = 1; i < n; i++) {
      this.body[i].position[axis] =
        head.position[axis] +
        ((this.body[n].position[axis] - head.position[axis]) / n) * i;
      // if (!this.body[i].position.y) debugger;
    }

    this.forward ? this.count++ : this.count--;

    if (this.count == this.path.length - 1 || this.count == 0)
      this.forward = !this.forward;
  }

  _brushTextures() {
    this.body.forEach((el, i) => {
      // el.isDisplayed =
      //   i === 0 ||
      //   (i < this.body.length - 1 &&
      //     el.movement.direction !== this.body[i + 1].movement.direction)
      //     ? true
      //     : i > 1 && i < this.body.length - 2 && this.body[i - 1].isDisplayed
      //     ? false
      //     : i === this.body.length - 1
      //     ? true
      //     : i % 16 === 0 && this.body.length - 1 - i >= 16
      //     ? true
      //     : false;
      el.texture.sx = i === 0 ? 0 : i === this.body.length - 1 ? 72 : 36;
    });
  }
}
