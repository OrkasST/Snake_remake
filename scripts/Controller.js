export class Controller {
  constructor(codeList) {
    this.codeList = codeList;
    this.actionList = [];
  }

  addListener() {
    document.addEventListener("keydown", (e) => {
      // console.log(e.code);
      this.modifyActionList(e);
    });
    document.addEventListener("click", (e) => {
      console.log(e);
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
    }
    this.codeList.forEach((el) => {
      if (el.code == e?.code) {
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
