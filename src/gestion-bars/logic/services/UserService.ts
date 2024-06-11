import MainService from './MainService'

export default class UserService extends MainService {
  constructor() {
    super('/users')
  }
}
