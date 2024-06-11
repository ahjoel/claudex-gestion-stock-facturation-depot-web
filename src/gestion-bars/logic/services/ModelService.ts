import MainService from './MainService'

export default class ModelService extends MainService {
  constructor() {
    super('/models')
  }
}
