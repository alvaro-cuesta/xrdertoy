export class Timing {
  constructor(fpsRate) {
    this.fpsRate = fpsRate
    this._initialized = false
  }

  start() {
    if (this._initialized) return

    this._lastFrameTime = this._lastFPSTime = this._start = performance.now()
    this._fps = 0
    this._totalFrames = 0
    this._fpsFrames = 0

    this._initialized = true
  }

  get iTime() {
    return (performance.now() - this._start) / 1000
  }

  get iTimeDelta() {
    return (performance.now() - this._lastFrameTime) / 1000
  }

  get iFrame() {
    return this._totalFrames
  }

  get iFrameRate() {
    return this._fps
  }

  get iDate() {
    const date = new Date()

    return [
      date.getFullYear(), // the year (four digits)
      date.getMonth(), // the month (from 0-11)
      date.getDate(), // the day of the month (from 1-31)
      date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds(),
    ]
  }

  end() {
    const now = performance.now()

    this._fpsFrames++
    this._totalFrames++

    const fpsDelta = now - this._lastFPSTime

    if (fpsDelta >= this.fpsRate) {
      this._fps = (this._fpsFrames / fpsDelta) * 1000
      this._lastFPSTime = now
      this._fpsFrames = 0
    }

    this._lastFrameTime = now
  }
}

export class Mouse {
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
