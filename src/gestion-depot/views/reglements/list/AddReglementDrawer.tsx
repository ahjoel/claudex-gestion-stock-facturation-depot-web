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
import { Grid, Paper, TextField } from "@mui/material";
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
  mtrecu: yup.number().required(),
  mtpayer: yup.number().required(),
  factureId: yup.number().required("Le champ facture est obligatoire"),
});

const defaultValues = {
  mtrecu: 0,
  mtpayer: 0,
  factureId: 0,
};

const SidebarAddReglement = (props: SidebarAddReglementType) => {
  const { open, toggle, onChange, onSuccess, factures, currentReglement } = props;

  const [send, setSend] = useState(false);
  const [client, setClient] = useState("");
  const [dateCreat, setDateCreat] = useState("");
  const [auteur, setAuteur] = useState("");
  const [montantAPayer, setMontantAPayer] = useState("");
  const [montantDejaPayer, setMontantDejaPayer] = useState("");
  const [montantRestant, setMontantRestant] = useState("");
  const [openNotification, setOpenNotification] = useState(false);
  const [typeMessage, setTypeMessage] = useState<AlertColor>("info");
  const [message, setMessage] = useState("");
  const [id, setId] = useState(-1);

  const factureService = new FactureService();

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

  const handleLoadingFactureInfo = async (id: number) => {
    try {
      const rep = await factureService.listFactureInfoDetail(id);
      if (rep.success) {
        const data = rep.data[0] as FactureDataInfo;
        setClient(data.client);
        setMontantAPayer(data.mt_a_payer.toString());
        setMontantDejaPayer(data.mt_encaisse);
        setMontantRestant(data.mt_restant.toString());
        setAuteur(data.auteur);
        setDateCreat(data.createdAt);
      } else {
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Règlement non trouvé");
      }
    } catch {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Erreur lors du chargement de la facture");
    }
  };

  const formatNumberString = (numStr: string) => {
    const num = parseFloat(numStr);
    if (isNaN(num)) return numStr;
    return num.toLocaleString("fr-FR");
  };

  const onSubmit = async (data: ReglementData) => {
    const service = new ReglementService();
    setSend(true);

    const payload = {
      mtrecu: Number(data.mtrecu),
      mtpayer: Number(data.mtpayer),
      factureId: Number(data.factureId),
    };

    // Cast en any pour bypass TS unknown
    const result: any =
      id === -1
        ? await service.createReglement(payload)
        : await service.updateReglement({ ...payload, id }, id);

    setSend(false);

    if (result && result.success) {
      onChange();
      reset();
      toggle();
      onSuccess("Opération réussie");
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result?.description || "Erreur");
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
      factureId: currentReglement?.factureId ?? 0,
      mtpayer: currentReglement?.mtpayer ?? 0,
      mtrecu: currentReglement?.mtrecu ?? 0,
    });

    if (currentReglement?.factureId) {
      handleLoadingFactureInfo(currentReglement.factureId);
      setId(currentReglement.id ?? -1);
    } else {
      setClient("");
      setMontantAPayer("");
      setMontantDejaPayer("");
      setMontantRestant("");
      setAuteur("");
      setDateCreat("");
      setId(-1);
    }
  }, [open, currentReglement]);

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={toggle}
      sx={{ "& .MuiDrawer-paper": { width: 400 } }}
    >
      <Header>
        <Typography variant="h6">
          {id === -1 ? "Ajout de Règlement" : "Modification de Règlement"}
        </Typography>
        <IconButton onClick={toggle}>
          <Icon icon="tabler:x" />
        </IconButton>
      </Header>

      <Box sx={{ p: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="factureId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={factures}
                getOptionLabel={(f) => f.code}
                value={factures.find((f) => f.id === field.value) || null}
                onChange={(_, v) => {
                  field.onChange(v?.id ?? 0);
                  if (v?.id) handleLoadingFactureInfo(v.id);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Facture"
                    error={!!errors.factureId}
                  />
                )}
              />
            )}
          />

          <Box mt={4}>
            <Paper sx={{ p: 3 }}>
              <Typography>Client : {client}</Typography>
              <Typography>Montant restant : {formatNumberString(montantRestant)} XOF</Typography>
              <Typography>Montant à payer : {formatNumberString(montantAPayer)} XOF</Typography>
              <Typography>Auteur : {auteur}</Typography>
              <Typography>Date : {dateCreat ? new Date(dateCreat).toLocaleDateString() : ""}</Typography>
            </Paper>
          </Box>

          <Controller
            name="mtrecu"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Montant reçu" sx={{ mt: 4 }} />
            )}
          />

          <Controller
            name="mtpayer"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Montant à payer" sx={{ mt: 4 }} />
            )}
          />

          <Box mt={4} display="flex" gap={2}>
            <Button onClick={handleClose} color="secondary">
              Annuler
            </Button>
            <LoadingButton type="submit" loading={send} variant="contained">
              Enregistrer
            </LoadingButton>
          </Box>
        </form>

        <Snackbar open={openNotification} autoHideDuration={4000} onClose={() => setOpenNotification(false)}>
          <Alert severity={typeMessage}>{message}</Alert>
        </Snackbar>
      </Box>
    </Drawer>
  );
};

export default SidebarAddReglement;