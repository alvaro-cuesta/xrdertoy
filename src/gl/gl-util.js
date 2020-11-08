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
