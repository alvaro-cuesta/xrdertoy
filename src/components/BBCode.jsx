import PropTypes from 'prop-types'
import { bbc2html } from '../shadertoy/bbcode'
import styles from './BBCode.module.scss'

const BBCode = ({ string, allowMultimedia }) => (
  <div
    className={styles.BBCode}
    dangerouslySetInnerHTML={{ __html: bbc2html(string, allowMultimedia) }}
  />
)

BBCode.defaultProps = {
  allowMultimedia: false,
}

BBCode.propTypes = {
  string: PropTypes.string.isRequired,
  allowMultimedia: PropTypes.bool,
}

export default BBCode
