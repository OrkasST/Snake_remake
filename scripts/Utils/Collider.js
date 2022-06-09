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
      let checked = 0;
      if (!body.collisionBody) return;
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
        } else checked++;
      });
      // bodies.forEach((collider) => {
      //   if (body === collider || !collider.collisionBody) return;
      //   // debugger;
      //   if (
      //     body.position.x + body.size.width >= collider.position.x &&
      //     body.position.x <= collider.position.x + collider.size.width &&
      //     body.position.y + body.size.height >= collider.position.y &&
      //     body.position.y <= collider.position.y + collider.size.height
      //   ) {
      //     // this._checkCorner(body, collider);
      //   } else checked++;
      //   // debugger;
      // });
      if (checked === this.staticObjects.length) {
        //+ bodies.length - 1) {
        body.movement.disabledX = "none";
        body.movement.disabledY = "none";
      } else {
        console.log("Nope!");
      }
    });
  }

  _checkCorner(body, object) {
    if (body.position.y + body.size.height > object.y2) {
      body.movement.disabledY = "up";
      body.position.y += 4;
      body.status = "standing";
    } else if (body.position.y < object.y1) {
      body.movement.disabledY = "down";
      body.position.y -= 4;
      body.status = "standing";
    }
    if (body.position.x + body.size.width > object.x2) {
      body.movement.disabledX = "left";
      body.position.x += 4;
      body.status = "standing";
    } else if (body.position.x < object.x1) {
      body.movement.disabledX = "right";
      body.position.x -= 4;
      body.status = "standing";
    }
    //this._checkForDestruction(body);
    body.onCollision(object);
  }

  _teleport(body, enterPortal, staticObjects) {
    let exitPortal = staticObjects.find(
      (object) => object.type === "portal" && object.id !== enterPortal.id
    );
    body.position.x = exitPortal.x1 - body.size.width - 4;
    body.position.y = exitPortal.y1 + (body.position.y - enterPortal.y1);
  }

  _checkForDestruction(firstObject, secondObject) {
    if (firstObject.type === "destructive") firstObject.destroy();
  }
}
