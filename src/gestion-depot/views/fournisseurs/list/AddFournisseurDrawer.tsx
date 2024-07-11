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
import FournisseurService from 'src/gestion-depot/logic/services/FournisseurService'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { TextField } from '@mui/material'
import Fournisseur from 'src/gestion-depot/logic/models/Fournisseur'

interface ModelData {
  id?: number
  name: string
  description: string
}

interface SidebarAddFournisseurType {
  open: boolean
  toggle: () => void
  onChange: () => void
  onSuccess: (data: any) => void
  currentFournisseur: null | Fournisseur
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  description: yup
    .string()
    .min(1, obj => {
      if (obj.value.length === 0) {
        return t('Description field is required')
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return t('invalid description')
      } else {
        return ''
      }
    })
    .required(),
  name: yup
    .string()
    .min(1, obj => {
      if (obj.value.length === 0) {
        return t('Name field is required')
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return t('Name must be at least 3 characters')
      } else {
        return ''
      }
    })
    .required()
})

const defaultValues = {
  name: '',
  description: ''
}

const SidebarAddModel = (props: SidebarAddFournisseurType) => {
  // ** Props
  const { open, toggle, onChange, onSuccess, currentFournisseur } = props

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
    const fournisseurService = new FournisseurService()
    setSend(true)

    const sendData = {
      name: data.name,
      description: data.description
    }

    if (id === -1) {
      const result = await fournisseurService.createFournisseur(sendData)
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
      fournisseurService
        .updateFournisseur({ ...sendData, id }, id)
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
      name: currentFournisseur !== null ? currentFournisseur?.name : '',
      description: currentFournisseur !== null ? currentFournisseur?.description : ''
    })
    setId(currentFournisseur !== null ? currentFournisseur?.id : -1)
  }, [open, currentFournisseur])

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
        <Typography variant='h6'>{id === -1 ? 'Ajout de fournisseur' : 'Modification de fournisseur'}</Typography>
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
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label={t('Name')}
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
                label={t('description')}
                onChange={onChange}
                error={Boolean(errors.description)}
                {...(errors.description && { helperText: errors.description.message })}
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

export default SidebarAddModel
