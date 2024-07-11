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
import CustomTextField from 'src/@core/components/mui/text-field'
import UserService from 'src/gestion-depot/logic/services/UserService'
import User from 'src/gestion-depot/logic/models/User'

interface UserData {
  id?: number
  username: string
  firstname: string
  lastname: string
  email: string
  profile: string
  zone: string
  password: string
}

interface SidebarAddUser {
  open: boolean
  toggle: () => void
  handleChange: () => void
  onSuccess: (data: any) => void
  currentUser: null | User
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, obj => {
      if (obj.value.length === 0) {
        return 'Le champ nom utilisateur est obligatoire'
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return 'Le champ nom utilisateur doit comporter au moins 3 caractères'
      } else {
        return ''
      }
    })
    .required(),
  firstname: yup
    .string()
    .min(3, obj => {
      if (obj.value.length === 0) {
        return 'Le champ prénom est obligatoire'
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return 'Le champ prénom doit comporter au moins 3 caractères'
      } else {
        return ''
      }
    })
    .required(),
  lastname: yup
    .string()
    .min(3, obj => {
      if (obj.value.length === 0) {
        return 'Le champ nom est obligatoire'
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return 'Nom invalide'
      } else {
        return ''
      }
    })
    .required(),
  zone: yup.string().required(() => 'Le champ zone est obligatoire'),
  email: yup.string().required(() => 'Le champ email est obligatoire'),
  password: yup.string().required(() => 'Le champ password est obligatoire'),
  profile: yup.string().required(() => 'Le champ profil est obligatoire')
})

const defaultValues = {
  username: '',
  firstname: '',
  lastname: '',
  zone: '',
  email: '',
  profile: '',
  password: ''
}

const SidebarAddUser = (props: SidebarAddUser) => {
  // ** Props
  const { open, toggle, handleChange, onSuccess, currentUser } = props

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

  const onSubmit = async (data: UserData) => {
    const userService = new UserService()
    setSend(true)

    const sendData = {
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      zone: data.zone,
      profile: data.profile,
      password: data.password
    }

    if (id === -1) {
      const result = await userService.createUser(sendData)
      setSend(false)

      if (result.success) {
        handleChange()
        reset()
        toggle()
        onSuccess('Registration completed successfully')
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage(result.description)
      }
    } else {
      userService
        .updateUser({ ...sendData, id }, id)
        .then(rep => {
          setSend(false)
          if (rep) {
            handleChange()
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
      username: currentUser !== null ? currentUser?.username : '',
      firstname: currentUser !== null ? currentUser?.firstname : '',
      lastname: currentUser !== null ? currentUser?.lastname : '',
      email: currentUser !== null ? currentUser?.email : '',
      zone: currentUser !== null ? currentUser?.zone : '',
      profile: currentUser !== null ? currentUser?.profile : '',
      password: currentUser !== null ? currentUser?.password : ''
    })
    setId(currentUser !== null ? currentUser?.id : -1)
  }, [open, currentUser])

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
        <Typography variant='h6'>{id === -1 ? "Ajout d'utilisateur" : "Modification d'utilisateur"}</Typography>
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
            name='username'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Nom Utilisateur'
                onChange={onChange}
                error={Boolean(errors.username)}
                {...(errors.username && { helperText: errors.username.message })}
              />
            )}
          />
          <Controller
            name='lastname'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Nom'
                onChange={onChange}
                error={Boolean(errors.lastname)}
                {...(errors.lastname && { helperText: errors.lastname.message })}
              />
            )}
          />
          <Controller
            name='firstname'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Prénom'
                onChange={onChange}
                error={Boolean(errors.firstname)}
                {...(errors.firstname && { helperText: errors.firstname.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Email'
                onChange={onChange}
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='profile'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='Profil'
                error={Boolean(errors.profile)}
                {...(errors.profile && { helperText: errors.profile.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value={``}>Selectionnez un profil</MenuItem>
                <MenuItem value={`SUPER-ADMIN`}>SUPER-ADMIN</MenuItem>
                <MenuItem value={`ADMINISTRATEUR`}>ADMINISTRATEUR</MenuItem>
                <MenuItem value={`FACTURIER-R1`}>FACTURIER-R1</MenuItem>
                <MenuItem value={`FACTURIER-RC`}>FACTURIER-RC</MenuItem>
                <MenuItem value={`GERANT`}>GERANT</MenuItem>
              </CustomTextField>
            )}
          />
          <Controller
            name='zone'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='Zone'
                error={Boolean(errors.zone)}
                {...(errors.zone && { helperText: errors.zone.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value={''}>Selectionnez un fournisseur</MenuItem>
                <MenuItem value={'R1'}>R1</MenuItem>
                <MenuItem value={'RC'}>RC</MenuItem>
              </CustomTextField>
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Mot de passe'
                onChange={onChange}
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: errors.password.message })}
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

export default SidebarAddUser
