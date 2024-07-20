// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { t } from 'i18next'

const Illustration = styled('img')(({ theme }) => ({
  right: 20,
  bottom: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    right: 5,
    width: 110
  }
}))

const WelcomeUser = () => {
  const router = useRouter()
  const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  const profile = userData?.profile
  const { user } = useAuth()

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h4' sx={{ mb: 0.2 }}>
          {t('Bienvenue')}{' '}
          <span
            style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '25px', width: '100px', maxWidth: '100%' }}
          >
            {user?.lastname} {user?.firstname}
          </span>{' '}
          🎉
        </Typography>
        <Typography sx={{ mb: 1, color: 'text.secondary' }}>{t('Commencez à consulter...')}</Typography>
        <br />
        <Button variant='contained' onClick={() => router.push('/gestion-depot/stockDispoR1')}>
          {t('Stock Disponible')}
        </Button>

        <Illustration width={105} alt='bars_icon' src='/images/snb.png' sx={{marginBottom: '10px'}}/>
      </CardContent>
    </Card>
  )
}

export default WelcomeUser
