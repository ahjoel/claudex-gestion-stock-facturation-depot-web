import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Icon from "src/@core/components/icon";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { Grid, MenuItem, Paper, TextField } from "@mui/material";
import CustomTextField from "src/@core/components/mui/text-field";
import Autocomplete from "@mui/material/Autocomplete";
import Facture from "src/gestion-depot/logic/models/Facture";
import Reglement from "src/gestion-depot/logic/models/Reglement";
import ReglementService from "src/gestion-depot/logic/services/ReglementService";
import FactureService from "src/gestion-depot/logic/services/FactureService";

interface ReglementData {
  id?: number;
  factureId: number;
  mtpayer: number;
  mtrecu: number;
}

interface FactureDataInfo {
  id: number;
  codeFacture: string;
  createdAt: string;
  client: string;
  mt_a_payer: number;
  mt_encaisse: string;
  mt_restant: number;
  auteur: string;
}

interface SidebarAddReglementType {
  open: boolean;
  toggle: () => void;
  onChange: () => void;
  onSuccess: (data: any) => void;
  currentReglement: null | Reglement;
  mtpayer: number;
  mtrecu: number;
  factures: Facture[];
  factureId: number;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

const schema = yup.object().shape({
  mtrecu: yup
    .number()
    .min(2, (obj) => {
      if (obj.value.length === 0) {
        return "Le champ montant reçu est obligatoire";
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return "Le champ montant reçu doit comporter au moins 1 chiffre";
      } else {
        return "";
      }
    })
    .required(),
  mtpayer: yup
    .string()
    .min(2, (obj) => {
      if (obj.value.length === 0) {
        return "Le champ montant payer est obligatoire";
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return "Le champ montant payer doit comporter au moins 1 chiffre";
      } else {
        return "";
      }
    })
    .required(),
  factureId: yup.number().required(() => "Le champ facture est obligatoire"),
});

const defaultValues = {
  mtrecu: 0,
  mtpayer: 0,
  factureId: 0,
};

const SidebarAddReglement = (props: SidebarAddReglementType) => {
  // ** Props
  const { open, toggle, onChange, onSuccess, factures, currentReglement } =
    props;

  const [send, setSend] = useState<boolean>(false);
  const [client, setClient] = useState<string>("");
  const [dateCreat, setDateCreat] = useState<string>("");
  const [auteur, setAuteur] = useState<string>("");
  const [montantAPayer, setMontantAPayer] = useState<string>("");
  const [montantDejaPayer, setMontantDejaPayer] = useState<string>("");
  const [montantRestant, setMontantRestant] = useState<string>("");
  let infoTranslate;

  // Notification
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

  // Control Forms
  const [id, setId] = useState<number>(-1);
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ReglementData) => {
    const reglementService = new ReglementService();
    setSend(true);

    if (data.mtpayer <= Number(montantRestant)) {
      const sendData = {
        mtrecu: Number(data.mtrecu),
        mtpayer: Number(data.mtpayer),
        factureId: Number(data.factureId),
      };

      if (id === -1) {
        const result = await reglementService.createReglement(sendData);
        setSend(false);

        if (result.success) {
          onChange();
          reset();
          toggle();
          onSuccess("Registration completed successfully");
          setClient("");
          setMontantAPayer("");
          setMontantDejaPayer("");
          setMontantRestant("");
          setAuteur("");
          setDateCreat("");
        } else {
          setOpenNotification(true);
          setTypeMessage("error");
          setMessage(result.description);
        }
      } else {
        reglementService
          .updateReglement({ ...sendData, id }, id)
          .then((rep) => {
            setSend(false);
            if (rep) {
              onChange();
              reset();
              toggle();
              onSuccess("Change completed successfully");
              setClient("");
              setMontantAPayer("");
              setMontantDejaPayer("");
              setMontantRestant("");
              setAuteur("");
              setDateCreat("");
            } else {
              setOpenNotification(true);
              setTypeMessage("error");
              infoTranslate = t("An error has occurred");
              setMessage(infoTranslate);
            }
          })
          .catch((error) => {
            setSend(false);
            console.error("Erreur lors de la mise à jour :", error);
            setOpenNotification(true);
            setTypeMessage("error");
            infoTranslate = t("An error has occurred");
            setMessage(infoTranslate);
          });
      }
    } else {
      setSend(false);
      setOpenNotification(true);
      setTypeMessage("error");
      infoTranslate = t("An error has occurred");
      setMessage("Le montant a payer est incorrect");
    }
  };

  const factureService = new FactureService();
  const handleLoadingFactureInfo = async (id: number) => {
    // console.log("factureChoiceId :::", Number(factureChoiceId));
    try {
      const rep = await factureService.listFactureInfoDetail(id);

      if (rep.success) {
        const filteredData = rep.data[0] as FactureDataInfo;
        // console.log("client :::", filteredData.client);
        setClient(filteredData.client);
        setMontantAPayer(filteredData.mt_a_payer.toString());
        setMontantDejaPayer(filteredData.mt_encaisse);
        setMontantRestant(filteredData.mt_restant.toString());
        setAuteur(filteredData.auteur);
        setDateCreat(filteredData.createdAt.toString());
      } else {
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Reglement non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);

      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue--");
    }
  };

  const handleClose = () => {
    setClient("");
    setMontantAPayer("");
    setMontantDejaPayer("");
    setMontantRestant("");
    setAuteur("");
    setDateCreat("");
    toggle();
    reset();
  };

  useEffect(() => {
    reset({
      factureId:
        currentReglement && currentReglement?.factureId !== undefined
          ? currentReglement.factureId
          : 0,
      mtpayer:
        currentReglement && currentReglement?.mtpayer !== undefined
          ? currentReglement.mtpayer
          : 0,
      mtrecu:
        currentReglement && currentReglement?.mtrecu !== undefined
          ? currentReglement.mtrecu
          : 0,
    });
    currentReglement !== null
      ? handleLoadingFactureInfo(Number(currentReglement?.factureId))
      : 
        setMontantAPayer("");
        setMontantDejaPayer("");
        setMontantRestant("");
        setAuteur("");
        setDateCreat("")
      ;
    setId(currentReglement !== null ? currentReglement?.id : -1);
  }, [open, currentReglement]);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}

      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">
          {id === -1 ? "Ajout de Reglement" : "Modification de Reglement"}
          {/* {id === -1 ? handleLoadingFactureInfo(Number(currentReglement?.factureId)) : '';} */}
        </Typography>
        <IconButton
          size="small"
          onClick={()=>{
            handleClose();
          }}
          sx={{
            p: "0.438rem",
            borderRadius: 1,
            color: "text.primary",
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: (theme) =>
                `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Controller
            name="factureId"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                fullWidth
                sx={{ mb: 6 }}
                options={factures} // Remplacez products par votre tableau de produits
                getOptionLabel={(facture) => `${facture.code}`} // Fonction pour afficher le nom du produit dans l'autocomplete
                value={factures.find((facture) => facture.id === value) || null} // Sélectionnez le produit correspondant à la valeur
                onChange={(e, newValue) => {
                  onChange(newValue ? newValue.id : 0);
                  Number(newValue?.id.toString()) > 0
                    ? handleLoadingFactureInfo(Number(newValue?.id.toString()))
                    : setClient("");
                  setMontantAPayer("");
                  setMontantDejaPayer("");
                  setMontantRestant("");
                  setAuteur("");
                  setDateCreat("");
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    error={Boolean(errors.factureId)}
                    {...(errors.factureId && {
                      helperText: errors.factureId.message,
                    })}
                    label="Sélectionnez une facture"
                  />
                )}
              />
            )}
          />
          {id != -1 ??
            handleLoadingFactureInfo(Number(currentReglement?.factureId))}
          <Box sx={{ padding: 2, maxWidth: 600, margin: "auto", mb: "30px" }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                Récapitulatif de la Facture
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Date de Création:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {dateCreat != ""
                      ? new Date(dateCreat).toLocaleDateString()
                      : ""}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Client:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{client}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Montant à Payer:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {montantAPayer + " " + "XOF"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Montant Encaissé:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {montantDejaPayer + " " + "XOF"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Montant Restant:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {montantRestant + " " + "XOF"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Auteur:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{auteur}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <Controller
            name="mtrecu"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Montant Reçu"
                onChange={onChange}
                error={Boolean(errors.mtrecu)}
                {...(errors.mtrecu && { helperText: errors.mtrecu.message })}
              />
            )}
          />
          <Controller
            name="mtpayer"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Montant A Payer"
                onChange={onChange}
                error={Boolean(errors.mtpayer)}
                {...(errors.mtpayer && { helperText: errors.mtpayer.message })}
              />
            )}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              sx={{ mr: 3 }}
              color="secondary"
              onClick={()=>{
                handleClose()
              }}
            >
              {t("Cancel")}
            </Button>
            <LoadingButton
              type="submit"
              loading={send}
              endIcon={<SaveIcon />}
              variant="contained"
            >
              {t("Submit")}
            </LoadingButton>
          </Box>
        </form>

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
      </Box>
    </Drawer>
  );
};

export default SidebarAddReglement;
