import MainModel from './MainModel'

export default class StatFactureReglement extends MainModel {
  produit: string
  remise: string
  code: string
  created_at: string
  createdAtReg: string
  client: string
  mt_a_payer: string
  mt_encaisse: string
  mt_restant: string
  mt_regle: string
  mtrecu: number
  mtpayer: number
  statut: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    createdAtReg = '',
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
    mt_regle = '',
    mt_encaisse = '',
    mt_restant = '',
    mtrecu = 0,
    mtpayer = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.remise = remise
    this.created_at = created_at
    this.createdAtReg = createdAtReg
    this.code = code
    this.client = client
    this.mt_a_payer = mt_a_payer
    this.mt_encaisse = mt_encaisse
    this.mt_restant = mt_restant
    this.mtrecu = mtrecu
    this.mt_regle = mt_regle
    this.mtpayer = mtpayer
    this.statut = statut
  }
}
