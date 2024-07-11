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
    path: '/gestion-depot/dashboard'
  }

  const Configuration = {
    title: 'Configuration',
    icon: 'tabler:affiliate',
    children: [
      {
        title: `Liste des models`,
        path: '/gestion-depot/models/list'
      },
      {
        title: `Liste des clients`,
        path: '/gestion-depot/clients/list'
      },
      {
        title: `Liste des fournisseurs`,
        path: '/gestion-depot/fournisseurs/list'
      },
      {
        title: `Liste des produits`,
        path: '/gestion-depot/produits/list'
      }
    ]
  }

  const Stock = {
    title: 'Stock',
    icon: 'tabler:affiliate',
    children: [
      {
        title: `Stock Entree`,
        path: '/gestion-depot/entreeR1/list'
      },
      {
        title: `Stock Disponible`,
        path: '/gestion-depot/stockDispoR1'
      }
    ]
  }
  const Model = {
    title: 'Liste des models',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/models/list'
  }

  const Client = {
    title: 'Liste des clients',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/clients/list'
  }

  const Fournisseur = {
    title: 'Liste des fournisseurs',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/fournisseurs/list'
  }

  const Produit = {
    title: 'Liste des produits',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/produits/list'
  }

  const ProduitRc = {
    title: 'Liste des produits - RC',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/rc/produitsrc/list'
  }

  const StockEntree = {
    title: 'Stock Entree',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/entreeR1/list'
  }

  const StockEntreeR1Dispo = {
    title: 'Stock Disponible',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/stockDispoR1'
  }

  const Facturation = {
    title: 'Facturation',
    icon: 'tabler:affiliate',
    children: [
      {
        title: `Facture en cours`,
        path: '/gestion-depot/factureEnCours'
      },
      {
        title: `Liste factures`,
        path: '/gestion-depot/factures/list'
      }
    ]
  }
  // const FactureEnCours = {
  //   title: `Facture en cours`,
  //   icon: 'tabler:affiliate',
  //   path: '/gestion-depot/factureEnCours'
  // }

  // const Factures = {
  //   title: `Liste des factures`,
  //   icon: 'tabler:affiliate',
  //   path: '/gestion-depot/factures/list'
  // }

  const Reglements = {
    title: 'Règlements',
    icon: 'tabler:affiliate',
    children: [
      {
        title: `Liste Règlements`,
        path: '/gestion-depot/reglements/list'
      },
      {
        title: `Situation Règlements`,
        path: '/gestion-depot/reglements/situation'
      }
    ]
  }
  // const Reglements = {
  //   title: `Liste des Règlements`,
  //   icon: 'tabler:affiliate',
  //   path: '/gestion-depot/reglements/list'
  // }

  // const Situation = {
  //   title: `Situation des Règlements`,
  //   icon: 'tabler:affiliate',
  //   path: '/gestion-depot/reglements/situation'
  // }

  const StockEntreeRC = {
    title: 'Stock Entree - RC',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/rc/entreeRC/list'
  }

  const StockEntreeRCDispo = {
    title: 'Stock Disponible - RC',
    icon: 'tabler:affiliate',
    path: '/gestion-depot/rc/stockDispoRC'
  }

  const FactureEnCoursrc = {
    title: `Facture en cours - RC`,
    icon: 'tabler:affiliate',
    path: '/gestion-depot/rc/factureEnCours'
  }

  const Facturesrc = {
    title: `Liste des factures - RC`,
    icon: 'tabler:affiliate',
    path: '/gestion-depot/rc/factures/list'
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
        path: '/gestion-depot/statistiques/listeDesVentes/'
      },
      {
        title: 'Liste des produits',
        path: '/gestion-depot/statistiques/listeDesProduits/'
      },
      {
        title: 'Caisse mensuelle',
        path: '/gestion-depot/statistiques/listeCaisseMensuelle'
      },
      {
        title: 'Stat Producteurs - R1',
        path: '/gestion-depot/statistiques/listeDesStatsParProducteursR1/'
      },
      {
        title: 'Stat Producteurs - RC',
        path: '/gestion-depot/statistiques/listeDesStatsParProducteursRC/'
      },
      {
        title: 'Archivage facture - R1',
        path: '/gestion-depot/statistiques/listeDesArchivesFactureR1/'
      },
      {
        title: 'Archivage facture - RC',
        path: '/gestion-depot/statistiques/listeDesArchivesFactureRC/'
      },
      {
        title: 'Invent. stock vente - R1',
        path: '/gestion-depot/statistiques/listeDesInventairesStockVenteR1/'
      },
      {
        title: 'Invent. stock vente - RC',
        path: '/gestion-depot/statistiques/listeDesInventairesStockVenteRC/'
      }
    ]
  }

  const Users = {
    title: `Liste des utilisateurs`,
    icon: 'tabler:affiliate',
    path: '/gestion-depot/users/list'
  }

  const navArray: any = [Dashboard, {}]

  // SUPER-ADMIN
  godMode && navArray.push(Configuration)
  // godMode && navArray.push(Fournisseur)
  // godMode && navArray.push(Client)
  // godMode && navArray.push(Produit)

  godMode && navArray.push(Stock)
  // godMode && navArray.push(StockEntreeR1Dispo)
  godMode && navArray.push(Facturation)

  // godMode && navArray.push(SeparatorRC)
  // godMode && navArray.push(ProduitRc)
  // godMode && navArray.push(StockEntreeRC)
  // godMode && navArray.push(StockEntreeRCDispo)
  // godMode && navArray.push(FactureEnCoursrc)

  // godMode && navArray.push(Separator)
  // godMode && navArray.push(Factures)
  godMode && navArray.push(Reglements)
  godMode && navArray.push(Users)

  godMode && navArray.push(Separator)
  godMode && navArray.push(Statistiques)

  // GERANT
  gerantMode && navArray.push(Model)
  gerantMode && navArray.push(Fournisseur)
  gerantMode && navArray.push(Client)

  gerantMode && navArray.push(SeparatorR1)
  gerantMode && navArray.push(Produit)
  gerantMode && navArray.push(StockEntree)
  gerantMode && navArray.push(StockEntreeR1Dispo)
  gerantMode && navArray.push(Facturation)

  gerantMode && navArray.push(SeparatorRC)
  gerantMode && navArray.push(ProduitRc)
  gerantMode && navArray.push(StockEntreeRC)
  gerantMode && navArray.push(StockEntreeRCDispo)
  gerantMode && navArray.push(FactureEnCoursrc)

  gerantMode && navArray.push(Separator)
  // gerantMode && navArray.push(Factures)
  gerantMode && navArray.push(Reglements)

  gerantMode && navArray.push(Separator)
  gerantMode && navArray.push(Statistiques)

  // gerantMode && navArray.push(Facturesrc)
  // gerantMode && navArray.push(Reglementsrc)

  // ADMINISTRATEUR
  adminMode && navArray.push(Model)
  adminMode && navArray.push(Fournisseur)
  adminMode && navArray.push(Client)

  adminMode && navArray.push(Separator)
  adminMode && navArray.push(Produit)
  adminMode && navArray.push(StockEntree)
  adminMode && navArray.push(StockEntreeR1Dispo)
  adminMode && navArray.push(Facturation)

  adminMode && navArray.push(Separator)
  adminMode && navArray.push(ProduitRc)
  adminMode && navArray.push(StockEntreeRC)
  adminMode && navArray.push(StockEntreeRCDispo)
  adminMode && navArray.push(FactureEnCoursrc)

  adminMode && navArray.push(Separator)
  // adminMode && navArray.push(Factures)
  adminMode && navArray.push(Reglements)

  // adminMode && navArray.push(Facturesrc)
  // adminMode && navArray.push(Reglementsrc)

  adminMode && navArray.push(Users)

  adminMode && navArray.push(Separator)
  adminMode && navArray.push(Statistiques)

  // FACTURIER-R1
  facturierR1Mode && navArray.push(StockEntreeR1Dispo)
  facturierR1Mode && navArray.push(Facturation)
  // facturierR1Mode && navArray.push(Factures)
  facturierR1Mode && navArray.push(Statistiques)

  // FACTURIER-RC
  facturierRCMode && navArray.push(StockEntreeRCDispo)
  facturierRCMode && navArray.push(FactureEnCoursrc)
  facturierRCMode && navArray.push(Facturesrc)
  facturierRCMode && navArray.push(Statistiques)

  return navArray
}

export default navigation
