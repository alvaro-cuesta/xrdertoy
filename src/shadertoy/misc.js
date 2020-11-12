export const getIsLowEnd = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|SamsungBrowser|OculusBrowser|Mobile VR/i.test(
    navigator.userAgent,
  )

export const toShaderToyURL = (url) =>
  new URL(url, 'https://www.shadertoy.com').toString()
