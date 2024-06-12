// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  const userProfil = window.localStorage.getItem('profile')
  const godMode = userProfil === 'SUPER-ADMIN' ? true : false
  const adminMode = userProfil === 'ADMINISTRATEUR' ? true : false
  const facturierR1Mode = userProfil === 'FACTURIER-R1' ? true : false
  const facturierRCMode = userProfil === 'FACTURIER-RC' ? true : false

  // const facturierRCMode = userProfil === 'FACTURIER-RC' ? true : false
  const gerantMode = userProfil === 'GERANT' ? true : false

  // const cartProductsNumber = localStorage.getItem('cart')?.length

  const Dashboard = {
    title: 'Dashboards',
    icon: 'tabler:smart-home',
    path: '/gestion-bars/dashboard'
  }

  const Model = {
    title: 'Liste des models',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/models/list'
  }

  const Fournisseur = {
    title: 'Liste des fournisseurs',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/fournisseurs/list'
  }

  const Produit = {
    title: 'Liste des produits',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/produits/list'
  }

  const StockEntreeR1 = {
    title: 'Stock Entree - R1',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/entreeR1/list'
  }

  const StockEntreeR1Dispo = {
    title: 'Stock Disponible - R1',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/stockDispoR1'
  }

  const FactureEnCours = {
    title: `Facture en cours - R1`,
    icon: 'tabler:affiliate',
    path: '/gestion-bars/factureEnCours'
  }

  const Factures = {
    title: `Liste des factures`,
    icon: 'tabler:affiliate',
    path: '/gestion-bars/factures/list'
  }

  const Reglements = {
    title: `Règlements`,
    icon: 'tabler:affiliate',
    path: '/gestion-bars/reglements/list'
  }

  const StockEntreeRC = {
    title: 'Stock Entree - RC',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/rc/entreeRC/list'
  }

  const StockEntreeRCDispo = {
    title: 'Stock Disponible - RC',
    icon: 'tabler:affiliate',
    path: '/gestion-bars/rc/stockDispoRC'
  }

  const FactureEnCoursrc = {
    title: `Facture en cours - RC`,
    icon: 'tabler:affiliate',
    path: '/gestion-bars/rc/factureEnCours'
  }

  const Facturesrc = {
    title: `Liste des factures - RC`,
    icon: 'tabler:affiliate',
    path: '/gestion-bars/rc/factures/list'
  }

  const SeparatorR1 = {
    title: `======R1======`,
    icon: ''
  }

  const SeparatorRC = {
    title: `======RC======`,
    icon: ''
  }

  const Separator = {
    title: `============`,
    icon: ''
  }

  const Statistiques = {
    title: 'Statistiques',
    icon: 'tabler:file-plus',
    children: [
      {
        title: 'Statistique des ventes',
        path: '/gestion-bars/statistiques/listeDesVentes/'
      },
      {
        title: 'Stats par producteurs',
        path: '/device-financing/orders/list'
      },
      {
        title: 'Liste des produits',
        path: '/gestion-bars/statistiques/listeDesProduits/'
      },
      {
        title: 'Archivage facture',
        path: '/device-financing/orders/list'
      },
      {
        title: 'Inventaire stock vente',
        path: '/device-financing/orders/list'
      },
      {
        title: 'Caisse mensuelle',
        path: '/device-financing/orders/list'
      }
    ]
  }

  const Users = {
    title: `Liste des utilisateurs`,
    icon: 'tabler:affiliate',
    path: '/gestion-bars/users/list'
  }

  const navArray: any = [Dashboard, {}]

  // SUPER-ADMIN
  godMode && navArray.push(Model)
  godMode && navArray.push(Fournisseur)
  godMode && navArray.push(Produit)

  godMode && navArray.push(SeparatorR1)
  godMode && navArray.push(StockEntreeR1)
  godMode && navArray.push(StockEntreeR1Dispo)
  godMode && navArray.push(FactureEnCours)

  godMode && navArray.push(SeparatorRC)
  godMode && navArray.push(StockEntreeRC)
  godMode && navArray.push(StockEntreeRCDispo)
  godMode && navArray.push(FactureEnCoursrc)

  godMode && navArray.push(Separator)
  godMode && navArray.push(Factures)
  godMode && navArray.push(Reglements)
  godMode && navArray.push(Users)

  godMode && navArray.push(Separator)
  godMode && navArray.push(Statistiques)

  // GERANT
  gerantMode && navArray.push(Model)
  gerantMode && navArray.push(Fournisseur)
  gerantMode && navArray.push(Produit)

  gerantMode && navArray.push(SeparatorR1)
  gerantMode && navArray.push(StockEntreeR1)
  gerantMode && navArray.push(StockEntreeR1Dispo)
  gerantMode && navArray.push(FactureEnCours)

  gerantMode && navArray.push(SeparatorRC)
  gerantMode && navArray.push(StockEntreeRC)
  gerantMode && navArray.push(StockEntreeRCDispo)
  gerantMode && navArray.push(FactureEnCoursrc)

  gerantMode && navArray.push(Separator)
  gerantMode && navArray.push(Factures)
  gerantMode && navArray.push(Reglements)

  gerantMode && navArray.push(Separator)
  gerantMode && navArray.push(Statistiques)

  // gerantMode && navArray.push(Facturesrc)
  // gerantMode && navArray.push(Reglementsrc)

  // ADMINISTRATEUR
  adminMode && navArray.push(Model)
  adminMode && navArray.push(Fournisseur)
  adminMode && navArray.push(Produit)

  adminMode && navArray.push(StockEntreeR1)
  adminMode && navArray.push(StockEntreeR1Dispo)
  adminMode && navArray.push(FactureEnCours)

  adminMode && navArray.push(StockEntreeRC)
  adminMode && navArray.push(StockEntreeRCDispo)
  adminMode && navArray.push(FactureEnCoursrc)

  adminMode && navArray.push(Separator)
  adminMode && navArray.push(Factures)
  adminMode && navArray.push(Reglements)

  // adminMode && navArray.push(Facturesrc)
  // adminMode && navArray.push(Reglementsrc)

  adminMode && navArray.push(Users)

  adminMode && navArray.push(Separator)
  adminMode && navArray.push(Statistiques)

  // FACTURIER-R1
  facturierR1Mode && navArray.push(StockEntreeR1Dispo)
  facturierR1Mode && navArray.push(FactureEnCours)
  facturierR1Mode && navArray.push(Factures)
  facturierR1Mode && navArray.push(Statistiques)

  // FACTURIER-RC
  facturierRCMode && navArray.push(StockEntreeRCDispo)
  facturierRCMode && navArray.push(FactureEnCoursrc)
  facturierRCMode && navArray.push(Facturesrc)
  facturierRCMode && navArray.push(Statistiques)

  return navArray
}

export default navigation
