/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import axios from 'src/configs/axios-config'
import { t } from 'i18next'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

// import { DateField } from '@mui/x-date-pickers/DateField'

// import PdfDocument from 'src/gestion-depot/views/pdfMake/PdfDocument'
import { CardContent, CardHeader, FormControl } from '@mui/material'
import StatParProducteur from 'src/gestion-depot/logic/models/StatParProducteur'
import { getHeadersInformation } from 'src/gestion-depot/logic/utils/constant'
import TemplateDesStatsParProducteursR1 from 'src/gestion-depot/views/pdfMake/TemplateDesStatsParProducteursR1'
import { LoadingButton } from '@mui/lab'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/fr'
import dayjs from 'dayjs'
import StatFactureReglement from 'src/gestion-depot/logic/models/StatFactureReglement'
import StatReglementPerMonth from 'src/gestion-depot/logic/models/StatReglementPerMonth'
import TemplateCaisseMensuelle from 'src/gestion-depot/views/pdfMake/TemplateCaisseMensuelle'

interface CellType {
  row: StatReglementPerMonth
}

interface ColumnType {
  [key: string]: any
}

const listeDesReglementPerMonth = () => {
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

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusDatas, setStatusDatas] = useState<boolean>(true)
  const [datas, setDatas] = useState<StatReglementPerMonth[]>([])
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  let infoTranslate


  // Display of columns according to user roles in the Datagrid
  const getColumns = () => {
    const colArray: ColumnType[] = [
      {
        field: 'moisAnnee',
        renderHeader: () => (
          <Tooltip title='Période'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Période
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { moisAnnee } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  {moisAnnee}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 400
      },
      {
        field: 'Mtotal',
        renderHeader: () => (
          <Tooltip title={t('Total')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Total')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { Mtotal } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  {Mtotal}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 400
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListDatas = async () => {
    setLoadingSearch(true)
    try {
      const response = await axios.get(`reglements/situation/mois`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })
      setLoadingSearch(false)
      console.log('datas :::', response.data.data.data)

      if (response.data.data) {
        setDatas(response.data.data.data as StatReglementPerMonth[])
        setStatusDatas(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occured')
      setMessage(infoTranslate)
    }
  }

  // Control search data in datagrid
  useEffect(() => {
    getListDatas()
    setColumns(getColumns())
  }, [])

  const [downloadCount, setDownloadCount] = useState(0)

  const handleDownload = () => {
    setDownloadCount(downloadCount + 1)
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='SATISTIQUE CAISSE MENSUELLE' sx={{ fontSize: '60px' }} />

          <CardContent>
            <Grid container spacing={1} justifyContent='flex-end'>
                <Box>
                  <Button
                    sx={{ marginLeft: '5px' }}
                    size='small'
                    variant='contained'
                    onClick={() => {
                      getListDatas()
                    }}
                  >
                    <AutorenewIcon />
                  </Button>

                  <Button
                    onClick={() => {
                      handleDownload()
                    }}
                    variant='contained'
                    sx={{ height: '38px', marginLeft: '5px' }}
                  >
                    <span style={{ marginRight: '0.2rem' }}>Exporter</span>
                    <SaveAltIcon />
                  </Button>
                </Box>
            </Grid>
          </CardContent>

         

          {downloadCount > 0 && (
            <TemplateCaisseMensuelle
              data={datas as never[]}
              fileName={`Statistique_caisse_mensuelle_${downloadCount}`}
            />
          )}

          <DataGrid
            autoHeight
            loading={statusDatas}
            rowHeight={62}
            rows={datas as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

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
    </Grid>
  )
}

export default listeDesReglementPerMonth
