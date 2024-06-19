import Fournisseur from './Fournisseur'
import MainModel from './MainModel'

export default class Produit extends MainModel {
  code: string
  name: string
  description: string
  model: string
  modelId: number
  fournisseur: Fournisseur | string
  fournisseurId: number
  pv: number
  stock: string
  stock_min: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    name = '',
    description = '',
    model = '',
    stock = '',
    modelId = 0,
    fournisseur = new Fournisseur(),
    fournisseurId = 0,
    pv = 0,
    stock_min = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.name = name
    this.description = description
    this.stock = stock
    this.model = model
    this.modelId = modelId
    this.fournisseur = fournisseur
    this.fournisseurId = fournisseurId
    this.pv = pv
    this.stock_min = stock_min
  }
}
