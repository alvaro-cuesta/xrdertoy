import Texture2D from './Texture2D'

export default class Texture2DVideo extends Texture2D {
  constructor(gl, input) {
    super(gl, input)

    this.src = input.src

    this.video = document.createElement('video')
    this.video.autoplay = true
    this.video.muted = true
    this.video.loop = true

    let playing = false
    let timeupdate = false

    this.video.addEventListener(
      'playing',
      () => {
        playing = true
        checkReady()
      },
      true,
    )

    this.video.addEventListener(
      'timeupdate',
      () => {
        timeupdate = true
        checkReady()
      },
      true,
    )

    this.video.onerror = () => {
      alert('Error loading input')
    }

    // image.src = toShaderToyURL(src)
    this.video.src = input.src
    this.video.play()

    const checkReady = () => {
      if (playing && timeupdate) {
        this.initFrom(this.video)
        this.width = this.video.videoWidth
        this.height = this.video.videoHeight
        this.loaded = true
      }
    }
  }

  update() {
    if (this.loaded) {
      this.updateFrom(this.video)
    }
  }
}
