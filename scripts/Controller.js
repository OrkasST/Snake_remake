export class Controller {
  constructor(codeList) {
    this.codeList = codeList;
    this.actionList = [];
  }

  addListener() {
    document.addEventListener("keydown", (e) => {
      console.log(e.code + " down");
      this.modifyActionList(e);
    });
    document.addEventListener("keyup", (e) => {
      console.log(e.code + " up");
      this.modifyActionList(e);
    });
    document.addEventListener("click", (e) => {
      // console.log(e);
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
        case "run":
          this.actionList.push("run_start");
          break;
        case "menu":
          this.actionList.push("upgrade_menu");
          break;
        default:
          break;
      }
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
