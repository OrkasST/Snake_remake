import { GameObject } from "./GameObject.js";

export class SnakeBody {
  constructor({ head = {}, bodyLength = 10, name = "", imageName = "snake" }) {
    this.type = "snake";
    this.head = head;
    this.bodyLength = bodyLength;
    this.name = name;
    this.texture = { name: "snake", img: null };
    this.directionCodes = {
      left: 0,
      right: 1,
      up: 2,
      down: 3,
    };
    this.xCodes = {
      up: 1,
      down: 2,
    };
    this.yCodes = {
      left: 1,
      right: 2,
    };
    this.isInJerk = false;
    this.body = new Array(bodyLength).fill(null).map(
      (el, i, body) =>
        new GameObject({
          name: name,
          type: "snake-body-part",
          position: {
            x: head.position.x + head.movement.speed * i,
            y: head.position.y,
          },
          size: {
            width: head.size.width,
            height: head.size.height,
          },
          movement: {
            direction: head.movement.direction,
            previousDirection: head.movement.direction,
          },
          color: i === 0 ? "#FF0000" : "#000000",
          isDisplayed:
            i === 0
              ? true
              : i === body.length - 1
              ? true
              : i % 16 === 0 && body.length - 1 - i >= 16
              ? true
              : false,
          texture: {
            name: "image",
            img: null,
            sx: 0,
            sy:
              this.directionCodes[head.movement.direction] *
                (head.size.height + 4) +
              2 +
              (i === 0 ? 0 : i === body.length - 1 ? 288 : 144),
            // width:
            //   i === 0
            //     ? head.size.width
            //     : i === body.length - 1
            //     ? head.size.width
            //     : head.movement.speed + 1,
          },
        })
    );
  }

  update() {
    if (this.isInJerk) this._jerk();
    if (
      this.body[0].position.x === this.head.position.x &&
      this.body[0].position.y === this.head.position.y
    )
      return;
    this.body[0].color = "#000000";
    this.body.unshift(
      new GameObject({
        name: this.name,
        type: "snake-body-part",
        position: {
          x: this.head.position.x,
          y: this.head.position.y,
        },
        size: {
          width: this.head.size.width,
          height: this.head.size.height,
        },
        texture: {
          img: this.texture.img,
          sx:
            (this.head.movement.direction === this.body[0].movement.direction
              ? 0
              : this.head.movement.direction === "left"
              ? this.xCodes[this.body[0].movement.direction]
              : this.yCodes[this.body[0].movement.direction]) *
              (this.head.size.width + 4) +
            2,
          sy:
            this.directionCodes[this.head.movement.direction] *
              (this.head.size.height + 4) +
            2,
        },
        color: "#FF0000",
        movement: {
          direction: this.head.movement.direction,
          previousDirection: this.body[0].movement.direction,
        },
      })
    );
    this.body.pop();
    this.body.forEach((el, i) => {
      el.isDisplayed =
        i === 0
          ? true
          : i === this.body.length - 1
          ? true
          : i % 8 === 0 && this.body.length - 1 - i >= 16
          ? true
          : false;
      el.texture.sy =
        this.directionCodes[el.movement.direction] *
          (this.head.size.height + 4) +
        2 +
        (i === 0 ? 0 : i === this.body.length - 1 ? 288 : 144);
    });

    // console.log(this.body[0].movement);
  }

  imageLoaded() {
    this.body.forEach((el) => (el.texture.img = this.texture.img));
  }

  _jerk() {}
}
