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

const upload2DTextureFromImage = (gl, id, image, filter, wrap, vflip) => {
  if (filter !== 'nearest' && filter !== 'linear' && filter !== 'mipmap') {
    throw new Error(`Unknown filter "${filter}" for 2d`)
  }

  if (wrap !== 'clamp' && wrap !== 'repeat') {
    throw new Error(`Unknown wrap "${wrap}" for 2d`)
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

const uploadCubeTextureFromImage = (
  gl,
  id,
  xPosImage,
  xNegImage,
  yPosImage,
  yNegImage,
  zPosImage,
  zNegImage,
  filter,
  wrap,
  vflip,
) => {
  gl.bindTexture(gl.TEXTURE_2D, id)

  if (filter !== 'nearest' && filter !== 'linear' && filter !== 'mipmap') {
    throw new Error(`Unknown filter "${filter}" for cube`)
  }

  if (wrap !== 'clamp') {
    throw new Error(`Unknown wrap "${wrap}" for cube`)
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

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, id)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, vflip)

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
    xPosImage,
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    0,
    gl.RGBA8,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    xNegImage,
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    0,
    gl.RGBA8,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    vflip ? yPosImage : yNegImage,
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    0,
    gl.RGBA8,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    vflip ? yNegImage : yPosImage,
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    0,
    gl.RGBA8,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    zPosImage,
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    0,
    gl.RGBA8,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    zNegImage,
  )

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, glMagFilter)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, glMinFilter)

  if (filter === 'mipmap') {
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
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

  image.onload = () => {
    upload2DTextureFromImage(gl, id, image, filter, wrap, vflip)
    info.width = image.width
    info.height = image.height
    info.loaded = true
  }

  image.onerror = () => {
    alert('Error loading input')
  }

  // image.src = toShaderToyURL(src)
  image.src = src

  return info
}

export const createCubeTextureFromInput = (
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

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, id)

  // Placeholder cube colors
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 0, 255, 255]),
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 0, 0, 255]),
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 255, 0, 255]),
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]),
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255]),
  )
  gl.texImage2D(
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    0,
    gl.RGBA8,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 0, 255]),
  )

  const info = {
    id,
    width: 0,
    height: 0,
    loaded: false,
  }

  let hasErrored = false
  let loaded = 0
  const images = []

  for (let i = 0; i < 6; i++) {
    const image = new Image()

    const selfI = i

    // eslint-disable-next-line no-loop-func
    image.onload = () => {
      if (hasErrored) return

      loaded++

      images[selfI] = image

      if (loaded === 6) {
        uploadCubeTextureFromImage(
          gl,
          id,
          images[0],
          images[1],
          images[2],
          images[3],
          images[4],
          images[5],
          filter,
          wrap,
          vflip,
        )
        info.width = Math.max(info.width, image.width)
        info.height = Math.max(info.height, image.height)
        info.loaded = true
      }
    }

    // eslint-disable-next-line no-loop-func
    image.onerror = () => {
      if (hasErrored) return

      hasErrored = true
      image.src = ''
      alert('Error loading input')
    }

    const lastDotIndex = src.lastIndexOf('.')
    image.src =
      i === 0
        ? src
        : `${src.slice(0, lastDotIndex)}_${i}.${src.slice(lastDotIndex + 1)}`
    // image.src = toShaderToyURL(src)
  }

  return info
}

/*

export const getLocations = (gl, program, attributeNames, uniformNames) => {
  const attributes = attributeNames
    .map((attributeName) => [
      attributeName,
      gl.getAttribLocation(program, attributeName),
    ])
    .reduce((obj, [k, v]) => {
      obj[k] = v
      return obj
    }, {})

  const uniforms = uniformNames
    .map((uniformName) => [
      uniformName,
      gl.getUniformLocation(program, uniformName),
    ])
    .reduce((obj, [k, v]) => {
      obj[k] = v
      return obj
    }, {})

  return {
    attributes,
    uniforms,
  }
}

*/
