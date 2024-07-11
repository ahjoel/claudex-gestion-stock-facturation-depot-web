import MainModel from './MainModel'

export default class StorageData extends MainModel {
  productId: number
  product: string
  model: string
  fournisseur: string
  quantity: number
  pv: number
  stockDispo: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    productId = 0,
    product = '',
    model = '',
    fournisseur = '',
    quantity = 0,
    pv = 0,
    stockDispo = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)
    this.productId = productId
    this.product = product
    this.model = model
    this.fournisseur = fournisseur
    this.quantity = quantity
    this.pv = pv
    this.stockDispo = stockDispo
  }
}

// export default class EntreeR1Dispo extends MainModel {
//   produit: Produit | string
//   produitId: number
//   model: string
//   fournisseur: string
//   st_dispo: string
//   stockMinimal: string

//   constructor(
//     id = -1,
//     createdBy = null,
//     createdAt = '',
//     updatedBy = null,
//     updatedAt = '',
//     deletedBy = null,
//     deletedAt = '',
//     produit = new Produit(),
//     produitId = 0,
//     model = '',
//     fournisseur = '',
//     st_dispo = '',
//     stockMinimal = ''
//   ) {
//     super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

//     this.produit = produit
//     this.produitId = produitId
//     this.model = model
//     this.fournisseur = fournisseur
//     this.st_dispo = st_dispo
//     this.stockMinimal = stockMinimal
//   }
// }
