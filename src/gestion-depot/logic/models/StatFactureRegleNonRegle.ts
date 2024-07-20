import MainModel from './MainModel'

export default class StatFactureRegleNonRegle extends MainModel {
  produit: string
  remise: string
  code: string
  created_at: string
  client: string
  mt_a_payer: string
  mt_encaisse: string
  mt_restant: string
  mtrecu: number
  mtpayer: number
  statut: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    produit = '',
    remise = '',
    code = '',
    client = '',
    created_at = '',
    statut = '',
    mt_a_payer = '',
    mt_encaisse = '',
    mt_restant = '',
    mtrecu = 0,
    mtpayer = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.remise = remise
    this.created_at = created_at
    this.code = code
    this.client = client
    this.mt_a_payer = mt_a_payer
    this.mt_encaisse = mt_encaisse
    this.mt_restant = mt_restant
    this.mtrecu = mtrecu
    this.mtpayer = mtpayer
    this.statut = statut
  }
}
