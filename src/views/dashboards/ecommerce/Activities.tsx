/* eslint-disable react-hooks/exhaustive-deps */
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import axios from 'src/configs/axios-config'
import { getHeadersInformation } from 'src/gestion-depot/logic/utils/constant'
import { t } from 'i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { useEffect, useState } from 'react'
import { Alert, AlertColor, Snackbar } from '@mui/material'

const Activities = () => {
  let infoTranslate
  const [productCount, setProductCount] = useState<string>('')
  const [factureCount, setFactureCount] = useState<string>('')
  const [reglementMoisCount, setReglementMoisCount] = useState<string>('')
  const [reglementDayCount, setReglementDayCount] = useState<string>('')

  // const [factureImpayee, setFactureImpayee] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  const handleLoadData = async () => {
    try {
      const response = await axios.get(`produits/count`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })

      if (response.data.data) {
        setProductCount(response.data.data.produitNumber)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occured1')
      setMessage(infoTranslate)
    }

    try {
      const response = await axios.get(`stock/factures/jour`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })

      if (response.data.data) {
        setFactureCount(response.data.data.factureNb || 0)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occured2')
      setMessage(infoTranslate)
    }

    try {
      const response = await axios.get(`reglements/month/count`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })

      if (response.data.data) {
        setReglementMoisCount(response.data.data.reglementMonthTotalNumber)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occured2')
      setMessage(infoTranslate)
    }

    try {
      const response = await axios.get(`reglements/day/count`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })

      if (response.data.data) {
        setReglementDayCount(response.data.data.reglementDayTotalNumber)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occured3')
      setMessage(infoTranslate)
    }

    // try {
    //   const response = await axios.get(`factures/impayee/count`, {
    //     headers: {
    //       ...getHeadersInformation(),
    //       'Content-Type': 'application/json'
    //     }
    //   })

    //   if (response.data.data) {
    //     setFactureImpayee(response.data.data.factureTotalImpayeeNumber)
    //   }
    // } catch (error) {
    //   console.error('Error submitting form:', error)
    //   setOpenNotification(true)
    //   setTypeMessage('error')
    //   infoTranslate = t('An error has occured4')
    //   setMessage(infoTranslate)
    // }
  }

  useEffect(() => {
    handleLoadData()
  }, [])

  return (
    <Card>
      <CardHeader title={t('Activities')} />
      <CardContent sx={{ pt: theme => `${theme.spacing(7)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon='tabler:affiliate' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{productCount}</Typography>
                <Typography variant='body2'>{t('Nb Produits Stock')}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='info' sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon='tabler:affiliate' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{factureCount}</Typography>
                <Typography variant='body2'>{t('Nb Factures Du Jours')}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='error' sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon='tabler:wallet' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{reglementMoisCount || 0}</Typography>
                <Typography variant='body2'>{t('Reglement du Mois')}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='info' sx={{ mr: 4, width: 45, height: 42 }}>
                <Icon icon='tabler:wallet' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{reglementDayCount || 0}</Typography>

                <Typography variant='body2'>{t('Reglement du Jour')}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      {/* Notification */}
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
    </Card>
  )
}

export default Activities
