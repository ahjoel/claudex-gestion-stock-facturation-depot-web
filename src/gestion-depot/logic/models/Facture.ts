import Client from './Client'
import MainModel from './MainModel'

export default class Facture extends MainModel {
  code: string
  client_id: number
  client: Client | string
  taxe: number
  remise: number
  nbproduit: string
  totalfacture: string
  etatFacture: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    client_id = 0,
    client = new Client(),
    taxe = 0,
    remise = 0,
    nbproduit = '',
    totalfacture = '',
    etatFacture = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.client_id = client_id
    this.client = client
    this.taxe = taxe
    this.remise = remise
    this.nbproduit = nbproduit
    this.totalfacture = totalfacture
    this.etatFacture = etatFacture
  }
}
