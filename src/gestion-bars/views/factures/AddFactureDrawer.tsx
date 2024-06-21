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
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { MenuItem, TextField } from '@mui/material'
import Facture from 'src/gestion-bars/logic/models/Facture'
import FactureService from 'src/gestion-bars/logic/services/FactureService'
import CustomTextField from 'src/@core/components/mui/text-field'
import Client from 'src/gestion-bars/logic/models/Client'

interface ModelData {
  id?: number
  code: string
  client_id: number
  taxe: number
}

interface SidebarAddFactureType {
  open: boolean
  toggle: () => void
  onEdit: () => void
  clients: Client[]
  onSuccess: (data: any) => void
  currentFacture: null | Facture
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  code: yup.string().required(() => 'Le champ code facture est obligatoire'),
  client_id: yup.number().required(() => 'Le champ client est obligatoire')
})

const defaultValues = {
  code: '',
  client_id: 0,
  taxe: 0
}

const SidebarAddFacture = (props: SidebarAddFactureType) => {
  // ** Props
  const { open, toggle, onEdit, onSuccess, clients, currentFacture } = props

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

  const onSubmit = async (data: ModelData) => {
    const factureService = new FactureService()
    setSend(true)

    const sendData = {
      code: data.code,
      client_id: Number(data.client_id),
      taxe: data.taxe
    }

    if (id != -1) {
      factureService
        .updateFacture({ ...sendData, id }, id)
        .then(rep => {
          setSend(false)
          if (rep) {
            onEdit()
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
      code: currentFacture !== null ? currentFacture?.code : '',
      client_id: currentFacture && currentFacture?.client_id !== undefined ? currentFacture.client_id : 0,
      taxe: currentFacture !== null ? currentFacture?.taxe : 0
    })
    setId(currentFacture !== null ? currentFacture?.id : -1)
  }, [open, currentFacture])

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
        <Typography variant='h6'>{id === -1 ? 'Ajout de facture' : 'Modification de facture'}</Typography>
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
            name='client_id'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                select
                label='Client'
                sx={{ mb: 4 }}
                error={Boolean(errors.client_id)}
                {...(errors.client_id && { helperText: errors.client_id.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''>Sélectionnez la table client</MenuItem>
                {clients?.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Controller
            name='taxe'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Tax'
                onChange={onChange}
                error={Boolean(errors.taxe)}
                {...(errors.taxe && { helperText: errors.taxe.message })}
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

export default SidebarAddFacture
