export class Camera {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.modifiers = {
      x: 0,
      y: 0,
    };
  }

  setFocus(obj) {
    this.position.x = -obj.position.x + this.modifiers.x;
    this.position.y = -obj.position.y + this.modifiers.y;
  }

  setModifiers(x, y) {
    this.modifiers.x =
      screen.orientation.angle !== 90
        ? window.outerWidth / 2
        : window.outerHeight / 2;
    this.modifiers.y =
      screen.orientation.angle !== 90
        ? window.outerHeight / 2
        : window.outerWidth / 2;
  }
}
