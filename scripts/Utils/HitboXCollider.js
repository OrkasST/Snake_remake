export class Collider {
  constructor() {
    this.staticObjects = [];
    this.dynamicObjects = [];
  }

  setStaticObjects(objects) {
    this.staticObjects = objects;
  }
  _setDynamicObjects(objects) {
    this.dynamicObjects = objects;
  }

  checkCollisions(bodies) {
    bodies.forEach((body) => {
      // if (Array.isArray(body)) debugger;
      //let checked = 0;
      if (!body.collisionBody) return;
      body.movement.disabledX = "none";
      body.movement.disabledY = "none";
      this.staticObjects.forEach((object) => {
        if (
          body.hitBox.x2 >= object.x1 &&
          body.hitBox.x1 <= object.x2 &&
          body.hitBox.y2 >= object.y1 &&
          body.hitBox.y1 <= object.y2
        ) {
          if (object.type === "wall") this._checkCorner(body, object);
          if (object.type === "portal")
            this._teleport(body, object, this.staticObjects);
        } // else checked++;
      });
      bodies.forEach((collider) => {
        if (body === collider || !collider.collisionBody) {
          if (
            Array.isArray(collider) &&
            body !== collider &&
            body.collisionBody &&
            body.type !== "player"
          )
            collider.forEach((part) => {
              if (part.isUnderAttack) part.isUnderAttack = false;
              if (this._isColliding(part, body)) {
                // part.isUnderAttack = true;
                this._checkCorner(part, body);
                this._checkCorner(body, part);
              }
            });
          //checked++;
          return;
        }
        if (this._isColliding(body, collider)) {
          this._checkCorner(body, collider);
          this._checkCorner(collider, body);
        } //else checked++;
      });
    });
  }

  _isColliding(body, collider) {
    return (
      body.hitBox.x2 >= collider.hitBox.x1 &&
      body.hitBox.x1 <= collider.hitBox.x2 &&
      body.hitBox.y2 >= collider.hitBox.y1 &&
      body.hitBox.y1 <= collider.hitBox.y2
    );
  }

  _checkCorner(body, object) {
    // if ((body.type === "shot" || object.type === "shot") && (body.type === "shot" || object.type === "shot")) return;
    if (body.hitBox.y2 > object.y2 || body.hitBox.y2 > object.hitBox?.y2) {
      body.movement.disabledY = "up";
      body.position.y += 4;
      body.movement.status = "standing";
    } else if (
      body.hitBox.y1 < object.y1 ||
      body.hitBox.y1 < object.hitBox?.y1
    ) {
      body.movement.disabledY = "down";
      body.position.y -= 4;
      body.movement.status = "standing";
    }
    if (body.hitBox.x2 > object.x2 || body.hitBox.x2 > object.hitBox?.x2) {
      body.movement.disabledX = "left";
      body.position.x += 4;
      body.movement.status = "standing";
    } else if (
      body.hitBox.x1 < object.x1 ||
      body.hitBox.x1 < object.hitBox?.x1
    ) {
      body.movement.disabledX = "right";
      body.position.x -= 4;
      body.movement.status = "standing";
    }
    body.onCollision(object);
  }

  _teleport(body, enterPortal, staticObjects) {
    let exitPortal = staticObjects.find(
      (object) => object.type === "portal" && object.id !== enterPortal.id
    );
    body.hitBox.x1 = exitPortal.x1 - body.size.width - 4;
    body.hitBox.y1 = exitPortal.y1 + (body.hitBox.y1 - enterPortal.y1);
  }
}
