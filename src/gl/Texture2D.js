export default class Texture2D {
  samplerType = 'sampler2D'
  target = WebGL2RenderingContext.TEXTURE_2D
  resolution = [0, 0, 0]
  time = 0
  loaded = false

  constructor(gl, { sampler: { filter, wrap, vflip, srgb, internal } }) {
    if (filter !== 'nearest' && filter !== 'linear' && filter !== 'mipmap') {
      throw new Error(`Unexpected filter "${filter}" for Texture2D`)
    }

    if (wrap !== 'clamp' && wrap !== 'repeat') {
      throw new Error(`Unexpected wrap "${wrap}" for Texture2D`)
    }

    if (vflip !== 'true' && vflip !== 'false') {
      throw new Error(`Unexpected vflip "${vflip}" for Texture2D`)
    }

    if (srgb !== 'false') {
      throw new Error(`Unexpected srgb "${srgb}" for Texture2D`)
    }

    if (internal !== 'byte') {
      throw new Error(`Unexpected internal "${internal}" for Texture2D`)
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
    this.wrap =
      wrap === 'clamp' ? gl.CLAMP_TO_EDGE : wrap === 'repeat' ? gl.REPEAT : null
    this.vflip = vflip === 'true'
    /*
    NOT NEEDED -- Seem to be constant
    this.srgb = srgb
    this.internal = internal
    */

    gl.bindTexture(gl.TEXTURE_2D, this.id)

    // Placeholder magenta image
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255]),
    )
  }

  initFrom(input) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, this.id)

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.vflip)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, input)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrap)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter)

    if (this.minFilter === gl.LINEAR_MIPMAP_LINEAR) {
      gl.generateMipmap(gl.TEXTURE_2D)
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  updateFrom(input) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, this.id)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.vflip)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, input)

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  update() {}
}
