const { usePaginatedQuery } = require('react-query')
const { APP_KEY } = require('../config')

export const useQueryShaderList = (
  resultsPerPage,
  text,
  page,
  sort,
  hasGPUSound,
  hasMicrophone,
  hasWebcam,
  hasMultipass,
  hasSoundCloud,
  hasKeyboard,
) =>
  usePaginatedQuery(
    [
      'shader-list',
      text,
      page,
      sort,
      hasGPUSound,
      hasMicrophone,
      hasWebcam,
      hasMultipass,
      hasSoundCloud,
      hasKeyboard,
    ],
    () => {
      const controller = new AbortController()
      const signal = controller.signal

      const promise = fetch(
        `https://www.shadertoy.com/api/v1/shaders${
          text ? `/query/${encodeURIComponent(text)}` : ''
        }?filter=vr${hasGPUSound ? '&filter=soundoutput' : ''}${
          hasMicrophone ? '&filter=soundinput' : ''
        }${hasWebcam ? '&filter=webcam' : ''}${
          hasMultipass ? '&filter=multipass' : ''
        }${hasSoundCloud ? '&filter=musicstream' : ''}${
          hasKeyboard ? '&filter=keyboard' : ''
        }&sort=${sort}&from=${
          (page - 1) * resultsPerPage
        }&num=${resultsPerPage}&key=${APP_KEY}`,
        {
          signal,
        },
      ).then((res) => res.json())

      promise.cancel = () => controller.abort()

      return promise
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  )
