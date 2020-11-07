import { useQuery } from 'react-query'
import { APP_KEY } from '../config'

export const useQueryShader = (id) =>
  useQuery(
    ['shader', id],
    () => {
      const controller = new AbortController()
      const signal = controller.signal

      const promise = fetch(
        `https://www.shadertoy.com/api/v1/shaders/${id}&key=${APP_KEY}`,
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
