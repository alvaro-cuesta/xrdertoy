import vertSource from './vert'
import makeFragSource from './frag'
import { compileShader, linkProgram } from '../gl-util'
import { getIsLowEnd } from '../../shadertoy/misc'

export const initShaderProgram = (gl, inputs, shaderSource, forceLowEnd) => {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource)
  const frag = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    makeFragSource({
      shaderSource,
      isLowEnd: forceLowEnd || getIsLowEnd(),
      isBuffer: false,
      inputs,
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
  const iChannelTime = gl.getUniformLocation(program, 'iChannelTime')
  const iMouse = gl.getUniformLocation(program, 'iMouse')
  const iDate = gl.getUniformLocation(program, 'iDate')
  const iSampleRate = gl.getUniformLocation(program, 'iSampleRate')
  const iChannelResolution = gl.getUniformLocation(
    program,
    'iChannelResolution',
  )
  const iFrame = gl.getUniformLocation(program, 'iFrame')
  const iTimeDelta = gl.getUniformLocation(program, 'iTimeDelta')
  const iFrameRate = gl.getUniformLocation(program, 'iFrameRate')

  const iChannel = []
  const iCh = []

  for (const input of inputs) {
    const i = input.channel
    iChannel[i] = gl.getUniformLocation(program, `iChannel${i}`)
    iCh[i] = {
      sampler: gl.getUniformLocation(program, `iCh${i}.size`),
      size: gl.getUniformLocation(program, `iCh${i}.size`),
      time: gl.getUniformLocation(program, `iCh${i}.time`),
      loaded: gl.getUniformLocation(program, `iCh${i}.loaded`),
    }
  }

  return {
    program,

    aVertexPosition,

    uInvViewMatrix,
    uInvProjMatrix,
    uViewport,

    // ShaderToy inputs
    iResolution,
    iTime,
    iChannelTime,
    iMouse,
    iDate,
    iSampleRate,
    iChannelResolution,
    iFrame,
    iTimeDelta,
    iFrameRate,
    iChannel,
    iCh,
  }
}
