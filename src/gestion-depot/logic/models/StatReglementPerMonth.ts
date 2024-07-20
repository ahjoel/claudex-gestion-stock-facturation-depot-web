import MainModel from './MainModel'

export default class StatReglementPerMonth extends MainModel {
  moisAnnee: string
  Mtotal: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    moisAnnee = '',
    Mtotal = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.Mtotal = Mtotal
    this.moisAnnee = moisAnnee
  }
}
