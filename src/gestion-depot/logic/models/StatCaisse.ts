import MainModel from './MainModel'

export default class StatCaisse extends MainModel {
  Mois_Annee: string
  MontantTotal: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    Mois_Annee = '',
    MontantTotal = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.Mois_Annee = Mois_Annee
    this.MontantTotal = MontantTotal
  }
}
