import { initShaderProgram } from './shader'
import { initQuad } from './quad'
import { mat4 } from 'gl-matrix'
import { Mouse, Timing } from '../shadertoy/uniforms'
import TextureCube from './TextureCube'
import Texture2D from './Texture2D'

const FPS_RATE = 500

export const createDrawScene = (renderpass, forceLowEnd) => (gl) => {
  if (renderpass.length > 1) {
    throw new Error('Multipass not supported')
  }

  const inputs = renderpass[0].inputs.map((input, i) => {
    if (input.ctype !== 'texture' && input.ctype !== 'cubemap') {
      throw new Error(`Unexpected ctype === ${input.ctype}`)
    }

    if (input.channel < 0 || input.channel > 3) {
      throw new Error(`Unexpected channel === ${input.channel}`)
    }

    const usedChannels = renderpass[0].inputs
      .slice(0, i)
      .map((input) => input.channel)

    if (usedChannels.includes(input.channel)) {
      throw new Error(`Repeated channel ${input.channel} in input ${i}`)
    }

    return {
      ...input,
      type:
        input.ctype === 'texture'
          ? 'texture'
          : input.ctype === 'cubemap'
          ? 'cubemap'
          : null,
      texture:
        input.ctype === 'texture'
          ? new Texture2D(gl, input)
          : input.ctype === 'cubemap'
          ? new TextureCube(gl, input)
          : null,
    }
  })

  const code = renderpass[0].code

  const shaderProgram = initShaderProgram(gl, inputs, code, forceLowEnd)
  const quad = initQuad(gl)

  const timing = new Timing(FPS_RATE)
  const mouse = new Mouse()

  return (time, frame, refSpace) => {
    timing.start()

    if (timing.iFrame % 60 === 0) {
      console.log(time, frame, refSpace)
    }

    const pose = frame.getViewerPose(refSpace)

    if (pose) {
      const session = frame.session
      const glLayer = session.renderState.baseLayer

      gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer)

      for (let view of pose.views) {
        const viewport = glLayer.getViewport(view)

        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height)

        const invViewMatrix = view.transform.matrix
        const invProjMatrix = mat4.invert(mat4.create(), view.projectionMatrix)

        // Draw quad
        gl.useProgram(shaderProgram.program)

        quad.bind(shaderProgram.aVertexPosition)

        gl.uniformMatrix4fv(shaderProgram.uInvViewMatrix, false, invViewMatrix)
        gl.uniformMatrix4fv(shaderProgram.uInvProjMatrix, false, invProjMatrix)
        gl.uniform4fv(shaderProgram.uViewport, [
          viewport.x,
          viewport.y,
          viewport.width,
          viewport.height,
        ])

        // ShaderToy inputs
        gl.uniform3f(
          shaderProgram.iResolution,
          viewport.width,
          viewport.height,
          // Apparently z = pixel aspect ratio
          // https://twitter.com/iquilezles/status/633113177568313344
          // Always 1 on ShaderToy source
          1,
        )
        gl.uniform1f(shaderProgram.iTime, timing.iTime)
        gl.uniform4fv(shaderProgram.iMouse, mouse.iMouse)
        gl.uniform4fv(shaderProgram.iDate, timing.iDate)
        gl.uniform1i(shaderProgram.iFrame, timing.iFrame)
        gl.uniform1f(shaderProgram.iTimeDelta, timing.iTimeDelta)
        gl.uniform1f(shaderProgram.iFrameRate, timing.iFrameRate)

        const iChannelTime = [0, 0, 0, 0]
        // prettier-ignore
        const iChannelResolution = [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0,
          0, 0, 0,
        ]

        for (const input of inputs) {
          const i = input.channel

          const loaded = input.texture.loaded
          const width = input.texture.width
          const height = input.texture.height
          const depth = 0
          const channelTime = 0

          gl.activeTexture(gl[`TEXTURE${i}`])
          gl.bindTexture(
            input.ctype === 'texture'
              ? gl.TEXTURE_2D
              : input.ctype === 'cubemap'
              ? gl.TEXTURE_CUBE_MAP
              : null,
            inputs[i].texture.id,
          )
          gl.uniform1i(shaderProgram.iChannel[i], i)
          gl.uniform1i(shaderProgram.iCh[i].sampler, i)
          gl.uniform3f(shaderProgram.iCh[i].size, width, height, depth)
          gl.uniform1f(shaderProgram.iCh[i].time, channelTime)
          gl.uniform1i(shaderProgram.iCh[i].loaded, loaded ? 1 : 0)

          if (loaded) {
            iChannelTime[i] = channelTime
            iChannelResolution[3 * i + 0] = width
            iChannelResolution[3 * i + 1] = height
            iChannelResolution[3 * i + 2] = depth
          }
        }

        gl.uniform1fv(shaderProgram.iChannelTime, iChannelTime)
        gl.uniform3fv(shaderProgram.iChannelResolution, iChannelResolution)

        quad.draw()
      }
    }

    timing.end()
  }
}
