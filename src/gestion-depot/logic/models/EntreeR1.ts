import MainModel from './MainModel'
import Produit from './Produit'

export default class EntreeR1 extends MainModel {
  code: string
  produit: Produit | string
  produitId: number
  model: string
  fournisseur: string
  qte: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    produit = new Produit(),
    produitId = 0,
    model = '',
    fournisseur = '',
    qte = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.produit = produit
    this.produitId = produitId
    this.model = model
    this.fournisseur = fournisseur
    this.qte = qte
  }
}
