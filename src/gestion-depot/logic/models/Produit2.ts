import Fournisseur from './Fournisseur'
import MainModel from './MainModel'

export default class Produit2 extends MainModel {
  designation: string
  qte: string
  pu: string
  montant: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    designation = '',
    qte = '',
    pu = '',
    montant = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.designation = designation
    this.qte = qte
    this.pu = pu
    this.montant = montant
  }
}
