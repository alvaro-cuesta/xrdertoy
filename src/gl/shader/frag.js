const makeSource = ({ shaderSource, isLowEnd }) => {
  return `#version 300 es
#ifdef GL_ES
precision highp float;
precision highp int;
precision mediump sampler3D;
#endif

#define HW_PERFORMANCE ${isLowEnd ? 1 : 0}

uniform vec3 iResolution;
uniform float iTime;
// uniform float iChannelTime[4]; // channel playback time (in seconds)
uniform vec4 iMouse;
uniform vec4 iDate;
// uniform float iSampleRate; // sound sample rate (i.e., 44100)
// uniform vec3 iChannelResolution[4]; // channel resolution (in pixels)
uniform int iFrame;
uniform float iTimeDelta;
uniform float iFrameRate;
// uniform samplerXX iChannel0..3; // input channel. XX = 2D/Cube

in vec3 vZNearPos;
in vec3 vRayOrig;

out vec4 fragColor;

${shaderSource}

void main() {
  vec3 rayDir = normalize(vZNearPos - vRayOrig);

  mainVR(fragColor, gl_FragCoord.xy * gl_FragCoord.w, vRayOrig, rayDir);
}
`
}

export default makeSource
