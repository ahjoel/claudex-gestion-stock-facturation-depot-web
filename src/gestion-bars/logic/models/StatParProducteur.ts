import MainModel from './MainModel'

export default class StatParProducteur extends MainModel {
  producteur: string
  quantite: number
  montant_vendu: number
  statut: string
  stock: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    producteur = '',
    statut = '',
    stock = '',
    quantite = 0,
    montant_vendu = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.producteur = producteur
    this.statut = statut
    this.quantite = quantite
    this.stock = stock
    this.montant_vendu = montant_vendu
  }
}
