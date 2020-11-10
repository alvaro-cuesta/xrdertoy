const makeSource = ({ shaderSource, isLowEnd }) => {
  return `#version 300 es
#ifdef GL_ES
precision highp float;
precision highp int;
precision mediump sampler3D;
#endif

#define HW_PERFORMANCE ${isLowEnd ? 1 : 0}

uniform vec4 uViewport;

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

void mainImage(out vec4 c, in vec2 f);
void mainVR(out vec4 c, in vec2 f, in vec3 ro, in vec3 rd);
void st_assert(bool cond);
void st_assert(bool cond, int v);

${shaderSource}

in vec3 vZNearPos;
in vec3 vRayOrig;

out vec4 fragColor;

void st_assert(bool cond, int v) {
  if (!cond) {
    if (v == 0) {
      fragColor.x = -1.0;
    }
    else if (v == 1) {
      fragColor.y=-1.0;
    }
    else if (v == 2) {
      fragColor.z = -1.0;
    }
    else {
      fragColor.w = -1.0;
    }
  }
}

void st_assert(bool cond) {
  if (!cond) {
    fragColor.x = -1.0;
  }
}

void main() {
  vec3 rayDir = normalize(vZNearPos - vRayOrig);
  vec2 fragCoord = gl_FragCoord.xy * gl_FragCoord.w;
  vec2 viewFragCoord = fragCoord - uViewport.xy;

  mainVR(fragColor, viewFragCoord, vRayOrig, rayDir);
}
`
}

export default makeSource
