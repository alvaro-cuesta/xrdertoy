export const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type)

  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message =
      'An error occurred compiling the shader: ' + gl.getShaderInfoLog(shader)

    gl.deleteShader(shader)

    throw new Error(message)
  }

  return shader
}

export const linkProgram = (gl, shaders) => {
  const program = gl.createProgram()

  for (const shader of shaders) {
    gl.attachShader(program, shader)
  }

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message =
      'Unable to initialize the shader program: ' +
      gl.getProgramInfoLog(program)

    gl.deleteProgram(program)

    throw new Error(message)
  }

  return program
}

export const upload2DTextureFromImage = (
  gl,
  id,
  image,
  filter,
  wrap,
  vflip,
) => {
  if (filter !== 'nearest' && filter !== 'linear' && filter !== 'mipmap') {
    throw new Error(`Unknown filter "${filter}"`)
  }

  if (wrap !== 'clamp' && wrap !== 'repeat') {
    throw new Error(`Unknown wrap "${wrap}"`)
  }

  const glMagFilter =
    filter === 'nearest'
      ? gl.NEAREST
      : filter === 'linear'
      ? gl.LINEAR
      : filter === 'mipmap'
      ? gl.LINEAR
      : null

  const glMinFilter =
    filter === 'nearest'
      ? gl.NEAREST
      : filter === 'linear'
      ? gl.LINEAR
      : filter === 'mipmap'
      ? gl.LINEAR_MIPMAP_LINEAR
      : null

  const glWrap =
    wrap === 'clamp' ? gl.CLAMP_TO_EDGE : wrap === 'repeat' ? gl.REPEAT : null

  gl.bindTexture(gl.TEXTURE_2D, id)

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, vflip)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrap)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrap)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMagFilter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMinFilter)

  if (filter === 'mipmap') {
    gl.generateMipmap(gl.TEXTURE_2D)
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.bindTexture(gl.TEXTURE_2D, null)

}

export const create2DTextureFromInput = (
  gl,
  { src, sampler: { filter, wrap, vflip, srgb, internal } },
) => {
  if (srgb !== 'false') {
    throw new Error('Unexpected srgb !== "false"')
  }

  if (internal !== 'byte') {
    throw new Error('Unexpected internal !== "byte"')
  }

  const id = gl.createTexture()

  gl.bindTexture(gl.TEXTURE_2D, id)

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

  const info = {
    id,
    width: 0,
    height: 0,
    loaded: false,
  }

  const image = new Image()

  image.onload = function () {
    upload2DTextureFromImage(gl, id, image, filter, wrap, vflip)
    info.width = image.width
    info.height = image.height
    info.loaded = true
  }

  image.onerror = function () {
    alert('Error loading input')
  }

  // image.src = toShaderToyURL(src)
  image.src = src

  return info
}
