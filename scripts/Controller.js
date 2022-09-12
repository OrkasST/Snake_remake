export class Controller {
  constructor(codeList) {
    this.codeList = codeList;
    this.actionList = [];
  }

  addListener() {
    document.addEventListener("keydown", (e) => {
      this.modifyActionList(e);
    });
    document.addEventListener("keyup", (e) => {
      this.modifyActionList(e);
    });
    document.addEventListener("click", (e) => {
      this.modifyActionList(e);
    });
    document.addEventListener("touchstart", (e) => {
      if (e.target.localName === "button") e.target.classList.add("_touched");
      this.modifyActionList(e);
    });
    document.addEventListener("touchend", (e) => {
      if (e.target.localName === "button")
        e.target.classList.remove("_touched");
      this.modifyActionList(e);
    });
  }

  modifyActionList(e) {
    if (e.type === "click" && e.path[1].className === "modifier") {
      this.actionList.push(
        `button_${e.path[1].innerText.split(":")[0].toLowerCase()}_${
          e.target.innerText
        }`
      );
      return;
    } else if (e.type === "click") {
      switch (e.target.id) {
        case "up":
          this.actionList.push("move_player_up");
          break;
        case "down":
          this.actionList.push("move_player_down");
          break;
        case "left":
          this.actionList.push("move_player_left");
          break;
        case "right":
          this.actionList.push("move_player_right");
          break;
        case "toggle_menu":
          this.actionList.push("upgrade_menu");
          break;
        case "close":
          this.actionList.push("close");
          break;
        // case "magic_1":
        //   this.actionList.push("create_magic_ball");
        //   break;
        // case "magic_2":
        //   this.actionList.push("create_fast_magic_ball");
        //   break;
        default:
          break;
      }
    } else if (e.type === "touchstart") {
      if (e.target.id === "run") this.actionList.push("run_start");
      if (e.target.id === "magic_1") this.actionList.push("create_magic_ball");
      if (e.target.id === "magic_2")
        this.actionList.push("create_fast_magic_ball");
    } else if (e.type === "touchend") {
      if (e.target.id === "run") this.actionList.push("run_stop");
      if (e.target.id === "magic_1") this.actionList.push("release_magic_ball");
      if (e.target.id === "magic_2")
        this.actionList.push("release_fast_magic_ball");
    }
    this.codeList.forEach((el) => {
      if (el.code == e.code && el.type == e.type) {
        this.actionList.push(el.action);
      }
    });
  }

  getActionList() {
    return this.actionList;
  }

  clearActionList() {
    this.actionList = [];
  }

  getButtons(buttons) {
    this.buttons = buttons;
  }
}
