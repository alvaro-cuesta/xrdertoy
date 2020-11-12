import { initShaderProgram } from './shader'
import { initQuad } from './quad'
import { mat4 } from 'gl-matrix'
import { Mouse, Timing } from '../shadertoy/uniforms'

const FPS_RATE = 500

export const createDrawScene = (renderpass, forceLowEnd) => (gl) => {
  if (renderpass.length > 1) {
    throw new Error('Multipass not supported')
  }

  if (renderpass[0].inputs.length > 0) {
    throw new Error('Inputs not supported')
  }

  const shaderProgram = initShaderProgram(gl, renderpass[0].code, forceLowEnd)
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

        quad.draw()
      }
    }

    timing.end()
  }
}
