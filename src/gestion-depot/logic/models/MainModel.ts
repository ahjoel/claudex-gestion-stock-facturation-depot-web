export default class MainModel {
  id: number
  createdBy: null | number
  createdAt: string
  updatedBy: null | number
  updatedAt: string
  deletedBy: null | number
  deletedAt: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = ''
  ) {
    this.id = id
    this.createdBy = createdBy
    this.createdAt = createdAt
    this.updatedBy = updatedBy
    this.updatedAt = updatedAt
    this.deletedBy = deletedBy
    this.deletedAt = deletedAt
  }
}
