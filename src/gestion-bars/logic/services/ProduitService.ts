import MainService from './MainService'

export default class ProduitService extends MainService {
  constructor() {
    super('/produits')
  }
}
