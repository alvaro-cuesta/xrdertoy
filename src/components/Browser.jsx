import { useCallback, useEffect } from 'react'
import {
  useQueryParam,
  withDefault,
  NumberParam,
  StringParam,
  BooleanParam,
} from 'use-query-params'
import { RESULTS_PER_PAGE } from '../config'
import { useQueryShaderList } from '../hooks/useQueryShaderList'
import ListItem from './ListItem'

const Browser = () => {
  // Query params
  const [text, setText] = useQueryParam('text', withDefault(StringParam, ''))
  const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 1))
  const [sort, setSort] = useQueryParam(
    'sort',
    withDefault(StringParam, 'popular'),
  )
  const [hasGPUSound, setHasGPUSound] = useQueryParam('gpusound', BooleanParam)
  const [hasMicrophone, setHasMicrophone] = useQueryParam(
    'microphone',
    BooleanParam,
  )
  const [hasWebcam, setHasWebcam] = useQueryParam('webcam', BooleanParam)
  const [hasMultipass, setHasMultipass] = useQueryParam(
    'multipass',
    BooleanParam,
  )
  const [hasSoundCloud, setHasSoundCloud] = useQueryParam(
    'soundcloud',
    BooleanParam,
  )

  // List fetching
  const {
    isLoading,
    isError,
    isSuccess,
    isPreviousData,
    data,
  } = useQueryShaderList(
    text,
    page,
    sort,
    hasGPUSound,
    hasMicrophone,
    hasWebcam,
    hasMultipass,
    hasSoundCloud,
  )

  // Text
  const handleTextChange = useCallback(
    (e) => {
      setText(e.target.value.length > 0 ? e.target.value : undefined)
    },
    [setText],
  )

  // Filters
  const handleCheckGPUSound = useCallback(
    (e) => {
      setHasGPUSound(e.target.checked ? true : undefined)
    },
    [setHasGPUSound],
  )
  const handleCheckMicrophone = useCallback(
    (e) => {
      setHasMicrophone(e.target.checked ? true : undefined)
    },
    [setHasMicrophone],
  )
  const handleCheckWebcam = useCallback(
    (e) => {
      setHasWebcam(e.target.checked ? true : undefined)
    },
    [setHasWebcam],
  )
  const handleCheckMultipass = useCallback(
    (e) => {
      setHasMultipass(e.target.checked ? true : undefined)
    },
    [setHasMultipass],
  )
  const handleCheckSoundCloud = useCallback(
    (e) => {
      setHasSoundCloud(e.target.checked ? true : undefined)
    },
    [setHasSoundCloud],
  )

  // Sort
  const handleSortChange = useCallback(
    (e) => {
      setSort(e.target.value !== 'popular' ? e.target.value : undefined)
    },
    [setSort],
  )

  // Pagination
  const totalShaders = data?.Shaders || 0
  const maxPage = Math.floor(totalShaders / RESULTS_PER_PAGE) + 1

  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [page, maxPage, setPage])

  const handleFirstPage = useCallback(() => {
    setPage(1)
  }, [setPage])

  const handlePrevPage = useCallback(() => {
    setPage((page) => Math.min(Math.max(1, page - 1), maxPage))
  }, [setPage, maxPage])

  const handleNextPage = useCallback(() => {
    setPage((page) => Math.min(Math.max(1, page + 1), maxPage))
  }, [setPage, maxPage])

  const handleLastPage = useCallback(() => {
    setPage(maxPage)
  }, [setPage, maxPage])

  return (
    <>
      <label>
        Text: <input type="text" value={text} onChange={handleTextChange} />
      </label>
      <label>
        Sort by:{' '}
        <select onChange={handleSortChange} value={sort}>
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="love">Love</option>
          <option value="hot">Hot</option>
          <option value="name">Name</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={hasMultipass}
          onChange={handleCheckMultipass}
        />
        Multipass
      </label>
      <label>
        <input
          type="checkbox"
          checked={hasGPUSound}
          onChange={handleCheckGPUSound}
        />
        GPU Sound
      </label>
      <label>
        <input
          type="checkbox"
          checked={hasMicrophone}
          onChange={handleCheckMicrophone}
        />
        Microphone
      </label>
      <label>
        <input
          type="checkbox"
          checked={hasSoundCloud}
          onChange={handleCheckSoundCloud}
        />
        SoundCloud
      </label>
      <label>
        <input
          type="checkbox"
          checked={hasWebcam}
          onChange={handleCheckWebcam}
        />
        Webcam
      </label>
      {isSuccess ? (
        <>
          <button onClick={handleFirstPage}>&lt;&lt;</button>
          <button onClick={handlePrevPage}>&lt;</button>
          Page {page} of {maxPage} ({totalShaders} shaders)
          <button onClick={handleNextPage}>&gt;</button>
          <button onClick={handleLastPage}>&gt;&gt;</button>
        </>
      ) : null}
      {isError ? (
        'Error loading shaders'
      ) : isLoading || isPreviousData ? (
        'Loading shaders...'
      ) : data.Shaders === 0 ? (
        'No shaders found matching that criteria'
      ) : (
        <ul>
          {data.Results.map((id) => (
            <li key={id}>
              <ListItem id={id} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

Browser.propTypes = {}

export default Browser
