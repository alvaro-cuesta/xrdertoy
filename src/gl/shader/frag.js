const makeSource = ({ shaderSource, inputs, isLowEnd, isBuffer }) => {
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
uniform float iChannelTime[4];
uniform vec4 iMouse;
uniform vec4 iDate;
uniform float iSampleRate;
uniform vec3 iChannelResolution[4];
uniform int iFrame;
uniform float iTimeDelta;
uniform float iFrameRate;

${inputs
  .map((input) => {
    const samplerType = input?.texture?.samplerType
    const i = input?.channel

    return `uniform ${samplerType} iChannel${i};

uniform struct {
  ${samplerType} sampler;
  vec3 size;
  float time;
  int loaded;
} iCh${i};`
  })
  .join('\n\n')}

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

  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  mainVR(color, viewFragCoord, vRayOrig, rayDir);
  ${!isBuffer ? 'color.w = 1.0;' : ''}
  fragColor = color;
}
`
}

export default makeSource
