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
    this.modifiers.x = window.outerWidth / 2;
    this.modifiers.y = window.outerHeight / 2;
  }
}
