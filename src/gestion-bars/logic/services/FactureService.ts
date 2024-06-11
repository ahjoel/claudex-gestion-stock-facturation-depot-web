import MainService from './MainService'

export default class FactureService extends MainService {
  constructor() {
    super('/factures')
  }
}
