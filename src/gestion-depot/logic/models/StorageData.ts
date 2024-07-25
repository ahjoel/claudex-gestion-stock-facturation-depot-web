import MainModel from './MainModel'

export default class StorageData extends MainModel {
  productId: number
  product: string
  produit: string
  model: string
  fournisseur: string
  quantity: number
  pv: number
  stockDispo: number
  st_dispo: number
  seuil: number
  stockMinimal: number

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
    produit = '',
    model = '',
    fournisseur = '',
    quantity = 0,
    pv = 0,
    stockDispo = 0,
    stockMinimal = 0,
    st_dispo = 0,
    seuil = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)
    this.productId = productId
    this.product = product
    this.produit = produit
    this.model = model
    this.fournisseur = fournisseur
    this.quantity = quantity
    this.pv = pv
    this.stockDispo = stockDispo
    this.stockMinimal = stockMinimal
    this.st_dispo = st_dispo
    this.seuil = seuil
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
