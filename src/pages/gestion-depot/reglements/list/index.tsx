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
import { t } from "i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import Reglement from "src/gestion-depot/logic/models/Reglement";
import ReglementService from "src/gestion-depot/logic/services/ReglementService";
import TableHeader from "src/gestion-depot/views/reglements/list/TableHeader";
import AddReglementDrawer from "src/gestion-depot/views/reglements/list/AddReglementDrawer";
import FactureService from "src/gestion-depot/logic/services/FactureService";
import Facture from "src/gestion-depot/logic/models/Facture";

interface CellType {
  row: Reglement;
}

interface ColumnType {
  [key: string]: any;
}

const ReglementList = () => {
  const reglementService = new ReglementService();
  const userData = JSON.parse(
    window.localStorage.getItem("userData") as string
  );
  const profile = userData?.profile;

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
  const [addReglementOpen, setAddReglementOpen] = useState<boolean>(false);
  const [reglements, setReglements] = useState<Reglement[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(40);
  const [downloadCount, setDownloadCount] = useState(0);
  
  const handleDownload = async () => {
    setDownloadCount(downloadCount + 1);
  };

  const [openFacture, setOpenFacture] = useState(false);
  const [code, setCode] = useState<string>("");
  const handleOpenModalFacture = (
    arecode: string,
    etat: string,
    idFact: number
  ) => {
    setCode(arecode);
    setOpenFacture(true);
    setDownloadCount(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentReglement, setCurrentReglement] = useState<null | Reglement>(
    null
  );

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateReglement: (reglement: Reglement) => void,
    handleDeleteReglement: (reglement: Reglement) => void
  ) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.15,
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
      },
      {
        flex: 0.09,
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
      },
      {
        flex: 0.2,
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
                    color: "primary.main",
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
        field: "mtrecu",
        renderHeader: () => (
          <Tooltip title="Mt Payé">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Mt Payé
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mtpayer } = row;

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
                  {mtpayer}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "mtpayer",
        renderHeader: () => (
          <Tooltip title="Mt Reçu">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Mt Reçu
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mtrecu } = row;

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
                  {mtrecu}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
        field: "auteur",
        renderHeader: () => (
          <Tooltip title="Auteur">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Auteur
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { auteur } = row;

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
                  {auteur}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 0.15,
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
            <Tooltip title='Mettre à jour un reglement'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateReglement(row);
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                  <Icon icon='tabler:edit' />
                </Box>
              </IconButton>
            </Tooltip>

            {(profile === "ADMINISTRATEUR" || profile === "SUPER-ADMIN" || profile === "GERANT") && (
              <Tooltip title="Supprimer le règlement">
                <IconButton
                  size="small"
                  sx={{ color: "text.primary" }}
                  onClick={() => {
                    {
                      handleDeleteReglement(row);
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      color: (theme) => theme.palette.info.main,
                    }}
                  >
                    <Icon icon="tabler:trash" />
                  </Box>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      },
    ];

    return colArray;
  };

  // Axios call to loading Data
  const getListReglements = async (page: number, pageSize: number) => {
    const result = await reglementService.listReglements({
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
          reglement.createdAt
            ?.toString()
            .toLowerCase()
            .includes(queryLowered) ||
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

  const handleChange = async () => {
    getListReglements(0, 10);
  };

  const factureService = new FactureService();
  const handleLoadingFacture = async () => {
    const result = await factureService.readAllImpayee();

    if (result.success) {
      setFactures(result.data as Facture[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  // Control search data in datagrid
  useEffect(() => {
    handleChange();
    handleLoadingFacture();
    setColumns(getColumns(handleUpdateReglement, handleDeleteReglement));
  }, [value]);

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

  // Update Data
  const handleUpdateReglement = (reglement: Reglement) => {
    setCurrentReglement(reglement)
    toggleAddReglementDrawer()
  }

  // Pagination
  useEffect(() => {
    getListReglements(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={handleCreateReglement}
            onReload={() => {
              setValue("");
              handleChange();
            }}
          />
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

export default ReglementList;
