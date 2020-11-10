import vertSource from './vert.js'
import makeFragSource from './frag.js'
import { compileShader, linkProgram } from '../gl-util'

export const initShaderProgram = (gl, shaderSource) => {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource)
  const frag = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    makeFragSource({
      shaderSource,
      isLowEnd: false,
    }),
  )
  const program = linkProgram(gl, [vert, frag])

  const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition')
  const uInvViewMatrix = gl.getUniformLocation(program, 'uInvViewMatrix')
  const uInvProjMatrix = gl.getUniformLocation(program, 'uInvProjMatrix')
  const uViewport = gl.getUniformLocation(program, 'uViewport')

  // ShaderToy inputs
  const iResolution = gl.getUniformLocation(program, 'iResolution')
  const iTime = gl.getUniformLocation(program, 'iTime')
  const iMouse = gl.getUniformLocation(program, 'iMouse')
  const iDate = gl.getUniformLocation(program, 'iDate')
  const iFrame = gl.getUniformLocation(program, 'iFrame')
  const iTimeDelta = gl.getUniformLocation(program, 'iTimeDelta')
  const iFrameRate = gl.getUniformLocation(program, 'iFrameRate')

  return {
    program,
    aVertexPosition,
    uInvViewMatrix,
    uInvProjMatrix,
    uViewport,

    // ShaderToy inputs
    iResolution,
    iTime,
    iMouse,
    iDate,
    iFrame,
    iTimeDelta,
    iFrameRate,
  }
}
