// ** Axios
import axios from 'src/configs/axios-config'
import { getHeadersInformation } from '../utils/constant'
import { number } from 'yup'

// ** Config

export default class MainService {
  url: string

  constructor(url: string, routeFor = '') {
    this.url = url + routeFor
  }

  create(object: any) {
    return new Promise(resolve => {
      axios
        .post(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          resolve(false)
        })
    })
  }

  update(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateStock(object: any) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          // console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateOffer(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateModel(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateFournisseur(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateFacture(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateProduit(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateUser(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateEntreeR1(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  updateEntreeRC(object: any, id: number) {
    // console.log('object :: ', object)

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.url}`, object, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          console.log(id)

          // console.log(response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          reject(error)
          resolve(false)
        })
    })
  }

  delete(id: number) {
    // console.log('id :: ', id)

    return new Promise(resolve => {
      axios
        .delete(`${this.url}?id=${id}`, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          resolve(false)
        })
    })
  }

  async createReglement(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}/reglement`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  readAll() {
    return new Promise(resolve => {
      axios
        .get(`${this.url}/all`, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          resolve(false)
        })
    })
  }

  readAllOffers() {
    return new Promise(resolve => {
      axios
        .get(`${this.url}/all`, {
          headers: {
            ...getHeadersInformation()
          }
        })
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          this.errorManagement(error)
          resolve(false)
        })
    })
  }

  async createe(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createModel(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createFournisseur(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createFacture(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      dataId: number
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
        result.dataId = response.data.data.id
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createProduit(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createUser(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createEntreeR1(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createEntreeRC(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createSortieR1(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async createSortieRC(object: any) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: []
    }

    try {
      const response = await axios.post(`${this.url}`, object, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listModels(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.models
        result.total = response.data.data.modelsNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async readAllModels(object: any = { page: 1, length: 500 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`models/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.models
        result.total = response.data.data.modelsNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listFournisseurs(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.fournisseurs
        result.total = response.data.data.fournisseursNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async readAllFournisseurs(object: any = { page: 1, length: 500 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`fournisseurs/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.fournisseurs
        result.total = response.data.data.fournisseursNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listProduits(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.produits
        result.total = response.data.data.produitNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listUsers() {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.users
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listFactures(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.facturesR1
        result.total = response.data.data.factureTotalR1Number
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listFacturesRC(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all/rc?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.facturesRC
        result.total = response.data.data.factureTotalRCNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listReglements(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.reglements
        result.total = response.data.data.reglementTotalNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listFactureOne(object: any = { id: 1 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/one?id=${object.id}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.oneFacture
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listFactureDetail(object: any = { code: 'null' }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/detail/all?code=${object.code}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.facturesDetailR1
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listFactureDetailRC(object: any = { code: 'null' }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/detail/all/rc?code=${object.code}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.facturesDetailRC
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listEntreesR1(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.mouvementsEntreeR1
        result.total = response.data.data.mouvementsEntreeR1Number
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listEntreesRC(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.mouvementsEntreeRC
        result.total = response.data.data.mouvementsEntreeRCNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listEntreesR1Dispo(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all/dispo?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.mouvementsEntreeR1Dispo
        result.total = response.data.data.mouvementsEntreeR1DispoNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async listEntreesRCDispo(object: any = { page: 1, length: 10 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all/dispo?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.mouvementsEntreeRCDispo
        result.total = response.data.data.mouvementsEntreeRCDispoNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  async readAllProduits(object: any = { page: 1, length: 500 }) {
    const result = {
      success: false,
      code: -1,
      status: '',
      description: '',
      data: [],
      total: ''
    }

    try {
      const response = await axios.get(`${this.url}/all?page=${object.page}&length=${object.length}`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      // console.log(`${this.url}/all`);

      if (response.data.status === 200) {
        result.success = true
        result.code = response.data.status
        result.data = response.data.data.produits
        result.total = response.data.data.produitNumber
      } else {
        result.description = response.data.description
      }
    } catch (error) {
      console.error('Error fetching data:', error)

      // Handle general network errors or other exceptions
      result.description = 'Une erreur est survenue.'
    }

    return result
  }

  errorManagement(error: any) {
    console.log(' error  :: ', error)
  }
}
