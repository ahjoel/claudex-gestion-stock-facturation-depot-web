// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Types
import { AppBarSearchType } from 'src/@fake-db/types'

const searchData: AppBarSearchType[] = [
  {
    id: 1,
    url: '/unknow/dashboard',
    icon: 'tabler:smart-home',
    title: 'Dashboard',
    category: 'dashboards'
  },
  {
    id: 4,
    url: '/unknow/transactions/list',
    icon: 'tabler:adjustments-dollar',
    title: 'Transaction history',
    category: 'appsPages'
  },
  {
    id: 5,
    url: '/unknow/points-of-sale/list',
    icon: 'tabler:brand-cashapp',
    title: 'List of POS',
    category: 'appsPages'
  },
  {
    id: 6,
    url: '/unknow/agencies/list',
    icon: 'tabler:map-pin-dollar',
    title: 'List of Agencies',
    category: 'appsPages'
  },
  {
    id: 7,
    url: '/unknow/partners/list',
    icon: 'tabler:affiliate',
    title: 'List of partners',
    category: 'appsPages'
  },
  {
    id: 8,
    url: '/unknow/users/list',
    icon: 'tabler:users',
    title: 'Users List',
    category: 'appsPages'
  },
  {
    id: 98,
    url: '/unknow/app-settings',
    icon: 'tabler:settings-star',
    title: 'Settings',
    category: 'formsTables'
  }
]

// ** GET Search Data
mock.onGet('/app-bar/search').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const exactData: { [k: string]: AppBarSearchType[] } = {
    dashboards: [],
    appsPages: [],
    userInterface: [],
    formsTables: [],
    chartsMisc: []
  }

  const includeData: { [k: string]: AppBarSearchType[] } = {
    dashboards: [],
    appsPages: [],
    userInterface: [],
    formsTables: [],
    chartsMisc: []
  }

  searchData.forEach(obj => {
    const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
    if (isMatched && exactData[obj.category].length < 5) {
      exactData[obj.category].push(obj)
    }
  })

  searchData.forEach(obj => {
    const isMatched =
      !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
    if (isMatched && includeData[obj.category].length < 5) {
      includeData[obj.category].push(obj)
    }
  })

  const categoriesCheck: string[] = []

  Object.keys(exactData).forEach(category => {
    if (exactData[category].length > 0) {
      categoriesCheck.push(category)
    }
  })
  if (categoriesCheck.length === 0) {
    Object.keys(includeData).forEach(category => {
      if (includeData[category].length > 0) {
        categoriesCheck.push(category)
      }
    })
  }

  const resultsLength = categoriesCheck.length === 1 ? 5 : 3

  return [
    200,
    [
      ...exactData.dashboards.concat(includeData.dashboards).slice(0, resultsLength),
      ...exactData.appsPages.concat(includeData.appsPages).slice(0, resultsLength),
      ...exactData.userInterface.concat(includeData.userInterface).slice(0, resultsLength),
      ...exactData.formsTables.concat(includeData.formsTables).slice(0, resultsLength),
      ...exactData.chartsMisc.concat(includeData.chartsMisc).slice(0, resultsLength)
    ]
  ]
})
