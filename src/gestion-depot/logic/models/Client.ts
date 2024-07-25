import MainModel from './MainModel'

export default class Client extends MainModel {
  code: string
  name: string
  description: string
  type: string
  mail: string
  tel: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    name = '',
    type = '',
    mail = '',
    tel = '',
    description = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.name = name
    this.description = description
    this.type = type
    this.mail = mail
    this.tel = tel
  }
}
