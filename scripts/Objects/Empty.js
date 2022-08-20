export class Empty {
  constructor(props) {
    this.type = "empty";
    this.name = "empty";
    props.forEach((prop) => (this[prop[0]] = prop[1]));
  }
}
