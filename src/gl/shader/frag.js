const source = `precision highp float;

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

struct Sphere {
    vec3 p;
    float r;
};

struct Phong {
    vec3 diffuse;
    vec3 specular;
};

struct Light {
    vec3 p;
    Phong phong;
};

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

// Raymarching config
const float HIT_DIST = .001;
const float MAX_DIST = 100.;
const int MAX_ITERS = 100;

// Normals config
const float NORMAL_E = .001;

// Scene config
const Sphere SPHERE1 = Sphere(vec3(.9, 0, -3), 1.);
const Sphere SPHERE2 = Sphere(vec3(-.5, 0, -3), 1.);
const Light LIGHT1 = Light(
    vec3(1, 1, -1),
    Phong(vec3(1, .3, .3), vec3(.3, 1, .3))
);
const Material MATERIAL1 = Material(
    vec3(0),
    vec3(.7),
    vec3(1),
    40.
);

// Camera config
const vec3 RD = vec3(0, 0, 1);
const vec3 RO = vec3(0, 0, 0);
const float ZOOM = 1.;

// Coordinate system config
const vec3 UP = vec3(0, 1, 0);

////

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float opU(float a, float b) {
    return min(a, b);
}

float opSmoothU(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}

float sdScene(vec3 p) {
    return opSmoothU(
        sdSphere(SPHERE1.p - p, SPHERE1.r * sin(iTime + 1.)/4. + .75),
        sdSphere(SPHERE2.p - p, SPHERE2.r * sin(iTime)/4. + .75),
        1.
    );
}

vec3 getNormal(vec3 p) {
    const vec2 k = vec2(1, -1);

    return normalize(
        k.xyy * sdScene(p + k.xyy * NORMAL_E) +
        k.yxy * sdScene(p + k.yxy * NORMAL_E) +
        k.yyx * sdScene(p + k.yyx * NORMAL_E) +
        k.xxx * sdScene(p + k.xxx * NORMAL_E)
    );
}

vec3 getNormal2(vec3 p) {
    const vec2 e = vec2(NORMAL_E, 0);

    return normalize(vec3(
        sdScene(p + e.xyy),
        sdScene(p + e.yxy),
        sdScene(p + e.yyx)
    )) / NORMAL_E;
}

float rayMarch(vec3 ro, vec3 rd) {
    float d = 0.;

    for (int i = 0; i >= 0; i++) {
        vec3 p = ro + rd*d;

        float sd = sdScene(p);

        if (sd <= HIT_DIST) {
            return d;
        }

        d += sd;

        if (d > MAX_DIST || i - 1 == MAX_ITERS) {
            return MAX_DIST;
        }
    }
}

vec3 getLightPhong(vec3 rd, vec3 p, vec3 n, Light light, Material material) {
    vec3 ld = normalize(light.p - p);
    vec3 rr = normalize(reflect(-ld, n));

    return (
        material.diffuse * light.phong.diffuse * max(dot(ld, n), 0.) +
        material.specular * light.phong.specular * pow(max(dot(rd, rr), 0.), material.shininess)
    );
}

vec3 getPhong(vec3 ro, vec3 p) {
    vec3 rd = normalize(ro - p);
    vec3 n = getNormal(p);

    const vec3 Ia = vec3(1.);

    return MATERIAL1.ambient * Ia + getLightPhong(rd, p, n, LIGHT1, MATERIAL1);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 fragRayOri, in vec3 fragRayDir )
{
    vec3 rd = fragRayDir;
    float d = rayMarch(fragRayOri, rd);
    vec3 p = fragRayOri + rd*d;

    vec3 col;

    if (d == MAX_DIST) {
        col = vec3(0);
    } else {
        col = vec3(getPhong(fragRayOri, p));
    }

    fragColor = vec4(col,1.0);
}

void main() {
  vec3 rayDir = normalize(vZNearPos - vRayOrig);

  mainVR(gl_FragColor, gl_FragCoord.xy * gl_FragCoord.w, vRayOrig, rayDir);
}
`

export default source
