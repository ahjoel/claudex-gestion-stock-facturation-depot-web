import MainModel from './MainModel'

export default class StatArchive extends MainModel {
  code: string
  client: string
  date_creation: string
  taxe: number
  nbproduit: number
  totalfacture: number
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
    statut = '',
    client = '',
    date_creation = '',
    taxe = 0,
    nbproduit = 0,
    totalfacture = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.client = client
    this.statut = statut
    this.date_creation = date_creation
    this.taxe = taxe
    this.nbproduit = nbproduit
    this.totalfacture = totalfacture
  }
}
