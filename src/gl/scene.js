import { initShaderProgram } from './shader'
import { initQuad } from './quad'
import { mat4 } from 'gl-matrix'

export const createDrawScene = (renderpass) => (gl) => {
  if (renderpass.length > 1) {
    throw new Error('Multipass not supported')
  }

  if (renderpass[0].inputs.length > 0) {
    throw new Error('Inputs not supported')
  }

  const shaderProgram = initShaderProgram(gl, renderpass[0].code)
  const quad = initQuad(gl)

  let i = 0

  const start = +new Date() / 1000

  return (time, frame, refSpace) => {
    if (i === 0) {
      console.log(time, frame, refSpace)
    }

    i++

    const session = frame.session

    const pose = frame.getViewerPose(refSpace)

    const glLayer = session.renderState.baseLayer

    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer)

    if (!pose) {
      return
    }

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

      gl.uniform3f(
        shaderProgram.iResolution,
        viewport.width,
        viewport.height,
        // Apparently z = pixel aspect ratio
        // https://twitter.com/iquilezles/status/633113177568313344
        // Always 1 on ShaderToy source
        1,
      )
      gl.uniform1f(shaderProgram.iTime, +new Date() / 1000 - start)

      quad.draw()
    }
  }
}
