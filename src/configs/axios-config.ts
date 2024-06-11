import axios from 'axios'
import authConfig from 'src/configs/auth'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 5000, // Request timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a response interceptor
instance.interceptors.response.use(response => {
  // console.log("Response------ ", response)

  // console.log(" ------ ",  window.location.href)
  if (
    response &&
    !window.location.href.includes('login') &&
    response.data.status === 401 &&
    response.data.description === 'Incorrect access token'
  ) {
    window.localStorage.removeItem('firstname')
    window.localStorage.removeItem('profile')
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('email')
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('user')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.setItem('infoSession', 'Votre session a expiré. Reconnectez vous')

    window.location.reload()
  }

  return response
})

export default instance
