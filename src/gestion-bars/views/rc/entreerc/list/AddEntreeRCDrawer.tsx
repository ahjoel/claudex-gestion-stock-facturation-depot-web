import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'
import EntreeRCService from 'src/gestion-bars/logic/services/EntreeRCService'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save';
import { MenuItem, TextField } from '@mui/material'
import EntreeRC from 'src/gestion-bars/logic/models/EntreeRC'
import CustomTextField from 'src/@core/components/mui/text-field'
import Produit from 'src/gestion-bars/logic/models/Produit'

interface ProduitData {
  id?: number
  code: string
  produitId: number
  qte: number
}

interface SidebarAddEntreeRCType {
  open: boolean
  toggle: () => void
  onChange: () => void
  onSuccess: (data: any) => void
  currentEntreeRC: null | EntreeRC
  produits: Produit[]
  produitId: number
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  code: yup.string().required(() => 'Le champ model est obligatoire'),
  produitId: yup.number().required(() => 'Le champ produit est obligatoire'),
  qte: yup.number().required(() => 'Le champ quantité est obligatoire')
})

const defaultValues = {
  code: '',
  produitId: 0,
  qte: 0
}

const SidebarAddProduit = (props: SidebarAddEntreeRCType) => {
  // ** Props
  const { open, toggle, onChange, onSuccess, currentEntreeRC, produits } = props

  const [send, setSend] = useState<boolean>(false)
  let infoTranslate

  // Notification
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false);
    }
    setOpenNotification(false);
  };

  // Control Forms
  const [id, setId] = useState<number>(-1)
  const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const onSubmit = async (data: ProduitData) => {
    const entreeRCService = new EntreeRCService()
    setSend(true)

    const sendData = {
      code: data.code,
      produitId: Number(data.produitId),
      types: "ADD",
      qte: Number(data.qte),
      stock: "RC"
    }

    if (id === -1) {
      const result = await entreeRCService.createEntreeRC(sendData)
      setSend(false)

      if (result.success) {
        onChange()
        reset()
        toggle()
        onSuccess("Registration completed successfully");
      } else {
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage(result.description)
      }
    } else {
      entreeRCService.updateEntreeRC({ ...sendData, id }, id).then(rep => {
        setSend(false)
        if (rep) {
          onChange()
          reset()
          toggle()
          onSuccess("Change completed successfully");
        } else {
          setOpenNotification(true);
          setTypeMessage("error");
          infoTranslate = t('An error has occurred')
          setMessage(infoTranslate)
        }
      }).catch(error => {
        setSend(false)
        console.error("Erreur lors de la mise à jour :", error);
        setOpenNotification(true);
        setTypeMessage("error");
        infoTranslate = t('An error has occurreddd')
        setMessage(infoTranslate)
      })
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  useEffect(() => {
    reset({
      code: currentEntreeRC !== null ? currentEntreeRC?.code : '',
      produitId: (currentEntreeRC && currentEntreeRC?.produitId !== undefined) ? currentEntreeRC.produitId : 0,
      qte: (currentEntreeRC && currentEntreeRC?.qte !== undefined) ? currentEntreeRC.qte : 0
    })
    setId(currentEntreeRC !== null ? currentEntreeRC?.id : -1)
  }, [open, currentEntreeRC])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{id === -1 ? 'Ajout de stock' : 'Modification de stock'}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Controller
            name='code'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 6 }}
                label='Code'
                onChange={onChange}
                error={Boolean(errors.code)}
                {...(errors.code && { helperText: errors.code.message })}
              />
            )}
          />
          <Controller
            name='produitId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 6 }}
                label='Produit'
                error={Boolean(errors.produitId)}
                {...(errors.produitId && { helperText: errors.produitId.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value={0}>Selectionnez un produit</MenuItem>
                {produits?.map(produit => (
                  <MenuItem key={produit.id} value={produit.id}>
                    {produit.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Controller
            name='qte'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 6 }}
                label='Quantité'
                onChange={onChange}
                error={Boolean(errors.qte)}
                {...(errors.qte && { helperText: errors.qte.message })}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='outlined' sx={{ mr: 3 }} color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <LoadingButton
              type='submit'
              loading={send}
              endIcon={<SaveIcon />}
              variant="contained"
            >
              {t('Submit')}
            </LoadingButton>
          </Box>
        </form>

        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openNotification} onClose={handleCloseNotification} autoHideDuration={5000}>
          <Alert
            onClose={handleCloseNotification}
            severity={typeMessage as AlertColor}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProduit
