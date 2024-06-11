export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string | null
  password: string | null
}

export type UserDataType = {
  id: number
  username: string
  firstname: string
  lastname: string
  profile: string
  avatar?: string | null
  lastName?: string | null
  firstName?: string | null
  changePassword?: boolean | null
  roles?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
