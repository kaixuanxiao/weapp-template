import userStore from '../store/userStore'
import createStoreBehavior from '../utils/createStoreBehavior'

export default createStoreBehavior(
  userStore,
  { key: 'user' },
)
