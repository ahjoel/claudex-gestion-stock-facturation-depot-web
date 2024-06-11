import MainModel from './MainModel'

export default class Reglement extends MainModel {
  firstname: string
  lastname: string
  codeFacture: string
  totalFacture: string
  client: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    firstname = '',
    lastname = '',
    codeFacture = '',
    totalFacture = '',
    client = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.firstname = firstname
    this.lastname = lastname
    this.codeFacture = codeFacture
    this.totalFacture = totalFacture
    this.client = client
  }
}
