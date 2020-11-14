import PropTypes from 'prop-types'
import cx from 'classnames'
import { ReactComponent as Spinner } from '../icons/spinner.svg'
import styles from './GlobalSpinner.module.scss'

const GlobalSpinner = ({ isHidden }) => (
  <Spinner
    className={cx(styles.GlobalSpinner, { [styles.isHidden]: isHidden })}
  />
)

GlobalSpinner.propTypes = {
  isHidden: PropTypes.bool,
}

export default GlobalSpinner
