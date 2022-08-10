import { Controller } from "./Controller.js";
import { GameObject } from "./Objects/GameObject.js";
import { Shot } from "./Objects/Shot.js";
import { Game_Part_001 } from "./Scenes/Game_Part_01.js";
import { Loading } from "./Scenes/Loading.js";
import { Scene } from "./Scenes/Scene.js";
import { Video_001 } from "./Scenes/Video_001.js";
import { Screen } from "./Screen.js";
import { Collider } from "./Utils/Collider.js";

export class Game {
  constructor({ screen = null, data = [] }) {
    this.screen = screen || new Screen({});
    this.data = data;
    this.controller = new Controller([
      { code: "KeyM", action: "stop_player" },
      { code: "KeyW", action: "move_player_up" },
      { code: "KeyS", action: "move_player_down" },
      { code: "KeyA", action: "move_player_left" },
      { code: "KeyD", action: "move_player_right" },
      { code: "KeyQ", action: "create_object_moving" },
    ]);
    this.dirnCodes = {
      right: 0,
      left: 1,
      up: 2,
      down: 3,
    };
    // this.catchTime = false;
    // this.lastTime = 0;
    this.currentScene = null;
    this.nextScene = "Part_001";
    this.sceneList = {
      Video_001: new Scene(new Video_001()),
      Part_001: new Scene(new Game_Part_001()),
    };
  }

  init() {
    this.screen.setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.screen.camera.setModifiers();
    this.controller.addListener();
    this.collider = new Collider();
    this.game(this.data);
  }

  game(data, time) {
    this.update(this.data, time);
    this.render(this.data, time);

    requestAnimationFrame((time) => {
      this.game(this.data, time);
    });
  }

  update(data, time) {
    if (!this.currentScene || this.currentScene.isFinished) {
      if (!this.currentScene?.inProcess) {
        this.prepareScene(time);
        return;
      }
    }
    if (this.currentScene.type === "game") {
      if (this.player.status.currentHP <= 0) this.player.death();
      this.collider.checkCollisions(data);

      let actionList = this.controller.getActionList();
      if (actionList.length > 0) this.doActions(actionList, time);
      data.forEach((el) => {
        if (
          !Array.isArray(el) &&
          // el.type !== "map_image" &&
          !el.objectCreatingFunctionIsSet
        ) {
          el.setObjectCreatingFunction(this.createObject, this);
        }
        if (el.isInOrderToDestroy) return;
        if (Array.isArray(el)) {
          this[el[0].name].update();
          return;
        }
        if (el.type === "spawner") el.spawn(time);
        el.update?.();
        if (el.movement.disabled === "all") return;
        switch (el.movement.status) {
          case "standing":
            break;
          case "moving":
            this.move(el);
            break;
          default:
            break;
        }
      });
      // debugger;
      for (let j = 0; j < data.length; j++) {
        if (!Array.isArray(data[j]) && data[j].isInOrderToDestroy)
          data.splice(j, 1);
      }
      this.screen.camera.setFocus(this.player);
    }
    this.updateScene(time);
  }

  render(data) {
    this.screen.clear();
    if (this.currentScene.type === "game") {
      data.forEach((el) => {
        if (Array.isArray(el)) this.screen.drawArray(el);
        this.screen.drawObject(el);
      });
      this.screen.drawUI(this.player.status);
    } else if (this.currentScene.type === "video") {
      data.forEach((el) => {
        if (!el.isAppended) el.append();
        el.texture.img.play();
        // this.screen.drawObject(el);
      });
    } else {
      this.screen.drawScene(this.currentScene);
    }
  }

  move(obj) {
    switch (obj.movement.direction) {
      case "up":
        if (obj.movement.disabledY !== "up")
          obj.position.y -= obj.movement.speed;
        break;
      case "down":
        if (obj.movement.disabledY !== "down")
          obj.position.y += obj.movement.speed;
        break;
      case "left":
        if (obj.movement.disabledX !== "left")
          obj.position.x -= obj.movement.speed;
        break;
      case "right":
        if (obj.movement.disabledX !== "right")
          obj.position.x += obj.movement.speed;
        break;
    }
  }

  doActions(list, time) {
    list.forEach((el) => {
      el = el.split("_");
      switch (el[0]) {
        case "move":
          if (this[el[1]].movement.disabled === "all") return;
          // console.log(this[el[1]].movement);
          this[el[1]].movement.status = "moving";
          this[el[1]].movement.direction = el[2];
          this.log = true;
          break;
        case "create":
          this.player.createMagic(time);
      }
    });
    this.controller.clearActionList();
  }

  sceneChange(time) {
    this.currentScene = this.sceneList[this.nextScene];
    this.nextScene = this.currentScene.nextScene;
    this.currentScene.setStartTime(time);
  }

  prepareScene(time) {
    console.log("Started preparing scene...");
    this.currentScene = new Loading({
      loadList: this.sceneList[this.nextScene].textures,
    });
    this.currentScene.setStartTime(time);
    this.updateScene(time);
  }

  updateScene(time) {
    this.currentScene.update(time);
    if (this.currentScene.type !== "loading") return;
    if (!this.currentScene.inProcess) {
      this.currentScene.startProcess(this.sceneList[this.nextScene]);
    } else if (this.currentScene?.isFinished) {
      let objects = this.sceneList[this.nextScene].objects;
      if (this.currentScene.type === "loading") {
        this.data = [];
        for (let name in objects) {
          this[name] = objects[name];
          switch (objects[name].type) {
            case "map":
              this.data.unshift(objects[name].image);
              break;
            case "snake":
              this.data.push(objects[name].body);
              break;
            case "video-player":
              this.data.push(objects[name]);
              break;
            default:
              this.data = [this.data[0], objects[name], ...this.data.splice(1)];
              break;
          }
        }
        if (this.map) this.collider.setStaticObjects(this.map.hitboxes);
        this.sceneList[this.nextScene].isPrepared = true;
      }
      this.sceneChange(time);
    }
  }

  createObject(object) {
    if (object) this.data = [this.data[0], object, ...this.data.slice(1)];
  }
}
