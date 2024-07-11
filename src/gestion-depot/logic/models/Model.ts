import MainModel from './MainModel'

export default class Model extends MainModel {
  name: string
  description: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    name = '',
    description = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.name = name
    this.description = description
  }
}
