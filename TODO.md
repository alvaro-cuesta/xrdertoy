# To Do

## General

- What is `published` in `Shader.info`?
- What is `hasliked` in `Shader.info`?
- Footer
- Remove ShaderToy media on `/public/media/` when (if) they enable CORS

## `Browser` features

- Better "loading" state + keep current results if any
- Debounce text search

## `Viewer` features

- Better "loading" state
- Maybe allow editing code (for shaders with defines for e.g. quality)
- Quality selector (intermediate render buffer?)

## Error handling

- Error/warn if `Shader.ver` is not `0.1` on `Viewer`
- Pretty 404 page
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
- Videos
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
