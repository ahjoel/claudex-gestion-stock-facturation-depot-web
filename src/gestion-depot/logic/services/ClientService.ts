import MainService from './MainService'

export default class ClientService extends MainService {
  constructor() {
    super('/clients')
  }
}
