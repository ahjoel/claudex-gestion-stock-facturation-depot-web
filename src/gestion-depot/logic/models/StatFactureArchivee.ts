import MainModel from './MainModel'

export default class StatFactureArchivee extends MainModel {
  produit: string
  remise: string
  tax: string
  code: string
  created_at: string
  createdAtReg: string
  dateEcheance: string
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
    dateEcheance = '',
    mt_regle = '',
    created_at = '',
    statut = '',
    tax = '',
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
    this.createdAtReg = createdAtReg
    this.code = code
    this.client = client
    this.tax = tax
    this.mt_a_payer = mt_a_payer
    this.dateEcheance = dateEcheance
    this.mt_encaisse = mt_encaisse
    this.mt_restant = mt_restant
    this.mt_regle = mt_regle
    this.mtrecu = mtrecu
    this.mtpayer = mtpayer
    this.statut = statut
  }
}
