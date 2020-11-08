const { useQuery } = require('react-query')
const { APP_KEY } = require('../config')

export const useQueryShaderList = (
  resultsPerPage,
  text,
  page,
  sort,
  hasSoundOutput,
  hasMicrophone,
  hasWebcam,
  hasMultipass,
  hasSoundCloud,
) =>
  useQuery(
    [
      'shader-list',
      text,
      page,
      sort,
      hasSoundOutput,
      hasMicrophone,
      hasWebcam,
      hasMultipass,
      hasSoundCloud,
    ],
    () => {
      const controller = new AbortController()
      const signal = controller.signal

      const promise = fetch(
        `https://www.shadertoy.com/api/v1/shaders${
          text ? `/query/${encodeURIComponent(text)}` : ''
        }?filter=vr${hasSoundOutput ? '&filter=soundoutput' : ''}${
          hasMicrophone ? '&filter=soundinput' : ''
        }${hasWebcam ? '&filter=webcam' : ''}${
          hasMultipass ? '&filter=multipass' : ''
        }${hasSoundCloud ? '&filter=musicstream' : ''}&sort=${sort}&from=${
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
