import MainModel from './MainModel'

export default class Facture extends MainModel {
  code: string
  client: string
  taxe: number
  nbproduit: string
  totalfacture: string
  statut: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    client = '',
    taxe = 0,
    nbproduit = '',
    totalfacture = '',
    statut = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.client = client
    this.taxe = taxe
    this.nbproduit = nbproduit
    this.totalfacture = totalfacture
    this.statut = statut
  }
}
