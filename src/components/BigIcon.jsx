import PropTypes from 'prop-types'
import cx from 'classnames'
import styles from './BigIcon.module.scss'

const BigIcon = ({ Icon, children, isSmall }) => (
  <div className={cx(styles.BigIcon, { [styles.isSmall]: isSmall })}>
    <Icon className={styles.icon} />
    {children}
  </div>
)

BigIcon.propTypes = {
  Icon: PropTypes.element.isRequired,
  isSmall: PropTypes.bool,
}

export default BigIcon
