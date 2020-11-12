export const getIsLowEnd = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|SamsungBrowser|OculusBrowser|Mobile VR/i.test(
    navigator.userAgent,
  )
