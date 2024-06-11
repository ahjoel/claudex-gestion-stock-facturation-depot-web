// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
// import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import LoginIcon from '@mui/icons-material/Login'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import { t } from 'i18next'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// import { useSettings } from 'src/@core/hooks/useSettings'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { Alert, AlertColor, CardContent, Snackbar, TextField } from '@mui/material'


// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

// Validation of form
const schema = yup.object().shape({
  username: yup
    .string()
    .min(2, obj => {
      if (obj.value.length === 0) {
        return t('Username field is required')
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return t('Username must be at least 2 characters')
      } else {
        return ''
      }
    })
    .required(() => t('Email is a required field') as string),
  password: yup
    .string()
    .min(1, obj => {
      if (obj.value.length === 0) {
        return t('Password field is required')
      } else if (obj.value.length > 0 && obj.value.length < obj.min) {
        return t('Password must be at least 1 characters')
      } else {
        return ''
      }
    })
    .required()
})

const defaultValues = {
  username: '',
  password: ''
}

interface FormData {
  username: string
  password: string
}

const LoginPage = () => {
  let infoTranslate
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [connexion, setConnexion] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // Sneakbar - Notification
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = (data: FormData) => {

    const { username, password } = data

    // console.log("username :::::::", username)
    // console.log("password :::::::", password)
    setConnexion(true)

    // Connexion to backend
    auth.login({ username, password }, (response) => {

      // console.log('network :::::', response);
      setConnexion(false)

      // Error internet connexion are disabled
      if (response.code === 'ERR_NETWORK') {
        // console.log('Pas internet', response.message);
        setOpen(true);
        setTypeMessage("error");
        infoTranslate = t('Network error')
        setMessage(infoTranslate)
      }

      // Error server not respond or timeout of 5s exceeded
      if (response.code === 'ECONNABORTED') {
        // console.log('Pas d\'internet ', response.message);
        setOpen(true);
        setTypeMessage("error");
        infoTranslate = t('Network error')
        setMessage(infoTranslate)
      }

      // Error credentials not found in db or any role has not attributed for user
      if (response.status + '' === '401') {
        setOpen(true);
        setTypeMessage("error");
        infoTranslate = t('You are not authorized to access this site')
        setMessage(infoTranslate)
      }

      if (response.status + '' === '400') {
        setOpen(true);
        setTypeMessage("error");
        infoTranslate = t('Username or password incorrect')
        setMessage(infoTranslate)
      }

    })
  }

  useEffect(() => {
    const infoSession = window.localStorage.getItem('infoSession')
    if (infoSession != null) {
      setOpen(true);
      setTypeMessage("error");
      setMessage(`${infoSession}`)
    }
  }, [])

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={34} height={23.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                />
              </svg>
              <Typography sx={{ ml: 2.5, fontWeight: 600, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                Connectez-vous pour utiliser l'application
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      fullWidth
                      autoFocus
                      label={t('Username')}
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      placeholder=''
                      error={Boolean(errors.username)}
                      {...(errors.username && { helperText: errors.username.message })}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 1.5 }}>
                <InputLabel htmlFor='auth-login-password'>{t('Password')}</InputLabel>

                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label={t('Password')}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}

              </FormControl>

              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
              </Box>

              <LoadingButton
                fullWidth
                type='submit'
                color='error'
                loading={connexion}
                loadingPosition='end'
                endIcon={<LoginIcon />}
                variant='contained'
                sx={{ mb: 4 }}
              >
                {t('Login')}
              </LoadingButton>



              <Divider
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.disabled',
                  '& .MuiDivider-wrapper': { px: 6 },
                  my: theme => `${theme.spacing(6)} !important`
                }}
              >
                {"Contact administrator"}
              </Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box>

            </form>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} onClose={handleClose} autoHideDuration={5000}>
              <Alert
                onClose={handleClose}
                severity={typeMessage as AlertColor}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {message}
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
