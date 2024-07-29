// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  const userProfil = window.localStorage.getItem("profile");
  const godMode = userProfil === "SUPER-ADMIN" ? true : false;
  const adminMode = userProfil === "ADMINISTRATEUR" ? true : false;
  const gerantMode = userProfil === "GERANT" ? true : false;
  const facturierMode = userProfil === "FACTURIER" ? true : false;
  const caissierMode = userProfil === "CAISSIER" ? true : false;

  const Dashboard = {
    title: "Dashboards",
    icon: "tabler:smart-home",
    path: "/gestion-depot/dashboard",
  };

  const Configuration = {
    title: "Configuration",
    icon: "tabler:settings",
    children: [
      {
        title: `Liste des models`,
        path: "/gestion-depot/models/list",
      },
      {
        title: `Liste des clients`,
        path: "/gestion-depot/clients/list",
      },
      {
        title: `Liste des fournisseurs`,
        path: "/gestion-depot/fournisseurs/list",
      },
      {
        title: `Liste des produits`,
        path: "/gestion-depot/produits/list",
      },
    ],
  };

  const Stock = {
    title: "Stock",
    icon: "tabler:package",
    children: [
      {
        title: `Stock Entree`,
        path: "/gestion-depot/entreeR1/list",
      },
      {
        title: `Stock Disponible`,
        path: "/gestion-depot/stockDispoR1",
      },
    ],
  };

  const Facturation = {
    title: "Facturation",
    icon: "tabler:clipboard-text",
    children: [
      {
        title: `Facture en cours`,
        path: "/gestion-depot/factureEnCours",
      },
      {
        title: `Liste factures`,
        path: "/gestion-depot/factures/list",
      },
    ],
  };

  const Reglements = {
    title: "Règlements",
    icon: "tabler:currency-dollar",
    children: [
      {
        title: `Liste Règlements`,
        path: "/gestion-depot/reglements/list",
      },
      {
        title: `Situation Règlements`,
        path: "/gestion-depot/reglements/situation",
      },
    ],
  };

  const Statistiques = {
    title: "Statistiques",
    icon: "tabler:file-plus",
    children: [
      {
        title: "Statistique des factures",
        path: "/gestion-depot/statistiques/listeDesFactures/",
      },
      {
        title: "Statistique des ventes",
        path: "/gestion-depot/statistiques/listeDesReglements/",
      },
      {
        title: "Factures archivees",
        path: "/gestion-depot/statistiques/listeDesFacturesArchivees/",
      },
      {
        title: "Suivi Factures impayées",
        path: "/gestion-depot/statistiques/listeDesFacturesRestePenalite/",
      },
      {
        title: "Invent. stock vente",
        path: "/gestion-depot/statistiques/listeDesFacturesStockGene/",
      },
      {
        title: "Caisse Mensuelle",
        path: "/gestion-depot/statistiques/listeDesReglementPerMonth/",
      },
    ],
  };

  const Users = {
    title: `Liste des utilisateurs`,
    icon: "tabler:users",
    path: "/gestion-depot/users/list",
  };

  const navArray: any = [Dashboard, {}];

  // SUPER-ADMIN
  godMode && navArray.push(Configuration);
  godMode && navArray.push(Stock);
  godMode && navArray.push(Facturation);
  godMode && navArray.push(Reglements);
  godMode && navArray.push(Users);
  godMode && navArray.push(Statistiques);

  // GERANT
  gerantMode && navArray.push(Configuration);
  gerantMode && navArray.push(Stock);
  gerantMode && navArray.push(Facturation);
  gerantMode && navArray.push(Reglements);
  gerantMode && navArray.push(Statistiques);

  // ADMINISTRATEUR
  adminMode && navArray.push(Configuration);
  adminMode && navArray.push(Stock);
  adminMode && navArray.push(Facturation);
  adminMode && navArray.push(Reglements);
  adminMode && navArray.push(Users);
  adminMode && navArray.push(Statistiques);

  // FACTURIER
  const stockDisponibleOnly = {
    title: Stock.title,
    icon: Stock.icon,
    children: [
      {
        title: `Stock Disponible`,
        path: "/gestion-depot/stockDispoR1",
      },
    ],
  };
  facturierMode && navArray.push(stockDisponibleOnly);
  facturierMode && navArray.push(Facturation);

  // CAISSIER
  caissierMode && navArray.push(Reglements);
  caissierMode && navArray.push(Statistiques);

  return navArray;
};

export default navigation;
