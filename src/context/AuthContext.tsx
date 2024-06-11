// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/configs/axios-config'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    console.log(' First +++++++++++++++++++++++++++++++++++++ 1 ')
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)

        if (window.localStorage.getItem('userData')) {
          const userData = JSON.parse(window.localStorage.getItem('userData') as string)

          console.log(' Loading User Data ---------------- 1 ')
          setUser({ ...userData })

          console.log(' Data user loaded ---------------- 1 ')

          setLoading(false)
        } else {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {

    axios.post(authConfig.loginEndpoint, {
      username: params.username,
      password: params.password
    })
      .then(async response => {

        if (response.data.status === 200) {

          window.localStorage.setItem('profile', response.data.data.userInfos[0].profile)
          window.localStorage.setItem('email', response.data.data.userInfos[0].email)
          window.localStorage.setItem('firstname', response.data.data.userInfos[0].firstname)
          window.localStorage.setItem('lastname', response.data.data.userInfos[0].lastname)
          window.localStorage.setItem('username', params.username || 'undefined')

          const userInfosResponse = response.data.data.userInfos[0];

          // Convertissez la réponse en chaîne JSON
          const userInfosResponseString = JSON.stringify(userInfosResponse);

          window.localStorage.setItem('user', userInfosResponseString);
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.data.accessToken)
          window.localStorage.setItem('userData', window.localStorage.getItem('user') ?? '');

          const userData = JSON.parse(window.localStorage.getItem('userData') as string)
          setUser({ ...userData })

          // const returnUrl = router.query.returnUrl
          // const URL = '/gestion-bars/dashboard'


          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)

          // if (returnUrl && returnUrl !== '/') {
          //   router.replace({
          //     pathname: URL,
          //     query: { returnUrl, username: params.username }
          //   })
          // } else {
          //   router.replace({
          //     pathname: URL,
          //     query: { username: params.username }
          //   })
          // }
        } else {
          if (errorCallback) errorCallback(response.data)
        }

      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }


  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('firstname')
    window.localStorage.removeItem('profile')
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('email')
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('user')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem('infoSession')
    router.push('/login')
  }

  // Handle Cart operation

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
