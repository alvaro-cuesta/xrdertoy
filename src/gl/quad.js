// prettier-ignore
const POSITIONS = [
  1.0,  1.0,
 -1.0,  1.0,
 -1.0, -1.0,
  1.0, -1.0,
]

// prettier-ignore
const INDICES = [
 0, 1, 2,
 0, 2, 3,
]

export const initQuad = (gl) => {
  const positions = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positions)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(POSITIONS), gl.STATIC_DRAW)

  const indices = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(INDICES),
    gl.STATIC_DRAW,
  )

  const bind = (vertexAttribPointer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, positions)
    gl.vertexAttribPointer(vertexAttribPointer, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vertexAttribPointer)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
  }

  const draw = () => {
    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)
  }

  return {
    bind,
    draw,
  }
}
