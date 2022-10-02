import { Controller } from "./Controller.js";
import { GameObject } from "./Objects/GameObject.js";
import { Shot } from "./Objects/Shot.js";
import { Game_Part_001 } from "./Scenes/Game_Part_01.js";
import { Loading } from "./Scenes/Loading.js";
import { Scene } from "./Scenes/Scene.js";
import { Video_001 } from "./Scenes/Video_001.js";
import { Screen } from "./Screen.js";
import { Collider } from "./Utils/Collider.js";
import { Menu } from "./Utils/Menu.js";

export class Game {
  constructor({ screen = null, data = [] }) {
    this.screen = screen || new Screen({});
    this.data = data;
    this.controller = new Controller([
      { type: "keydown", code: "KeyM", action: "stop_player" },
      { type: "keydown", code: "KeyW", action: "move_player_up" },
      { type: "keydown", code: "KeyS", action: "move_player_down" },
      { type: "keydown", code: "KeyA", action: "move_player_left" },
      { type: "keydown", code: "KeyD", action: "move_player_right" },
      { type: "keydown", code: "ShiftLeft", action: "run_start" },

      // { type: "keyup", code: "KeyM", action: "stop_player" },
      // { type: "keyup", code: "KeyW", action: "stop_player" },
      // { type: "keyup", code: "KeyS", action: "stop_player" },
      // { type: "keyup", code: "KeyA", action: "stop_player" },
      // { type: "keyup", code: "KeyD", action: "stop_player" },
      { type: "keyup", code: "ShiftLeft", action: "run_stop" },

      { type: "keydown", code: "KeyQ", action: "create_magic_ball" },
      { type: "keyup", code: "KeyQ", action: "release_magic_ball" },

      { type: "keydown", code: "KeyE", action: "create_fast_magic_ball" },
      { type: "keyup", code: "KeyE", action: "release_fast_magic_ball" },

      { type: "keydown", code: "KeyR", action: "create_fire_ball" },
      { type: "keyup", code: "KeyR", action: "release_fire_ball" },

      { type: "keydown", code: "KeyI", action: "upgrade_menu" },
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
    this.menu = new Menu({});
    this.controller.getButtons(this.menu.buttons);
    this.dataLogged = false;
  }

  init() {
    this.screen.setSize({
      width: window.outerWidth,
      height: window.outerHeight,
    });
    this.screen.camera.setModifiers();
    this.controller.addListener();
    this.collider = new Collider();
    this.getScenefromStorage();
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
      // if (this.screen.width < 10000) {
      //   data.forEach((el) => {
      //     if (Array.isArray(el)) {
      //       return; //el.forEach((item) => item.setScale(0.5));
      //     }
      //     if (!el.isScaled) el.setScale(0.5);
      //     // console.group(el.name);
      //     // console.log("width: " + el.size.width);
      //     // console.log("texture width: " + el.texture.width);
      //     // console.groupEnd();
      //   });
      // }
      this.menu.getParams(this.player.status, [
        this.player.spellList.magic_ball,
        this.player.spellList.fast_magic_ball,
      ]);
      if (this.player.status.currentHP <= 0) {
        this.player.death();
        this.save(this.data);
      }

      this.collider.checkCollisions(data);
      let actionList = this.controller.getActionList();
      if (actionList.length > 0) this.doActions(actionList, time);
      data.forEach((el) => {
        if (el.name === "music_background" && !el.isStarted) el.play();
        if (
          !Array.isArray(el) &&
          // el.type !== "map_image" &&
          !el.objectCreatingFunctionIsSet
        ) {
          el.setObjectCreatingFunction(this.createObject, this);
        }
        if (el.isInOrderToDestroy) return;
        if (Array.isArray(el)) {
          // this[el[0].name].update(this.player);
          return;
        }
        if (el.type === "spawner") el.spawn({ time });
        el.update?.(time);
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

      if (this.player.bodyObject.isRunning) {
        this.player.status.currentStamina--;
        if (this.player.status.currentStamina < 1) this.player.runStop();
      } else if (
        this.player.status.currentStamina < this.player.status.maxStamina &&
        time - this.player.lastStaminaRecoveryTime >=
          this.player.staminaRecoverySpeed
      ) {
        this.player.lastStaminaRecoveryTime = time;
        this.player.status.currentStamina++;
      }
      let souls = [];
      for (let j = 0; j < data.length; j++) {
        if (!Array.isArray(data[j]) && data[j].isInOrderToDestroy) {
          // if (data[j].isAlive)
          // this.soulSpawner.spawn(data[j].position, data[j].status.maxHP);
          // debugger;
          if (
            data[j].type !== "soul" &&
            data[j].killedBy === "shot" &&
            data[j].isAlive
          )
            souls.push([data[j].position, data[j].status.maxHP]);
          if (data[j].type === "apple") this.appleIsEaten.play();

          data.splice(j, 1);
        }
      }
      souls.forEach((soul) =>
        this.soulSpawner.spawn({
          position: soul[0],
          points: soul[1],
          id: this.player.id,
        })
      );
      this.screen.camera.setFocus(this.player);
    }
    this.updateScene(time);
  }

  render(data) {
    if (window.outerWidth < 1000)
      screen.orientation.type !== "portrait-primary"
        ? this.screen.setSize({
            width: window.outerWidth,
            height: window.outerHeight,
          })
        : this.screen.setSize({
            width: window.outerHeight,
            height: window.outerWidth,
          });
    this.screen.clear();
    if (this.currentScene.type === "game") {
      data.forEach((el) => {
        if (Array.isArray(el)) {
          this.screen.drawArray(el);
          return;
        }
        if (el.type === "shot" && el.name.split("_")[0] === "fire") {
          this.screen.drawArray(el.particles);
          return;
        }
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
    if (obj.type === "player") console.log(obj.body.length);
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
          // debugger;
          if (this[el[1]].movement.disabled === "all") return;
          this[el[1]].movement.status = "moving";
          this[el[1]].movement.direction = el[2];
          this.log = true;
          break;
        case "stop":
          this.player.movement.status = "standing";
          break;
        case "create":
          if (!this.player.isCreatingMagic)
            this.player.createMagic(time, el.splice(1).join("_"));
          break;
        case "release":
          if (this.player.isCreatingMagic) this.player.releaseMagic(time);
          break;
        case "upgrade":
          this.menu.toggleMenu();
          break;
        case "button":
          this.player.modifyParameter(el[1], el[2]);
          this.save(this.data);
          break;
        case "run":
          el[1] === "start" ? this.player.runStart() : this.player.runStop();
          break;
        case "close":
          this.save(this.data);
        default:
          break;
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
    // console.log("Started preparing scene...");
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
        // this.spawners = [];
        this.media = this.currentScene.loadedMedia;
        // console.log(this.media);
        this.screen.UI.img = this.media.UI;
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
            case "empty":
              break;
            // case "spawner":
            //   this.spawners.push(objects[name]);
            //   objects[name].setIndex(this.spawners.length - 1);
            //   this.data = [this.data[0], objects[name], ...this.data.splice(1)];
            default:
              this.data = [this.data[0], objects[name], ...this.data.splice(1)];
              break;
          }
        }
        if (this.map) this.collider.setStaticObjects(this.map.hitboxes);
        if (this.sceneList[this.nextScene].type === "game") {
          this.data.forEach((el) => {
            if (
              !Array.isArray(el) &&
              // el.type !== "map_image" &&
              !el.objectCreatingFunctionIsSet
            ) {
              el.setObjectCreatingFunction(this.createObject, this);
            }
          });
          this.checkForSavedProgress(time);
        }
        this.sceneList[this.nextScene].isPrepared = true;
      }
      this.sceneChange(time);
    }
  }

  createObject(object) {
    if (object.type === "shot")
      console.log(
        `magic position in Game.js: ${object.position.x}, ${object.position.y}`
      );
    if (object) this.data = [this.data[0], object, ...this.data.slice(1)];
    return object;
  }

  save(data) {
    localStorage.clear();
    localStorage.setItem("currentScene", this.currentScene.name);
    let save = data.map((el) => {
      if (Array.isArray(el))
        return el.map((ob) => {
          return {
            ...ob,
            texture: {
              ...ob.texture,
              img: null,
            },
          };
        });
      return el.texture
        ? {
            ...el,
            texture: {
              ...el.texture,
              img: null,
            },
          }
        : el;
    });
    save = JSON.stringify(data);
    localStorage.setItem("save", save);
    // console.log("Data saved");
    this.dataLogged = true;
  }

  getScenefromStorage() {
    let scene = localStorage.getItem("currentScene");
    // console.log(scene);
    if (scene) this.nextScene = scene;
  }

  checkForSavedProgress(time) {
    // try {
    let save = localStorage.getItem("save");
    if (save) {
      save = JSON.parse(save);
      // console.log(save);
      save.forEach((el) => {
        if (Array.isArray(el)) return;
        let id = el?.id?.split("_");
        if (!id) debugger;
        if (id[0] === "spawner" || el.type === "soul") {
          // console.log(el);
          // debugger;
          this[el.type === "soul" ? "soulSpawner" : id[1]].spawn({
            time,
            position: el.position,
            system: true,
            params: el.AI,
            points: el.status.maxHP,
            id: el.id,
          });
        }
        if (el.type === "player") {
          this.player.status = el.status;
          this.player.movement = el.movement;
          this.player.spellList = el.spellList;
          this.player.bodyObject.bodyLength = el.bodyObject.bodyLength;
          // this.player.bodyLength = el.bodyLenght;
          this.player.setLength(el.body.length);
          this.player.moveTo(el.position);
        }
      });
    }
    // } catch (e) {
    // console.log(e);
    // }
  }
}
