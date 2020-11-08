import vertSource from './vert.js'
import fragSource from './frag.js'
import { compileShader, linkProgram } from '../gl-util'

export const initShaderProgram = (gl) => {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource)
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource)
  const program = linkProgram(gl, [vert, frag])

  const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition')
  const uInvViewMatrix = gl.getUniformLocation(program, 'uInvViewMatrix')
  const uInvProjMatrix = gl.getUniformLocation(program, 'uInvProjMatrix')

  const iTime = gl.getUniformLocation(program, 'iTime')
  const iResolution = gl.getUniformLocation(program, 'iResolution')

  return {
    program,
    aVertexPosition,
    uInvViewMatrix,
    uInvProjMatrix,
    iTime,
    iResolution,
  }
}
