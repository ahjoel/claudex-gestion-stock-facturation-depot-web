/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
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
import { CircularProgress } from "@mui/material";
import { t } from "i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import Reglement from "src/gestion-depot/logic/models/Reglement";
import ReglementService from "src/gestion-depot/logic/services/ReglementService";
import TableHeader from "src/gestion-depot/views/reglements/list/TableHeader";
import AddReglementDrawer from "src/gestion-depot/views/reglements/list/AddReglementDrawer";
import FactureService from "src/gestion-depot/logic/services/FactureService";
import Facture from "src/gestion-depot/logic/models/Facture";
import TableHeaderSituation from "src/gestion-depot/views/reglements/list/TableHeaderSituation";
import TableHeaderReglement from "src/gestion-depot/views/reglements/list/TableHeaderReglement";
import FactureDetail from "src/gestion-depot/logic/models/FactureDetail";
import TemplateFactureRegle from "src/gestion-depot/views/pdfMake/TemplateFactureRegle";
import TemplateFactureRegleUnique from "src/gestion-depot/views/pdfMake/TemplateFactureRegleUnique";

interface CellType {
  row: Reglement;
}

interface ColumnType {
  [key: string]: any;
}

interface CellTypeFacture {
  row: FactureDetail;
}

const SituationReglementList = () => {
  const reglementService = new ReglementService();
  const factureService = new FactureService();
  const userData = JSON.parse(
    window.localStorage.getItem("userData") as string
  );
  const profile = userData?.profile;
  const [dateFacture, setDateFacture] = useState<string>("");
  const [remise, setRemise] = useState<string>("");
  const [auteur, setAuteur] = useState<string>("");
  const [clientFact, setClientFact] = useState<string>("");
  const [clientImp, setClientImp] = useState<string>("");
  const [dateEch, setDateEch] = useState<string>("");

  // const [code, setCode] = useState<string>("");
  const [etatFacture, setEtatFacture] = useState<string>("");
  const [statusFactureDetail, setStatusFactureDetail] = useState<boolean>(true);
  const [facturesDetails, setFacturesDetails] = useState<FactureDetail[]>([]);
  const [factureReceipt, setFactureReceipt] = useState<FactureDetail[]>([]);
  const [columnsFacture, setColumnsFacture] = useState<ColumnType[]>([]);
  const [paginationModelFacture, setPaginationModelFacture] = useState({
    page: 0,
    pageSize: 10,
  });
  
  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const [comfirmationMessage, setComfirmationMessage] = useState<string>("");
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(
    () => console.log(" .... ")
  );

  const handleDeleteReglement = (reglement: Reglement) => {
    setCurrentReglement(reglement);
    setComfirmationMessage(
      `Voulez-vous réellement supprimer cet reglement de : ${reglement.mtpayer} F CFA pour la facture : ${reglement.code} ?`
    );
    setComfirmationFunction(() => () => deleteReglement(reglement));
    setOpen(true);
  };

  const deleteReglement = async (reglement: Reglement) => {
    setSendDelete(true);

    try {
      const rep = await reglementService.delete(reglement.id);

      if (rep === null) {
        setSendDelete(false);
        handleChange();
        handleClose();
        setOpenNotification(true);
        setTypeMessage("success");
        setMessage("Reglement supprimé avec succes");
      } else {
        setSendDelete(false);
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Reglement non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSendDelete(false);
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue");
    }
  };

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      setOpenNotification(false);
    }
    setOpenNotification(false);
  };

  const handleSuccess = (message: string, type = "success") => {
    setOpenNotification(true);
    setTypeMessage(type);
    const messageTrans = t(message);
    setMessage(messageTrans);
  };

  const [statusReglements, setStatusReglements] = useState<boolean>(true);

  const [value, setValue] = useState<string>("");
  const [valueDetFact, setValueDetFact] = useState<string>("");
  const [addReglementOpen, setAddReglementOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [montantEncaisse, setMontantEncaisse] = useState<string>("");
  const [montantRestant, setMontantRestant] = useState<string>("");
  const [reglements, setReglements] = useState<Reglement[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [openFacture, setOpenFacture] = useState(false);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(40);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentReglement, setCurrentReglement] = useState<null | Reglement>(
    null
  );

  const handleDownload = async () => {
    setDownloadCount(downloadCount + 1);
  };

  const handleOpenModalFacture = (
    arecode: string,
    aremtencaiss: string,
    aremtrestant: string
  ) => {
    setCode(arecode);
    setOpenFacture(true);
    setMontantEncaisse(aremtencaiss);
    setMontantRestant(aremtrestant);
    setDownloadCount(0);
    setClientImp("")
  };

  // Display of columns according to user roles in the Datagrid
  const getColumns = (
    handleUpdateReglement: (reglement: Reglement) => void
  ) => {
    const colArray: ColumnType[] = [
      {
        field: "createdAt",
        renderHeader: () => (
          <Tooltip title="Date de creation">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Date de creation
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
                  {createdAt?.slice(0, -5).replace(/T/g, " ")}
                </Typography>
              </Box>
            </Box>
          );
        },
        width: 200
      },
      {
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
                  {client}
                </Typography>
              </Box>
            </Box>
          );
        },
        width: 150
      },
      {
        field: "codeFacture",
        renderHeader: () => (
          <Tooltip title="Code Facture">
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
              Code Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { codeFacture } = row;

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
                  {codeFacture}
                </Typography>
              </Box>
            </Box>
          );
        },
        width: 270
      },
      {
        field: "mt_a_payer",
        renderHeader: () => (
          <Tooltip title="Mt A Payer">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Mt A Payer
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mt_a_payer } = row;

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
                  {mt_a_payer}
                </Typography>
              </Box>
            </Box>
          );
        },
        width: 200
      },
      {
        field: "mt_encaisse",
        renderHeader: () => (
          <Tooltip title="Mt Encaisse">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Mt Encaisse
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mt_encaisse } = row;

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
                  {mt_encaisse}
                </Typography>
              </Box>
            </Box>
          );
        },
        width: 200
      },
      {
        field: "mt_restant",
        renderHeader: () => (
          <Tooltip title="Mt Restant">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Mt Restant
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mt_restant } = row;

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
                  {mt_restant}
                </Typography>
              </Box>
            </Box>
          );
        },
        width: 200
      },
      // {
      //   flex: 0.15,
      //   field: "auteur",
      //   renderHeader: () => (
      //     <Tooltip title="Auteur">
      //       <Typography
      //         noWrap
      //         sx={{
      //           fontWeight: 500,
      //           letterSpacing: "1px",
      //           textTransform: "uppercase",
      //           fontSize: "0.8125rem",
      //         }}
      //       >
      //         Auteur
      //       </Typography>
      //     </Tooltip>
      //   ),
      //   renderCell: ({ row }: CellType) => {
      //     const { auteur } = row;

      //     return (
      //       <Box sx={{ display: "flex", alignItems: "center" }}>
      //         <Box
      //           sx={{
      //             display: "flex",
      //             alignItems: "flex-start",
      //             flexDirection: "column",
      //           }}
      //         >
      //           <Typography
      //             noWrap
      //             sx={{
      //               fontWeight: 500,
      //               textDecoration: "none",
      //               color: "primary.main",
      //             }}
      //           >
      //             {auteur}
      //           </Typography>
      //         </Box>
      //       </Box>
      //     );
      //   },
      // },
      {
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
            <Tooltip title="Mettre à jour un reglement">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  handleOpenModalFacture(row.codeFacture, row.mt_encaisse, row.mt_restant);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.success.main,
                  }}
                >
                  <Icon icon="tabler:list" />
                </Box>
              </IconButton>
            </Tooltip>

          </Box>
        ),
        width: 150
      },
    ];

    return colArray;
  };

  const getDetailsFacture = async () => {
    let clientName;
    let dateEcheance;
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
      const dateObjEch = new Date(dateStr);

      dateObjEch.setDate(dateObjEch.getDate() + 7)
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      const formattedDate = dateObj.toLocaleDateString('fr-FR', options);
      const formattedDateEcheance = dateObjEch.toLocaleDateString('fr-FR', options);

      setDateFacture(formattedDate)
      clientName = dataFact[0]?.client
      setClientFact(dataFact[0]?.client)
      setAuteur(dataFact[0]?.username)
      setRemise(dataFact[0]?.remise)
      setDateEch(formattedDateEcheance)
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(
        "Une erreur est survenue lors du chargement des produits de facture"
      );
    }

    const resul = await factureService.listMontantFacturesImpayee({
      name: clientName || "",
    });

    if (resul.success) {
      const dataImp = resul.data as FactureDetail[]
      setClientImp(dataImp[0].impayee);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(
        "Une erreur est survenue lors du chargement des impayées du client"
      );
    }
  };

  // Axios call to loading Data
  const getSituationReglements = async (page: number, pageSize: number) => {
    const result = await reglementService.listSituationReglements({
      page: page + 1,
      length: pageSize,
    });

    if (result.success) {
      const queryLowered = value.toLowerCase();
      const filteredData = (result.data as Reglement[]).filter((reglement) => {
        return (
          reglement.codeFacture
            ?.toString()
            .toLowerCase()
            .includes(queryLowered) ||
          reglement.createdAt?.toString().toLowerCase().includes(queryLowered) ||
          reglement.client?.toString().toLowerCase().includes(queryLowered) ||
          reglement.mt_a_payer
            ?.toString()
            .toLowerCase()
            .includes(queryLowered) ||
          reglement.mt_encaisse?.toLowerCase().includes(queryLowered) ||
          reglement.mt_restant?.toLowerCase().includes(queryLowered) ||
          reglement.auteur?.toLowerCase().includes(queryLowered)
        );
      });

      setReglements(filteredData);
      setStatusReglements(false);
      setTotal(Number(result.total));
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  const getColumnsFactureDetail = (
  ) => {
    const colArray: ColumnType[] = [
      {
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
        width: 200
      },
      {
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
        width: 180
      },
      {
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
        width: 150
      },
      {
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
        width: 150
      },
      {
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
        width: 150
      },
    ];
    // if (etatFacture === "impayée") {
    // colArray.push({
    //   flex: 0.1,
    //   minWidth: 50,
    //   sortable: false,
    //   field: "action",
    //   renderHeader: () => (
    //     <Tooltip title={t("Action")}>
    //       <Typography
    //         noWrap
    //         sx={{
    //           fontWeight: 500,
    //           letterSpacing: "1px",
    //           textTransform: "uppercase",
    //           fontSize: "0.8125rem",
    //         }}
    //       >
    //         {t("Action")}
    //       </Typography>
    //     </Tooltip>
    //   ),
    //   renderCell: ({ row }: CellTypeFacture) => (
    //     <Box sx={{ display: "flex", alignItems: "center" }}>
    //       <Tooltip title="Mettre à jour un produit de facture">
    //         <IconButton
    //           size="small"
    //           sx={{ color: "text.primary" }}
    //           onClick={() => {
    //             // handleUpdateProduitFacture(row)
    //           }}
    //         >
    //           {/* <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
    //                 <Icon icon='tabler:edit' />
    //               </Box> */}
    //         </IconButton>
    //       </Tooltip>

    //       {/* {etatFacture === "impayée" && ( */}
    //       <Tooltip title="Supprimer">
    //         <IconButton
    //           size="small"
    //           sx={{ color: "text.primary" }}
    //           onClick={() => {
    //             handleDeleteProduitFacture(row);
    //           }}
    //         >
    //           <Box
    //             sx={{
    //               display: "flex",
    //               color: (theme) => theme.palette.error.main,
    //             }}
    //           >
    //             <Icon icon="tabler:trash" />
    //           </Box>
    //         </IconButton>
    //       </Tooltip>
    //       {/* )} */}
    //     </Box>
    //   ),
    // });
    // }

    return colArray;
  };

  const handleChange = async () => {
    getSituationReglements(0, 10);
  };

  // Control search data in datagrid
  useEffect(() => {
    handleChange();
    // handleLoadingFacture();
    setColumns(getColumns(handleUpdateReglement));
  }, [value]);

  useEffect(() => {
    getDetailsFacture();
    setColumnsFacture(getColumnsFactureDetail());
  }, [code, valueDetFact]);


  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  // Show Modal
  const toggleAddReglementDrawer = () => setAddReglementOpen(!addReglementOpen);

  // Add Data
  const handleCreateReglement = () => {
    setCurrentReglement(null);
    toggleAddReglementDrawer();
  };

  const handleFilterDet = useCallback((valFact: string) => {
    setValueDetFact(valFact);
  }, []);

  // Update Data
  const handleUpdateReglement = (reglement: Reglement) => {
    setCurrentReglement(reglement);
    toggleAddReglementDrawer();
  };

  // Pagination
  useEffect(() => {
    getSituationReglements(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeaderSituation
            value={value}
            handleFilter={handleFilter}
            onReload={() => {
              setValue("");
              handleChange();
            }}
          />
          {downloadCount > 0 && (
              factureReceipt.length > 10 ?
              ( 
                <TemplateFactureRegleUnique
                    data={factureReceipt as never[]}
                    auteur={auteur}
                    client={clientFact}
                    remise={remise}
                    code={code}
                    dateFact={dateFacture}
                    fileName={`FACTURE_REGLE_${code}`} 
                    mtrestant={montantRestant}
                    mtencaisse={montantEncaisse}
                    impayee={clientImp} 
                    dateEcheance={dateEch}  
                />
              ) : 
              (
                <TemplateFactureRegle
                    data={factureReceipt as never[]}
                    auteur={auteur}
                    client={clientFact}
                    remise={remise}
                    code={code}
                    dateFact={dateFacture}
                    fileName={`FACTURE_REGLE_${code}`}
                    mtrestant={montantRestant}
                    mtencaisse={montantEncaisse}
                    impayee={clientImp} 
                    dateEcheance={dateEch}         
                />
              )
            )}
          <DataGrid
            autoHeight
            loading={statusReglements}
            rowHeight={62}
            rows={reglements as never[]}
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
      </Grid>

      {/* Add or Update Right Modal */}
      <AddReglementDrawer
        open={addReglementOpen}
        toggle={toggleAddReglementDrawer}
        onChange={handleChange}
        factures={factures}
        currentReglement={currentReglement}
        onSuccess={handleSuccess}
        mtpayer={0}
        mtrecu={0}
        factureId={0}
      />

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

          <TableHeaderReglement
            value={valueDetFact}
            onDownload={handleDownload}
            handleFilterDetail={handleFilterDet}
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
    </Grid>
  );
};

export default SituationReglementList;
