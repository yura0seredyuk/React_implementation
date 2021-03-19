export class Component {
  forceUpdate() {
    this._root.innerHTML = this.render();
  }

  setState(obj) {
    this.state = Object.assign({}, this.state, obj);

    this.forceUpdate();
  }
}
