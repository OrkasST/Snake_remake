export class Controller {
  constructor(codeList) {
    this.codeList = codeList;
    this.actionList = [];
  }

  addListener() {
    document.addEventListener("keydown", (e) => {
      // console.log(e.code);
      this.createActionList(e);
    });
  }

  createActionList(e) {
    this.codeList.forEach((el) => {
      if (el.code == e.code) {
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
}
