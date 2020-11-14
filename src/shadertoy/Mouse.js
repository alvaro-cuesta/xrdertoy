export default class Mouse {
  constructor() {
    this._x = 0
    this._y = 0
    this._z = -0
    this._w = -0
  }

  click(x, y) {
    this._x = x
    this._y = y
    this._z = x
    this._w = y
  }

  move(x, y) {
    this._x = x
    this._y = y
  }

  release(x, y) {
    this._x = x
    this._y = y
    this._z = -this.z
    this._w = -this.w
  }

  get iMouse() {
    return [this._x, this._y, this._z, this._w]
  }
}
