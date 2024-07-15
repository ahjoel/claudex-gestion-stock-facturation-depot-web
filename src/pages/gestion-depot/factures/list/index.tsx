/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import Icon from "src/@core/components/icon";
import TableHeader from "src/gestion-depot/views/factures/TableHeader";
import { t } from "i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import Facture from "src/gestion-depot/logic/models/Facture";
import FactureService from "src/gestion-depot/logic/services/FactureService";
import AddFactureDrawer from "src/gestion-depot/views/factures/AddFactureDrawer";
import { CircularProgress } from "@mui/material";
import FactureDetail from "src/gestion-depot/logic/models/FactureDetail";
import TableHeaderDetail from "src/gestion-depot/views/factures/TableHeaderDetail";
import ProduitService from "src/gestion-depot/logic/services/ProduitService";
import Produit from "src/gestion-depot/logic/models/Produit";
import AddFactureDetailDrawer from "src/gestion-depot/views/factures/AddFactureDetailDrawer";
import SortieR1Service from "src/gestion-depot/logic/services/SortieR1Service";
import PaymentIcon from "@mui/icons-material/Payment";
import PrintIcon from "@mui/icons-material/Print";
import ClientService from "src/gestion-depot/logic/services/ClientService";
import Client from "src/gestion-depot/logic/models/Client";
import TemplateFacture from "src/gestion-depot/views/pdfMake/TemplateFacture";
import TemplateFactureUnique from "src/gestion-depot/views/pdfMake/TemplateFactureUnique";

interface CellType {
  row: Facture;
}

interface CellTypeFacture {
  row: FactureDetail;
}

interface ColumnType {
  [key: string]: any;
}

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  "*": {
    fontSize: "10px",
    fontFamily: "Times New Roman",
    color: "black",
  },
  "td, th, tr, table": {
    borderTop: "1px solid black",
    borderCollapse: "collapse",
  },
  ".description": {
    width: "180px",
    maxWidth: "180px",
    textAlign: "justify",
  },
  ".quantity": {
    width: "50px",
    maxWidth: "50px",
    wordBreak: "break-all",
    textAlign: "center",
  },
  ".price": {
    width: "65px",
    maxWidth: "65px",
    wordBreak: "break-all",
    textAlign: "center",
  },
  ".total": {
    fontWeight: "bold",
    width: "85px",
    textAlign: "center",
    alignContent: "center",
  },
  ".centered": {
    textAlign: "center",
    alignContent: "center",
  },
  ".colTotal": {
    fontWeight: "bold",
    textAlign: "center",
    alignContent: "center",
  },
  ".ticket": {
    width: "300px",
    maxWidth: "300px",
  },
  img: {
    maxWidth: "inherit",
    width: "inherit",
  },
};

const FactureList = () => {
  const factureService = new FactureService();
  const mouvementService = new SortieR1Service();
  const produitService = new ProduitService();
  const clientService = new ClientService();
  const userData = JSON.parse(
    window.localStorage.getItem("userData") as string
  );
  const profile = userData?.profile;

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false);
  const [sendPayement, setSendPayement] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openPayement, setOpenPayement] = useState<boolean>(false);
  const [openPrint, setOpenPrint] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const handleClosePayement = () => setOpenPayement(false);
  const handleClosePrint = () => setOpenPrint(false);
  const [comfirmationMessage, setComfirmationMessage] = useState<string>("");
  const [comfirmationMessagePayement, setComfirmationMessagePayement] =
    useState<string>("");
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(
    () => console.log(" .... ")
  );
  const [comfirmationPayement, setComfirmationPayement] = useState<() => void>(
    () => console.log(" .... ")
  );

  // const [comfirmationPayementFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handlePayementFacture = (facture: Facture) => {
    setCurrentFacture(facture);
    setComfirmationMessagePayement(
      `Voulez-vous régler la facture ${facture.code} de ${facture.totalfacture} F CFA ?`
    );
    setComfirmationPayement(() => () => payementFacture(facture));
    setOpenPayement(true);
  };

  const payementFacture = async (facture: Facture) => {
    setSendPayement(true);

    const dataSave = {
      facture_id: facture.id,
      total: Number(facture.totalfacture),
    };

    try {
      const response = await factureService.createReglement(dataSave);

      if (response.success) {
        setSendPayement(false);
        handleChange();
        handleClosePayement();
        setOpenNotification(true);
        setTypeMessage("success");
        setMessage("Facture réglée avec succès, vous pouvez le télécharger");
      } else {
        setSendPayement(false);
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Facture non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors du reglement de facture :", error);
      setSendPayement(false);
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue");
    }
  };

  const handleDeleteFacture = (facture: Facture) => {
    setCurrentFacture(facture);
    setComfirmationMessage(
      `Voulez-vous réellement supprimer cette facture : ${facture.code} ?`
    );
    setComfirmationFunction(() => () => deleteFacture(facture));
    setOpen(true);
  };

  const deleteFacture = async (facture: Facture) => {
    setSendDelete(true);

    try {
      const rep = await factureService.delete(facture.id);

      if (rep === null) {
        setSendDelete(false);
        handleChange();
        handleClose();
        setOpenNotification(true);
        setTypeMessage("success");
        setMessage("Facture supprimé avec succes");
      } else {
        setSendDelete(false);
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Facture non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSendDelete(false);
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue");
    }
  };

  const handleDeleteProduitFacture = (facture: FactureDetail) => {
    setCurrentFactureDetail(facture);
    setComfirmationMessage(
      `Voulez-vous réellement supprimer cette facture : ${facture.produit} ?`
    );
    setComfirmationFunction(() => () => deleteFactureDetail(facture));
    setOpen(true);
  };

  const deleteFactureDetail = async (facture: FactureDetail) => {
    setSendDelete(true);

    try {
      const rep = await mouvementService.delete(facture.id);

      if (rep === null) {
        setSendDelete(false);
        handleChange();
        getDetailsFacture();
        handleClose();
        setOpenNotification(true);
        setTypeMessage("success");
        setMessage("Produit supprimé avec succes");
      } else {
        setSendDelete(false);
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Produit non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSendDelete(false);
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue");
    }
  };

  // Search State
  const [value, setValue] = useState<string>("");
  const [valueDetFact, setValueDetFact] = useState<string>("");

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  const handleSuccess = (message: string, type = "success") => {
    setOpenNotification(true);
    setTypeMessage(type);
    const messageTrans = t(message);
    setMessage(messageTrans);
  };

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      setOpenNotification(false);
    }
    setOpenNotification(false);
  };

  // Loading Agencies Data, Datagrid and pagination - State
  const stockR1 = true;
  const [statusFactures, setStatusFactures] = useState<boolean>(true);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [addFactureOpen, setAddFactureOpen] = useState<boolean>(false);
  const [addFactureDetailOpen, setAddFactureDetailOpen] =
    useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(40);
  const [currentFacture, setCurrentFacture] = useState<null | Facture>(null);
  const [currentFactureDetail, setCurrentFactureDetail] =
    useState<null | FactureDetail>(null);

  const [openFacture, setOpenFacture] = useState(false);
  const [statusFactureDetail, setStatusFactureDetail] = useState<boolean>(true);
  const [statusFactureDetailPrint, setStatusFactureDetailPrint] =
    useState<boolean>(true);
  const [facturesDetails, setFacturesDetails] = useState<FactureDetail[]>([]);
  const [facturesDetailsPrint, setFacturesDetailsPrint] = useState<
    FactureDetail[]
  >([]);
  const [factureReceipt, setFactureReceipt] = useState<FactureDetail[]>([]);
  const [dateFacture, setDateFacture] = useState<string>("");
  const [remise, setRemise] = useState<string>("");
  const [auteur, setAuteur] = useState<string>("");
  const [clientFact, setClientFact] = useState<string>("");

  const [code, setCode] = useState<string>("");
  const [etatFacture, setEtatFacture] = useState<string>("");

  const [idFacture, setIdFacture] = useState<number>(-1);
  const [totalFacture, setTotalFacture] = useState<string>("");
  const [columnsFacture, setColumnsFacture] = useState<ColumnType[]>([]);
  const [paginationModelFacture, setPaginationModelFacture] = useState({
    page: 0,
    pageSize: 10,
  });

  
  const [downloadCount, setDownloadCount] = useState(0);
  // console.log("download :::", downloadCount)

  const handleDownload = async () => {
    setDownloadCount(downloadCount + 1);
  };

  // const handleCloseFacture = () => setOpenFacture(false);

  const handleOpenModalFacture = (
    arecode: string,
    etat: string,
    idFact: number
  ) => {
    setCode(arecode);
    setEtatFacture(etat);
    setIdFacture(idFact);
    setOpenFacture(true);
    setDownloadCount(0);
  };

  const handleOpenModalPrintFacture = (
    arecode: string,
    totalfacture: string
  ) => {
    setCode(arecode);
    setTotalFacture(totalfacture);
    setOpenPrint(true);
  };

  // Display of columns according to user roles in the Datagrid
  const getColumns = (
    handleUpdateFacture: (facture: Facture) => void,
    handleDeleteFacture: (facture: Facture) => void,
    handlePayementFacture: (facture: Facture) => void
  ) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.15,
        field: "code",
        renderHeader: () => (
          <Tooltip title="Code">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Code
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { code } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "normal",
                    textAlign: "left",
                  }}
                >
                  {code}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "createdAt",
        renderHeader: () => (
          <Tooltip title="Date creation">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Date creation
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { createdAt } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "normal",
                    textAlign: "left",
                  }}
                >
                  {createdAt.slice(0, -5).replace(/T/g, " ")}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "client",
        renderHeader: () => (
          <Tooltip title="Client">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Client
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { client } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                    whiteSpace: "normal",
                    textAlign: "left",
                  }}
                >
                  {client.toString()}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.1,
        field: "tax",
        renderHeader: () => (
          <Tooltip title="Tax">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Tax
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { taxe } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {taxe}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "nbproduit",
        renderHeader: () => (
          <Tooltip title="NB Pdt(s)">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              NB Produit
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { nbproduit } = row;

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                    textAlign: "center",
                  }}
                >
                  {nbproduit}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "totalfacture",
        renderHeader: () => (
          <Tooltip title="Total Facture">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Total Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { totalfacture } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {totalfacture}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "remise",
        renderHeader: () => (
          <Tooltip title="Remise">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Remise Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { remise } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {remise}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "totalApres",
        renderHeader: () => (
          <Tooltip title="Mtant. A Payer">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Mt a payer
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { totalfacture, remise } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {Number(totalfacture) - remise}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.18,
        sortable: false,
        field: "actions",
        renderHeader: () => (
          <Tooltip title={t("Actions")}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              {t("Actions")}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Tooltip title="Régler la facture">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  {
                    handlePayementFacture(row);
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  <Icon icon="tabler:currency-dollar" />
                </Box>
              </IconButton>
            </Tooltip> */}
            <Tooltip title={"Afficher détail facture"}>
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  handleOpenModalFacture(row.code, "", row.id);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  <Icon icon="tabler:list" />
                </Box>
              </IconButton>
            </Tooltip>
            <Tooltip title="Mettre à jour la facture">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  handleUpdateFacture(row);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.success.main,
                  }}
                >
                  <Icon icon="tabler:edit" />
                </Box>
              </IconButton>
            </Tooltip>

            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  handleDeleteFacture(row);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.error.main,
                  }}
                >
                  <Icon icon="tabler:trash" />
                </Box>
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Voir la facture">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() =>
                  handleOpenModalPrintFacture(row.code, row.totalfacture)
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  <Icon icon="tabler:file-plus" />
                </Box>
              </IconButton>
            </Tooltip> */}
            {/* <Tooltip title="Imprimer la facture">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => handleDownload(row.code)}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  <Icon icon="tabler:file-plus" />
                </Box>
              </IconButton>
            </Tooltip> */}
          </Box>
        ),
      },
    ];

    return colArray;
  };

  const getColumnsFactureDetail = (
    handleDeleteProduitFacture: (facture: FactureDetail) => void
  ) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.15,
        field: "produit",
        renderHeader: () => (
          <Tooltip title="Produit">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Produit
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { produit } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "secondary.main",
                  }}
                >
                  {produit}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "modele",
        renderHeader: () => (
          <Tooltip title="Modèle">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Modèle
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { modele } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "secondary.main",
                  }}
                >
                  {modele}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "fournisseur",
        renderHeader: () => (
          <Tooltip title="Fournisseur">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Fournisseur
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { fournisseur } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "secondary.main",
                  }}
                >
                  {fournisseur}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.1,

        // minWidth: 50,
        field: "qte",
        renderHeader: () => (
          <Tooltip title="Quantité">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
                whiteSpace: "normal",
                textAlign: "left",
              }}
            >
              Quantité
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { qte } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "secondary.main",
                  }}
                >
                  {qte}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.1,

        // minWidth: 50,
        field: "pv",
        renderHeader: () => (
          <Tooltip title="Prix de vente">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
                whiteSpace: "normal",
                textAlign: "left",
              }}
            >
              Prix de vente
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { pv } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "secondary.main",
                  }}
                >
                  {pv}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
    ];
    // if (etatFacture === "impayée") {
    colArray.push({
      flex: 0.1,
      minWidth: 50,
      sortable: false,
      field: "action",
      renderHeader: () => (
        <Tooltip title={t("Action")}>
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: "0.8125rem",
            }}
          >
            {t("Action")}
          </Typography>
        </Tooltip>
      ),
      renderCell: ({ row }: CellTypeFacture) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Mettre à jour un produit de facture">
            <IconButton
              size="small"
              sx={{ color: "text.primary" }}
              onClick={() => {
                // handleUpdateProduitFacture(row)
              }}
            >
              {/* <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                    <Icon icon='tabler:edit' />
                  </Box> */}
            </IconButton>
          </Tooltip>

          {/* {etatFacture === "impayée" && ( */}
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              sx={{ color: "text.primary" }}
              onClick={() => {
                handleDeleteProduitFacture(row);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  color: (theme) => theme.palette.error.main,
                }}
              >
                <Icon icon="tabler:trash" />
              </Box>
            </IconButton>
          </Tooltip>
          {/* )} */}
        </Box>
      ),
    });
    // }

    return colArray;
  };

  // Axios call to loading Data
  const getListFactures = async (page: number, pageSize: number) => {
    const result = await factureService.listFactures({
      page: page + 1,
      length: pageSize,
    });

    if (result.success) {
      const queryLowered = value.toLowerCase();
      const filteredData = (result.data as Facture[]).filter((facture) => {
        return (
          facture.code.toString().toLowerCase().includes(queryLowered) ||
          facture.createdAt.toLowerCase().includes(queryLowered) ||
          facture.client.toString().toLowerCase().includes(queryLowered) ||
          facture.taxe.toString().toLowerCase().includes(queryLowered) ||
          facture.nbproduit.toLowerCase().includes(queryLowered)
        );
      });

      setFactures(filteredData);
      setStatusFactures(false);
      setTotal(Number(result.total));
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  const getDetailsFacture = async () => {
    setStatusFactureDetail(true);
    const result = await factureService.listFactureDetail({
      code: code || null,
    });

    if (result.success) {
      setStatusFactureDetail(false);
      const queryLowered = valueDetFact.toLowerCase();
      const filteredData = (result.data as FactureDetail[]).filter((detail) => {
        return (
          detail.produit.toLowerCase().includes(queryLowered) ||
          detail.modele.toLowerCase().includes(queryLowered) ||
          detail.fournisseur.toLowerCase().includes(queryLowered) ||
          detail.qte.toString().toLowerCase().includes(queryLowered) ||
          detail.pv.toString().toLowerCase().includes(queryLowered)
        );
      });
      setFacturesDetails(filteredData);
      // Facture à Imprimer
      setFactureReceipt(result.data as FactureDetail[]);

      const dataFact = result.data as FactureDetail[];
      // console.log('dataFact ::::', dataFact);
      
      const dateStr = dataFact[0]?.created_at;
      const dateObj = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      const formattedDate = dateObj.toLocaleDateString('fr-FR', options);
      setDateFacture(formattedDate)
      setClientFact(dataFact[0]?.client)
      setAuteur(dataFact[0]?.username)
      setRemise(dataFact[0]?.remise)
      setStatusFactures(false);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(
        "Une erreur est survenue lors du chargement des produits de facture"
      );
    }
  };

  const handlePrint = () => {
    // Masquer les éléments que vous ne souhaitez pas imprimer
    const dialogActions = document.querySelector(
      ".dialog-actions-dense"
    ) as HTMLElement | null;
    if (dialogActions) {
      dialogActions.style.display = "none";
    }

    // Imprimer la fenêtre actuelle
    window.print();

    // Rétablir l'affichage des éléments masqués après l'impression
    if (dialogActions) {
      dialogActions.style.display = "flex";
    }
  };

  const getDetailsFactureForPrint = async () => {
    setStatusFactureDetailPrint(true);
    const result = await factureService.listFactureDetail({
      code: code || null,
    });

    if (result.success) {
      setStatusFactureDetailPrint(false);
      setFacturesDetailsPrint(result.data as FactureDetail[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(
        "Une erreur est survenue lors du chargement des produits de facture"
      );
    }
  };

  const handleChange = async () => {
    getListFactures(0, 10);
  };

  const handleChangeFactureAndDetail = async () => {
    getListFactures(0, 10);
    getDetailsFacture();
  };

  const handleLoadingClients = async () => {
    const result = await clientService.listClientslongue();

    if (result.success) {
      setClients(result.data as Client[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  const handleLoadingProduits = async () => {
    const result = await produitService.listProduitsLongue();

    if (result.success) {
      setProduits(result.data as Produit[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  // Control search data in datagrid
  useEffect(() => {
    handleChange();
    handleLoadingProduits();
    handleLoadingClients();
    setColumns(
      getColumns(
        handleUpdateFacture,
        handleDeleteFacture,
        handlePayementFacture
      )
    );
  }, [value]);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  useEffect(() => {
    getDetailsFacture();
    setColumnsFacture(getColumnsFactureDetail(handleDeleteProduitFacture));
    getDetailsFactureForPrint();
  }, [code, valueDetFact]);

  const handleFilterDet = useCallback((valFact: string) => {
    setValueDetFact(valFact);
  }, []);

  // Show Modal
  const toggleAddFactureDrawer = () => setAddFactureOpen(!addFactureOpen);
  const toggleAddFactureDetailDrawer = () =>
    setAddFactureDetailOpen(!addFactureDetailOpen);

  // Update Data
  const handleUpdateFacture = (facture: Facture) => {
    setCurrentFacture(facture);
    toggleAddFactureDrawer();
  };

  const handleAddProduitFacture = () => {
    setOpenFacture(false);
    setCurrentFactureDetail(null);
    toggleAddFactureDetailDrawer();
  };

  // Pagination
  useEffect(() => {
    getListFactures(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            onReload={() => {
              setValue("");
              handleChange();
            }}
          />
          {downloadCount > 0 && (
              factureReceipt.length > 15 ?
              (<TemplateFactureUnique
                data={factureReceipt as never[]}
                auteur={auteur}
                client={clientFact}
                remise={remise}
                code={code}
                dateFact={dateFacture}
                fileName={`FACTURE_${code}`}
              />) : 
              (<TemplateFacture
                data={factureReceipt as never[]}
                auteur={auteur}
                client={clientFact}
                remise={remise}
                code={code}
                dateFact={dateFacture}
                fileName={`FACTURE_${code}`}
              />)
            )}
          <DataGrid
            autoHeight
            loading={statusFactures}
            rowHeight={62}
            rows={factures as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>

        {/* Modal List of Detail Facture */}
        <Dialog
          fullWidth
          open={openFacture}
          maxWidth="md"
          scroll="body"
          onClose={() => {
            setOpenFacture(false);
          }}
        >
          <DialogContent
            sx={{
              position: "relative",
              px: (theme) => [
                `${theme.spacing(2)} !important`,
                `${theme.spacing(6)} !important`,
              ],
              py: (theme) => [
                `${theme.spacing(8)} !important`,
                `${theme.spacing(10)} !important`,
              ],
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                setOpenFacture(false);
              }}
              sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <Icon icon="tabler:x" />
            </IconButton>
            <Box sx={{ mb: 0.5, textAlign: "center" }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {"Liste des produits de la facture "} - {code}
              </Typography>
            </Box>

            <TableHeaderDetail
              value={valueDetFact}
              onDownload={handleDownload}
              handleFilterDetail={handleFilterDet}
              toggle={handleAddProduitFacture}
              etatFacture={etatFacture}
            />
            
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ height: 500, width: "100%" }}>
                {statusFactureDetail ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <DataGrid
                    loading={statusFactureDetail}
                    rows={facturesDetails as never[]}
                    columns={columnsFacture as GridColDef<never>[]}
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 25, 50]}
                    pagination
                    paginationModel={paginationModelFacture}
                    onPaginationModelChange={setPaginationModelFacture}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Print Facture Modal */}
        {/* <PrintReceiptDialog open={openPrint} closeDialog={handleClosePrint} codeFact={code} totalFacture={totalFacture} /> */}

        {/*  */}
        <Dialog
          open={openPrint}
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={(event, reason) => {
            if (reason === "backdropClick") {
              handleClosePrint();
            }
          }}
        >
          <DialogContent sx={{ color: "black" }}>
            <div className="ticket" style={styles[".ticket"]}>
              {/* <img src='./logo.png' alt='Logo' style={styles.img} /> */}
              <p className="centered" style={styles[".centered"]}>
                CLAUDEX-BAR
                <br />
                AGOE AMANDETA EPP Amandeta Face Antenne Togocom
                <br />
                Tel : (+228) 92 80 26 38
              </p>
              <table style={styles["td, th, tr, table"]}>
                <thead>
                  <tr>
                    <th className="quantity" style={styles[".quantity"]}>
                      Qte
                    </th>
                    <th className="description" style={styles[".description"]}>
                      Description
                    </th>
                    <th className="price" style={styles[".price"]}>
                      PV
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!statusFactureDetailPrint ? (
                    facturesDetailsPrint?.map((facturesDetp) => (
                      <tr key={facturesDetp.id}>
                        <td className="quantity" style={styles[".quantity"]}>
                          {facturesDetp.qte}
                        </td>
                        <td
                          className="description"
                          style={styles[".description"]}
                        >
                          {facturesDetp.produit} {facturesDetp.modele}
                        </td>
                        <td className="price" style={styles[".price"]}>
                          {facturesDetp.pv
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                          F
                        </td>
                      </tr>
                    ))
                  ) : (
                    <CircularProgress />
                  )}

                  <tr>
                    <td className="quantity" style={styles[".quantity"]}></td>
                    <td className="description" style={styles[".colTotal"]}>
                      TOTAL (XOF) :{" "}
                    </td>
                    <td className="price" style={styles[".total"]}>
                      {totalFacture
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                      F
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="centered" style={styles[".centered"]}>
                Merci de votre commande !
              </p>
            </div>
          </DialogContent>

          <DialogActions
            className="dialog-actions-dense"
            style={{ visibility: openPrint ? "visible" : "hidden" }}
          >
            <Button
              variant="contained"
              onClick={handleClosePrint}
              color="secondary"
            >
              {t("Cancel")}
            </Button>
            <Button variant="contained" onClick={handlePrint}>
              <span>Imprimer</span> <PrintIcon />
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      {/* Add or Update Right Modal */}
      <AddFactureDrawer
        open={addFactureOpen}
        toggle={toggleAddFactureDrawer}
        onEdit={handleChange}
        clients={clients}
        currentFacture={currentFacture}
        onSuccess={handleSuccess}
      />

      {/* Ajouter un produit sur une facture impayée */}

      <AddFactureDetailDrawer
        open={addFactureDetailOpen}
        toggle={toggleAddFactureDetailDrawer}
        onAdd={handleChangeFactureAndDetail}
        products={produits}
        codeFact={code}
        stock={stockR1}
        factureId={idFacture}
        currentFactureDetail={currentFactureDetail}
        onSuccess={handleSuccess}
      />

      {/* Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openNotification}
        onClose={handleCloseNotification}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={typeMessage as AlertColor}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Delete Modal Confirmation */}
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            handleClose();
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">{t("Confirmation")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t(comfirmationMessage)}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleClose} color="secondary">
            {t("Cancel")}
          </Button>
          <LoadingButton
            onClick={() => {
              comfirmationFunction();
            }}
            loading={sendDelete}
            endIcon={<DeleteIcon />}
            variant="contained"
            color="error"
          >
            {t("Supprimer")}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Payement Modal Confirmation */}
      <Dialog
        open={openPayement}
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            handleClosePayement();
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Confirmation de Payement
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "black" }}
          >
            {t(comfirmationMessagePayement)}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleClosePayement} color="secondary">
            {t("Cancel")}
          </Button>
          <LoadingButton
            onClick={() => {
              comfirmationPayement();
            }}
            loading={sendPayement}
            endIcon={<PaymentIcon />}
            variant="contained"
            color="info"
          >
            Régler
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FactureList;
