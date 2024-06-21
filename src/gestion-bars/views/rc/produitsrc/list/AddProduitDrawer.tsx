/* eslint-disable react-hooks/exhaustive-deps */
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
import ProduitService from 'src/gestion-bars/logic/services/ProduitService'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { MenuItem, TextField } from '@mui/material'
import Produit from 'src/gestion-bars/logic/models/Produit'
import CustomTextField from 'src/@core/components/mui/text-field'
import Model from 'src/gestion-bars/logic/models/Model'
import Fournisseur from 'src/gestion-bars/logic/models/Fournisseur'

interface ProduitData {
  id?: number
  code: string
  name: string
  description: string
  modelId: number
  fournisseurId: number
  pv: number
  stock_min: number
}

interface SidebarAddProduitType {
  open: boolean
  toggle: () => void
  onChange: () => void
  onSuccess: (data: any) => void
  currentProduit: null | Produit
  models: Model[]
  modelId: number
  fournisseurs: Fournisseur[]
  fournisseurId: number
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  code: yup
    .string()
    .min(3, obj => {
      if (obj.value.length === 0) {
        return 'Le champ code est obligatoire'
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return 'Le champ code doit comporter au moins 3 caractères'
      } else {
        return ''
      }
    })
    .required(),
  name: yup
    .string()
    .min(3, obj => {
      if (obj.value.length === 0) {
        return 'Le champ nom est obligatoire'
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return 'Le champ nom doit comporter au moins 3 caractères'
      } else {
        return ''
      }
    })
    .required(),
  description: yup
    .string()
    .min(3, obj => {
      if (obj.value.length === 0) {
        return 'Le champ description est obligatoire'
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return 'Description invalide'
      } else {
        return ''
      }
    })
    .required(),
  modelId: yup.number().required(() => 'Le champ model est obligatoire'),
  fournisseurId: yup.number().required(() => 'Le champ fournisseur est obligatoire'),
  pv: yup.number().required(() => 'Le champ prix de vente est obligatoire'),
  stock_min: yup.number().required(() => 'Le champ stock minimal est obligatoire')
})

const defaultValues = {
  code: '',
  name: '',
  description: '',
  modelId: 0,
  fournisseurId: 0,
  pv: 0,
  stock_min: 0
}

const SidebarAddProduit = (props: SidebarAddProduitType) => {
  // ** Props
  const { open, toggle, onChange, onSuccess, currentProduit, models, fournisseurs } = props

  const [send, setSend] = useState<boolean>(false)
  let infoTranslate

  // Notification
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  // Control Forms
  const [id, setId] = useState<number>(-1)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const onSubmit = async (data: ProduitData) => {
    const produitService = new ProduitService()
    setSend(true)

    const sendData = {
      code: data.code,
      name: data.name,
      description: data.description,
      modelId: Number(data.modelId),
      fournisseurId: Number(data.fournisseurId),
      pv: Number(data.pv),
      stock_min: Number(data.stock_min)
    }

    if (id === -1) {
      const result = await produitService.createProduitRc(sendData)
      setSend(false)

      if (result.success) {
        onChange()
        reset()
        toggle()
        onSuccess('Registration completed successfully')
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage(result.description)
      }
    } else {
      produitService
        .updateProduit({ ...sendData, id }, id)
        .then(rep => {
          setSend(false)
          if (rep) {
            onChange()
            reset()
            toggle()
            onSuccess('Change completed successfully')
          } else {
            setOpenNotification(true)
            setTypeMessage('error')
            infoTranslate = t('An error has occurred')
            setMessage(infoTranslate)
          }
        })
        .catch(error => {
          setSend(false)
          console.error('Erreur lors de la mise à jour :', error)
          setOpenNotification(true)
          setTypeMessage('error')
          infoTranslate = t('An error has occurred')
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
      code: currentProduit !== null ? currentProduit?.code : '',
      name: currentProduit !== null ? currentProduit?.name : '',
      description: currentProduit !== null ? currentProduit?.description : '',
      modelId: currentProduit && currentProduit?.modelId !== undefined ? currentProduit.modelId : 0,
      fournisseurId: currentProduit && currentProduit?.fournisseurId !== undefined ? currentProduit.fournisseurId : 0,
      pv: currentProduit && currentProduit?.pv !== undefined ? currentProduit.pv : 0,
      stock_min: currentProduit && currentProduit?.stock_min !== undefined ? currentProduit.stock_min : 0
    })
    setId(currentProduit !== null ? currentProduit?.id : -1)
  }, [open, currentProduit])

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
        <Typography variant='h6'>{id === -1 ? 'Ajout de produit' : 'Modification de produit'}</Typography>
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
                sx={{ mb: 4 }}
                label='Code'
                onChange={onChange}
                error={Boolean(errors.code)}
                {...(errors.code && { helperText: errors.code.message })}
              />
            )}
          />
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Nom'
                onChange={onChange}
                error={Boolean(errors.name)}
                {...(errors.name && { helperText: errors.name.message })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Description'
                onChange={onChange}
                error={Boolean(errors.description)}
                {...(errors.description && { helperText: errors.description.message })}
              />
            )}
          />
          <Controller
            name='modelId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='Model'
                error={Boolean(errors.modelId)}
                {...(errors.modelId && { helperText: errors.modelId.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value={0}>Selectionnez un model</MenuItem>
                {models?.map(model => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Controller
            name='fournisseurId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='Fournisseur'
                error={Boolean(errors.fournisseurId)}
                {...(errors.fournisseurId && { helperText: errors.fournisseurId.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value={0}>Selectionnez un fournisseur</MenuItem>
                {fournisseurs?.map(fournisseur => (
                  <MenuItem key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Controller
            name='pv'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Prix de vente'
                onChange={onChange}
                error={Boolean(errors.pv)}
                {...(errors.pv && { helperText: errors.pv.message })}
              />
            )}
          />
          <Controller
            name='stock_min'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Stock minimal'
                onChange={onChange}
                error={Boolean(errors.stock_min)}
                {...(errors.stock_min && { helperText: errors.stock_min.message })}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='outlined' sx={{ mr: 3 }} color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <LoadingButton type='submit' loading={send} endIcon={<SaveIcon />} variant='contained'>
              {t('Submit')}
            </LoadingButton>
          </Box>
        </form>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={openNotification}
          onClose={handleCloseNotification}
          autoHideDuration={5000}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={typeMessage as AlertColor}
            variant='filled'
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
