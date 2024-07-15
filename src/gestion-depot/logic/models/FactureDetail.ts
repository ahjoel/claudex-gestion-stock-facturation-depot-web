import MainModel from './MainModel'

export default class FactureDetail extends MainModel {
  produit: string
  remise: string
  code: string
  created_at: string
  client: string
  modele: string
  username: string
  fournisseur: string
  qte: number
  pv: number
  factureId: number
  produitId: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    produit = '',
    modele = '',
    remise = '',
    code = '',
    client = '',
    created_at = '',
    username = '',
    qte = 0,
    pv = 0,
    factureId = 0,
    produitId = 0,
    fournisseur = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.modele = modele
    this.remise = remise
    this.username = username
    this.created_at = created_at
    this.code = code
    this.client = client
    this.fournisseur = fournisseur
    this.qte = qte
    this.pv = pv
    this.factureId = factureId
    this.produitId = produitId
  }
}
