const POS_X_COLOR = new Uint8Array([255, 0, 255, 255])
const NEG_X_COLOR = new Uint8Array([255, 0, 0, 255])
const POS_Y_COLOR = new Uint8Array([0, 255, 0, 255])
const NEG_Y_COLOR = new Uint8Array([0, 0, 255, 255])
const POS_Z_COLOR = new Uint8Array([255, 255, 255, 255])
const NEG_Z_COLOR = new Uint8Array([255, 255, 0, 255])

const setCubeFaceColor = (gl, face, color) => {
  gl.texImage2D(face, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color)
}

const IMAGE_NUMBER_TO_ID = {
  0: 'xPos',
  1: 'xNeg',
  2: 'yPos',
  3: 'yNeg',
  4: 'zPos',
  5: 'zNeg',
}

export default class TextureCube {
  samplerType = 'samplerCube'
  target = WebGL2RenderingContext.TEXTURE_CUBE_MAP
  resolution = [0, 0, 0]
  time = 0
  loaded = false

  constructor(gl, { src, sampler: { filter, wrap, vflip, srgb, internal } }) {
    if (filter !== 'nearest' && filter !== 'linear' && filter !== 'mipmap') {
      throw new Error(`Unexpected filter "${filter}" for TextureCube`)
    }

    if (wrap !== 'clamp') {
      throw new Error(`Unexpected wrap "${wrap}" for TextureCube`)
    }

    if (vflip !== 'true' && vflip !== 'false') {
      throw new Error(`Unexpected vflip "${vflip}" for TextureCube`)
    }

    if (srgb !== 'false') {
      throw new Error(`Unexpected srgb "${srgb}" for TextureCube`)
    }

    if (internal !== 'byte') {
      throw new Error(`Unexpected internal "${internal}" for TextureCube`)
    }

    this.gl = gl
    this.id = gl.createTexture()
    this.magFilter =
      filter === 'nearest'
        ? gl.NEAREST
        : filter === 'linear'
        ? gl.LINEAR
        : filter === 'mipmap'
        ? gl.LINEAR
        : null
    this.minFilter =
      filter === 'nearest'
        ? gl.NEAREST
        : filter === 'linear'
        ? gl.LINEAR
        : filter === 'mipmap'
        ? gl.LINEAR_MIPMAP_LINEAR
        : null
    this.vflip = vflip === 'true'
    /*
    NOT NEEDED -- Seem to be constant
    this.srgb = srgb
    this.internal = internal
    */

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id)

    // Placeholder cube colors
    setCubeFaceColor(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X, POS_X_COLOR)
    setCubeFaceColor(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, NEG_X_COLOR)
    setCubeFaceColor(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, POS_Y_COLOR)
    setCubeFaceColor(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, NEG_Y_COLOR)
    setCubeFaceColor(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, POS_Z_COLOR)
    setCubeFaceColor(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, NEG_Z_COLOR)

    // Load face images
    let hasErrored = false
    let loaded = 0
    this.images = {}

    for (let i = 0; i < 6; i++) {
      const image = new Image()

      const selfI = i

      // eslint-disable-next-line no-loop-func
      image.onload = () => {
        if (hasErrored) return

        loaded++

        this.images[IMAGE_NUMBER_TO_ID[selfI]] = image

        if (loaded === 6) {
          this.initFromImages()

          const images = Object.values(this.images)

          this.resolution = [
            Math.max(...images.map((img) => img.width)),
            Math.max(...images.map((img) => img.height)),
            0,
          ]
          this.loaded = true
        }
      }

      // eslint-disable-next-line no-loop-func
      image.onerror = () => {
        if (hasErrored) return

        hasErrored = true
        image.src = ''
        alert('Error loading TextureCube input')
      }

      const lastDotIndex = src.lastIndexOf('.')
      image.src =
        i === 0
          ? src
          : `${src.slice(0, lastDotIndex)}_${i}.${src.slice(lastDotIndex + 1)}`
      // image.src = toShaderToyURL(src)
    }
  }

  initFromImages() {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.vflip)

    /*
    WHY NOT?

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
    */

    // gl.activeTexture(gl.TEXTURE0) -- WHY YES!?

    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.images.xPos,
    )
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.images.xNeg,
    )
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      !this.vflip ? this.images.yPos : this.images.yNeg,
    )
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      !this.vflip ? this.images.yNeg : this.images.yPos,
    )
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.images.zPos,
    )
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.images.zNeg,
    )

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter)

    if (this.minFilter === gl.LINEAR_MIPMAP_LINEAR) {
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
  }

  update() {}
}
