const source = `#version 300 es
#ifdef GL_ES
precision highp float;
precision highp int;
precision mediump sampler3D;
#endif

uniform mat4 uInvViewMatrix;
uniform mat4 uInvProjMatrix;

in vec2 aVertexPosition;

out vec3 vZNearPos;
out vec3 vRayOrig;

void main() {
  // Vertices in the near plane in NDC
  gl_Position = vec4(aVertexPosition.xy, -1.0, 1.0);

  // Vertices in world-space
  vec4 vZNearPosW = uInvViewMatrix * uInvProjMatrix * gl_Position;
  vZNearPos = vZNearPosW.xyz / vZNearPosW.w;

  // Ray origin in world-space
  vec4 rayOrigW = uInvViewMatrix * vec4(0, 0, 0, 1);
  vRayOrig = rayOrigW.xyz / rayOrigW.w;
}
`

export default source
