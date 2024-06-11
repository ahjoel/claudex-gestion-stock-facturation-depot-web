import MainService from './MainService'

export default class FournisseurService extends MainService {
  constructor() {
    super('/fournisseurs')
  }
}
