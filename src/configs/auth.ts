export default {
  loginEndpoint: '/sign/in',

  meEndpoint: '/auth/me',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
