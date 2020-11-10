import { useCallback, useEffect } from 'react'
import cx from 'classnames'
import {
  useQueryParam,
  withDefault,
  NumberParam,
  StringParam,
  BooleanParam,
} from 'use-query-params'
import { useQueryShaderList } from '../hooks/useQueryShaderList'
import BrowserItem from './BrowserItem'
import styles from './Browser.module.scss'
import { Helmet } from 'react-helmet-async'

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
  const [hasKeyboard, setHasKeyboard] = useQueryParam('keyboard', BooleanParam)

  // List fetching
  const {
    isLoading,
    isError,
    isSuccess,
    isPreviousData,
    data,
    refetch,
  } = useQueryShaderList(
    Browser.RESULTS_PER_PAGE,
    text,
    page,
    sort,
    hasGPUSound,
    hasMicrophone,
    hasWebcam,
    hasMultipass,
    hasSoundCloud,
    hasKeyboard,
  )

  // Text
  const handleTextChange = useCallback(
    (e) => {
      setText(e.target.value.length > 0 ? e.target.value : undefined)
    },
    [setText],
  )
  const handleTextDelete = useCallback(() => {
    setText(undefined)
  }, [setText])

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
  const handleCheckKeyboard = useCallback(
    (e) => {
      setHasKeyboard(e.target.checked ? true : undefined)
    },
    [setHasKeyboard],
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
  const maxPage = Math.ceil(totalShaders / Browser.RESULTS_PER_PAGE) || 1

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
    <div className={styles.Browser}>
      <Helmet>
        <title>Browser - XRderToy Viewer</title>
      </Helmet>

      <div className={styles.filters}>
        <div className={styles.text}>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Search..."
          />
          <button onClick={handleTextDelete}>X</button>
        </div>
        <label className={styles.sort}>
          Sort by:{' '}
          <select onChange={handleSortChange} value={sort}>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="love">Love</option>
            <option value="hot">Hot</option>
            <option value="name">Name</option>
          </select>
        </label>
        <div className={styles.checks}>
          <label
            className={cx(styles.filter, { [styles.checked]: hasMultipass })}
          >
            <input
              type="checkbox"
              checked={hasMultipass}
              onChange={handleCheckMultipass}
            />
            Multipass
          </label>
          <label
            className={cx(styles.filter, { [styles.checked]: hasGPUSound })}
          >
            <input
              type="checkbox"
              checked={hasGPUSound}
              onChange={handleCheckGPUSound}
            />
            GPU Sound
          </label>
          <label
            className={cx(styles.filter, { [styles.checked]: hasMicrophone })}
          >
            <input
              type="checkbox"
              checked={hasMicrophone}
              onChange={handleCheckMicrophone}
            />
            Microphone
          </label>
          <label
            className={cx(styles.filter, { [styles.checked]: hasSoundCloud })}
          >
            <input
              type="checkbox"
              checked={hasSoundCloud}
              onChange={handleCheckSoundCloud}
            />
            SoundCloud
          </label>
          <label className={cx(styles.filter, { [styles.checked]: hasWebcam })}>
            <input
              type="checkbox"
              checked={hasWebcam}
              onChange={handleCheckWebcam}
            />
            Webcam
          </label>
          <label
            className={cx(styles.filter, { [styles.checked]: hasKeyboard })}
          >
            <input
              type="checkbox"
              checked={hasKeyboard}
              onChange={handleCheckKeyboard}
            />
            Keyboard
          </label>
        </div>
        {isSuccess ? (
          <div className={styles.pagination}>
            <button onClick={handleFirstPage}>&lt;&lt;</button>
            <button onClick={handlePrevPage}>&lt;</button>
            Page {page} of {maxPage} ({totalShaders} shaders)
            <button onClick={handleNextPage}>&gt;</button>
            <button onClick={handleLastPage}>&gt;&gt;</button>
          </div>
        ) : null}
      </div>
      <div className={styles.listWrapper}>
        {isError ? (
          <div>
            Error loading shaders <button onClick={refetch}>Retry</button>
          </div>
        ) : isLoading || isPreviousData ? (
          'Loading shaders...'
        ) : data.Shaders === 0 ? (
          'No shaders found matching that criteria'
        ) : (
          <ul className={styles.resultList}>
            {data.Results.map((id) => (
              <li key={id}>
                <BrowserItem id={id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

Browser.propTypes = {}

Browser.RESULTS_PER_PAGE = 12

export default Browser
