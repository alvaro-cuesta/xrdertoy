import { initShaderProgram } from './shader'
import { initQuad } from './quad'
import { mat4 } from 'gl-matrix'

const FPS_RATE = 500

export const createDrawScene = (renderpass) => (gl) => {
  if (renderpass.length > 1) {
    throw new Error('Multipass not supported')
  }

  if (renderpass[0].inputs.length > 0) {
    throw new Error('Inputs not supported')
  }

  const shaderProgram = initShaderProgram(gl, renderpass[0].code)
  const quad = initQuad(gl)

  let iFrame = 0

  const start = performance.now()
  let lastFrameTime = start
  let lastFPSTime = -Infinity
  let fpsFrames = 0
  let iFrameRate = 0

  return (time, frame, refSpace) => {
    if (iFrame % 60 === 0) {
      console.log(time, frame, refSpace)
    }

    const session = frame.session

    const pose = frame.getViewerPose(refSpace)

    const glLayer = session.renderState.baseLayer

    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer)

    if (!pose) {
      return
    }

    const date = new Date()
    const now = performance.now()

    const iTime = (now - start) / 1000
    const iDate = [
      date.getFullYear(), // the year (four digits)
      date.getMonth(), // the month (from 0-11)
      date.getDate(), // the day of the month (from 1-31)
      date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds(),
    ]
    const iTimeDelta = (now - lastFrameTime) / 1000

    lastFrameTime = now

    const fpsDelta = now - lastFPSTime
    if (fpsDelta >= FPS_RATE) {
      iFrameRate = (fpsFrames / FPS_RATE) * 1000
      lastFPSTime = now
      fpsFrames = 0
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
      gl.uniform1f(shaderProgram.iTime, iTime)
      gl.uniform4f(shaderProgram.iMouse, 0, 0, 0, 0)
      gl.uniform4fv(shaderProgram.iDate, iDate)
      gl.uniform1i(shaderProgram.iFrame, iFrame)
      gl.uniform1f(shaderProgram.iTimeDelta, iTimeDelta)
      gl.uniform1f(shaderProgram.iFrameRate, iFrameRate)

      quad.draw()
    }

    iFrame++
    fpsFrames++
  }
}
