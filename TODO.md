# To Do

## General

- Footer
- Remove ShaderToy media on `/public/media/` when (if) they enable CORS

## `Viewer` features

- Maybe allow editing code (for shaders with defines for e.g. quality)
- Quality selector (intermediate render buffer?)

## Error handling

- Error/warn if `Shader.ver` is not `0.1` on `Viewer`
- Pretty `Browser` download error
- `BrowserItem` download error + pretty
- `BrowserItem` image error + pretty
- Allow retyring `BrowserItem`
- Pretty `Viewer` download error
- `Viewer` image error + pretty
- `Viewer` XR/GL error + pretty
- Error boundary for nice internal errors + pretty
- Error/warn when failing on inputs
- Report issue links
  - Footer (link to generic error template)
  - On `Browser` download error ("if this issue persists" link to download error
    template)
  - On `Viewer` XR/GL error (link to "works on ShaderToy" template)
  - On `Viewer` download error ("if this issue persists" link to download error
    template)
  - On internal error (link to generic error template)

## ShaderToy compatibility

- What is `Shader.info.published`?
- What is `Shader.info.hasliked`?
- Is `Shader.renderpass[i].sampler.internal` always `"byte"`?
- Is `Shader.renderpass[i].sampler.srgb` always `"false"`?
- Texture shaders seem to be hardcoded as `C4I8` on `effect.js`... except a few
  weird constants like `"Xdf3zn"`. What are those?
- There are some weird constants on `"bufferID_to_assetID"`. What are those?

## ShaderToy features

### Input uniforms

- Make `iMouse` react (maybe from controller?)
- `iSampleRate`
- Custom VR uniforms? (e.g. for controllers)
  - Maybe with some `#define`

### Output channels

- Common
- Buffer [A-D]
- Cubemap A
- Sound

### Input channels

- Keyboard
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- Webcam
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- Microphone
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- SoundCloud
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- Buffer [A-D]
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- Cubemap A
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- Volumes
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
- Music
  - iChannelX
  - iChannelResolution[x]
  - iChannelTime[x]
  - iChX.sampler
  - iChX.size
  - iChX.time
  - iChX.loaded
