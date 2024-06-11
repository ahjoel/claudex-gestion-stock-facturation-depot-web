import authConfig from 'src/configs/auth'

export const getHeadersInformation = () => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  // const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
  // const expirationDate = new Date(tokenPayload.exp * 1000);
  // const currentDate = new Date();
  // console.log(expirationDate);
  // console.log(currentDate);


  // if (storedToken) {
  //   console.log("storedToken ========== ", storedToken)

  //   if (currentDate > expirationDate) {
  //     console.log("Le token est expiré");
  //     alert("Votre session a expiré");
  //     logout()
  //   } else {
  //   }
  // }

  return {
    'access-token': `${storedToken}`
  }

}

