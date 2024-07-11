import MainModel from './MainModel'

export default class StatInventaireStockVente extends MainModel {
  produit: string
  model: string
  fournisseur: string
  qte_stock: number
  qte_stock_entree: number
  qte_stock_vendu: number
  qte_stock_restant: number
  seuil: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    produit = '',
    model = '',
    fournisseur = '',
    qte_stock = 0,
    qte_stock_entree = 0,
    qte_stock_vendu = 0,
    qte_stock_restant = 0,
    seuil = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.model = model
    this.fournisseur = fournisseur
    this.qte_stock = qte_stock
    this.qte_stock_entree = qte_stock_entree
    this.qte_stock_vendu = qte_stock_vendu
    this.qte_stock_restant = qte_stock_restant
    this.seuil = seuil
  }
}
