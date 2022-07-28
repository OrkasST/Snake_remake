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
          body.position.x + body.size.width >= object.x1 &&
          body.position.x <= object.x2 &&
          body.position.y + body.size.height >= object.y1 &&
          body.position.y <= object.y2
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
      body.position.x + body.size.width >= collider.position.x &&
      body.position.x <= collider.position.x + collider.size.width &&
      body.position.y + body.size.height >= collider.position.y &&
      body.position.y <= collider.position.y + collider.size.height
    );
  }

  _checkCorner(body, object) {
    // if ((body.type === "shot" || object.type === "shot") && (body.type === "shot" || object.type === "shot")) return;
    if (
      body.position.y + body.size.height > object.y2 ||
      body.position.y + body.size.height >
        object.position?.y + object.size?.height
    ) {
      body.movement.disabledY = "up";
      body.position.y += 4;
      body.movement.status = "standing";
    } else if (
      body.position.y < object.y1 ||
      body.position.y < object.position?.y
    ) {
      body.movement.disabledY = "down";
      body.position.y -= 4;
      body.movement.status = "standing";
    }
    if (
      body.position.x + body.size.width > object.x2 ||
      body.position.x + body.size.width >
        object.position?.x + object.size?.width
    ) {
      body.movement.disabledX = "left";
      body.position.x += 4;
      body.movement.status = "standing";
    } else if (
      body.position.x < object.x1 ||
      body.position.x < object.position?.x
    ) {
      body.movement.disabledX = "right";
      body.position.x -= 4;
      body.movement.status = "standing";
    }
    body.onCollision(
      object.isDamaging
        ? object.type === "shot"
          ? object.status?.magicAttack
          : object.status?.physicalAttack
        : null
    );
  }

  _teleport(body, enterPortal, staticObjects) {
    let exitPortal = staticObjects.find(
      (object) => object.type === "portal" && object.id !== enterPortal.id
    );
    body.position.x = exitPortal.x1 - body.size.width - 4;
    body.position.y = exitPortal.y1 + (body.position.y - enterPortal.y1);
  }
}
