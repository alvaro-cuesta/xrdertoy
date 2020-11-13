import Texture2D from './Texture2D'

export default class Texture2DImage extends Texture2D {
  constructor(gl, input) {
    super(gl, input)

    this.src = input.src
    this.image = new Image()

    this.image.onload = () => {
      this.initFrom(this.image)
      this.resolution = [this.image.width, this.image.height]
      this.loaded = true
    }

    this.image.onerror = () => {
      alert('Error loading input')
    }

    // image.src = toShaderToyURL(src)
    this.image.src = input.src
  }
}
