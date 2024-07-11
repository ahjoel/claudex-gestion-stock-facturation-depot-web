import Facture from './Facture'
import MainModel from './MainModel'

export default class Reglement extends MainModel {
  firstname: string
  code: string
  auteur: string
  codeFacture: string
  mt_a_payer: string
  mt_encaisse: string
  mt_restant: string
  mtrecu: number
  mtpayer: number
  facture: Facture | string
  factureId: number
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
    auteur = '',
    code = '',
    codeFacture = '',
    mt_a_payer = '',
    mt_encaisse = '',
    mt_restant = '',
    mtrecu = 0,
    mtpayer = 0,
    facture = new Facture(),
    factureId = 0,
    client = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.firstname = firstname
    this.auteur = auteur
    this.code = code
    this.codeFacture = codeFacture
    this.mt_a_payer = mt_a_payer
    this.mt_encaisse = mt_encaisse
    this.mt_restant = mt_restant
    this.mtrecu = mtrecu
    this.mtpayer = mtpayer
    this.facture = facture
    this.factureId = factureId
    this.client = client
  }
}
