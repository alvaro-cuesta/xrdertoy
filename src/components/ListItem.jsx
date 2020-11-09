import PropTypes from 'prop-types'
import { useQueryShader } from '../hooks/useQueryShader'
import Preview from './Preview'

const ShaderListItem = ({ id }) => {
  const { isFetching, data } = useQueryShader(id)
  const { name, username, viewed: views, likes } = data?.Shader?.info || {}

  return (
    <Preview
      id={id}
      name={name}
      username={username}
      views={views}
      likes={likes}
      isLoading={isFetching}
    />
  )
}

ShaderListItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ShaderListItem
