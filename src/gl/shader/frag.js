const makeSource = ({ shaderSource, isLowEnd }) => {
  return `
#define HW_PERFORMANCE ${isLowEnd ? 1 : 0}

precision highp float;

varying vec3 vZNearPos;
varying vec3 vRayOrig;

uniform mat4 uInvViewMatrix;

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)

/*
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

*/

${shaderSource}

void main() {
  vec3 rayDir = normalize(vZNearPos - vRayOrig);

  mainVR(gl_FragColor, gl_FragCoord.xy * gl_FragCoord.w, vRayOrig, rayDir);
}
`
}

export default makeSource
