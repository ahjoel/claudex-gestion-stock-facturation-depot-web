import MainModel from './MainModel'

export default class User extends MainModel {
  username: string
  firstname: string
  email: string
  lastname: string
  zone: string
  profile: string
  password: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    username = '',
    firstname = '',
    lastname = '',
    email = '',
    zone = '',
    profile = '',
    password = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.username = username
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.zone = zone
    this.profile = profile
    this.password = password
  }
}
