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
import frLocale from 'date-fns/locale/fr'
import { CardContent, CardHeader, FormControl } from '@mui/material'
import { getHeadersInformation } from 'src/gestion-depot/logic/utils/constant'
import { LoadingButton } from '@mui/lab'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/fr'
import dayjs from 'dayjs'
import StatFactureRegleNonRegle from 'src/gestion-depot/logic/models/StatFactureRegleNonRegle'
import { format, parseISO } from 'date-fns'
import TemplateFactureRegleOuNon from 'src/gestion-depot/views/pdfMake/TemplateFactureRegleOuNon'

interface CellType {
  row: StatFactureRegleNonRegle
}

interface ColumnType {
  [key: string]: any
}

const listeDesFactures = () => {
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
  const [datas, setDatas] = useState<StatFactureRegleNonRegle[]>([])
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  let infoTranslate

  const [downloadCount, setDownloadCount] = useState(0)

  const handleDownload = async() => {
    setDownloadCount(downloadCount + 1)
  }
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const handleStartDateChange = (date: any) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: any) => {
    setEndDate(date)
  }

  const handleSearch = () => {
    if (startDate && endDate) {
      console.log('Date de début:', dayjs(startDate).toISOString().split('T')[0])
      console.log('Date de fin:', dayjs(endDate).toISOString().split('T')[0])
      getListDatas(
        dayjs(startDate).toISOString().split('T')[0] + ' ' + '00:00:00',
        dayjs(endDate).toISOString().split('T')[0] + ' ' + '23:59:00'
      )
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occured')
      setMessage(infoTranslate)
    }
  }

  // Display of columns according to user roles in the Datagrid
  const getColumns = () => {
    const colArray: ColumnType[] = [
      {
        field: 'codeFacture',
        renderHeader: () => (
          <Tooltip title='Code Facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Code Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { code } = row

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
                  {code}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 250
      },
      {
        field: 'createdAt',
        renderHeader: () => (
          <Tooltip title='Date Facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Date Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { createdAt } = row

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
                  {createdAt?.slice(0, -5).replace(/T/g, " ")}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 250
      },
      {
        field: 'client',
        renderHeader: () => (
          <Tooltip title='Client'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Client
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { client } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {client}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 180
      },
      {
        field: 'mt_a_payer',
        renderHeader: () => (
          <Tooltip title='Montant TTC'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              MONTANT TTC
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mt_a_payer } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {mt_a_payer}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 150
      },
      {
        field: 'mt_encaisse',
        renderHeader: () => (
          <Tooltip title='Montant Encaisse'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Montant Encaisse
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mt_encaisse } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {mt_encaisse}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 200
      },
      {
        field: 'mt_restant',
        renderHeader: () => (
          <Tooltip title='Montant Restant'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Montant Restant
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mt_restant } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {mt_restant}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 180
      },
      {
        field: 'statut',
        renderHeader: () => (
          <Tooltip title='Statut'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Qte Restant
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { statut } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {statut}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 180
      }
      // {
      //   flex: 0.15,
      //   field: 'seuil',
      //   renderHeader: () => (
      //     <Tooltip title='Stock Minimal'>
      //       <Typography
      //         noWrap
      //         sx={{
      //           fontWeight: 500,
      //           letterSpacing: '1px',
      //           textTransform: 'uppercase',
      //           fontSize: '0.8125rem'
      //         }}
      //       >
      //         Stock Minimal
      //       </Typography>
      //     </Tooltip>
      //   ),
      //   renderCell: ({ row }: CellType) => {
      //     const { seuil } = row

      //     return (
      //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
      //         <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
      //           <Typography
      //             noWrap
      //             sx={{
      //               fontWeight: 500,
      //               textDecoration: 'none',
      //               color: 'primary.main'
      //             }}
      //           >
      //             {seuil}
      //           </Typography>
      //         </Box>
      //       </Box>
      //     )
      //   }
      // }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListDatas = async (date_debut: string, date_fin: string) => {
    setLoadingSearch(true)
    const dataSearch = {
      date_debut: date_debut || null,
      date_fin: date_fin || null
    }
    try {
      const response = await axios.post(`stat/stock/factures`, dataSearch, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })
      setLoadingSearch(false)

      if (response.data.data) {
        setDatas(response.data.data.data as StatFactureRegleNonRegle[])
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
    getListDatas('', '')
    setColumns(getColumns())
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Statistique Des Factures' sx={{ fontSize: '60px' }} />

          <CardContent>
            <Grid container spacing={1} justifyContent='flex-end'>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl sx={{ minWidth: '80%' }} size='small'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date début'
                      value={startDate}
                      format='DD/MM/YYYY'
                      slotProps={{ textField: { size: 'small' } }}
                      onChange={date => handleStartDateChange(date)}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl sx={{ minWidth: '80%' }} size='small'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date Fin'
                      value={endDate}
                      format='DD/MM/YYYY'
                      slotProps={{ textField: { size: 'small' } }}
                      onChange={date => handleEndDateChange(date)}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'right' }}>
                  <LoadingButton
                    type='submit'
                    color='error'
                    loading={loadingSearch}
                    onClick={() => {
                      startDate != '' || endDate != '' ? handleSearch() : setOpenNotification(true)
                      setTypeMessage('error')
                      infoTranslate = t('Please select any field')
                      setMessage(infoTranslate)
                    }}
                    loadingPosition='end'
                    endIcon={<SearchSharpIcon />}
                    variant='contained'
                  >
                    Rechercher
                  </LoadingButton>

                  <Button
                    sx={{ marginLeft: '5px' }}
                    size='small'
                    variant='contained'
                    onClick={() => {
                      setStartDate(null)
                      setEndDate(null)
                      getListDatas('null', 'null')
                    }}
                  >
                    <AutorenewIcon />
                  </Button>

                  <Button
                    onClick={handleDownload}
                    variant='contained'
                    sx={{ height: '38px', marginLeft: '5px' }}
                  >
                    <span style={{ marginRight: '0.2rem' }}>Exporter</span>
                    <SaveAltIcon />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          {downloadCount > 0 && (
            <TemplateFactureRegleOuNon
              data={datas as never[]}
              fileName={`Statistique_factures_${downloadCount}`}
              date_debut={ startDate ?
                format(parseISO(dayjs(startDate).toISOString().split('T')[0]), 'EEEE dd MMMM yyyy', {
                  locale: frLocale
                }) : ''
              }
              date_fin={ endDate ?
                format(parseISO(dayjs(endDate).toISOString().split('T')[0]), 'EEEE dd MMMM yyyy', {
                  locale: frLocale
                }) : ''
              }
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

export default listeDesFactures
