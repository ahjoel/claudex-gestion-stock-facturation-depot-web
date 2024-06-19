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
import axios from 'src/configs/axios-config'
import { t } from 'i18next'
import { CardContent, CardHeader } from '@mui/material'
import { getHeadersInformation } from 'src/gestion-bars/logic/utils/constant'
import 'dayjs/locale/fr'
import StatCaisse from 'src/gestion-bars/logic/models/StatCaisse'
import TemplateCaisseMensuelle from 'src/gestion-bars/views/pdfMake/TemplateCaisseMensuelle'

interface CellType {
  row: StatCaisse
}

interface ColumnType {
  [key: string]: any
}

const listeCaisseMensuelle = () => {
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
  const [datas, setDatas] = useState<StatCaisse[]>([])

  // const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  let infoTranslate

  // const [startDate, setStartDate] = useState(null)
  // const [endDate, setEndDate] = useState(null)

  // const handleStartDateChange = (date: any) => {
  //   setStartDate(date)
  // }

  // const handleEndDateChange = (date: any) => {
  //   setEndDate(date)
  // }

  // const handleSearch = () => {
  //   if (startDate && endDate) {
  //     // console.log('Date de début:', dayjs(startDate).toISOString().split('T')[0])
  //     // console.log('Date de fin:', dayjs(endDate).toISOString().split('T')[0])
  //     getListDatas()
  //   } else {
  //     setOpenNotification(true)
  //     setTypeMessage('error')
  //     infoTranslate = t('An error has occured')
  //     setMessage(infoTranslate)
  //   }
  // }

  // Display of columns according to user roles in the Datagrid
  const getColumns = () => {
    const colArray: ColumnType[] = [
      {
        flex: 0.18,
        field: 'id',
        renderHeader: () => (
          <Tooltip title='Numéro'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              #
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { id } = row

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
                  {id}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.18,
        field: 'Mois_Annee',
        renderHeader: () => (
          <Tooltip title={t('Mois_Annee')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Mois_Annee')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { Mois_Annee } = row

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
                  {Mois_Annee}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'MontantTotal',
        renderHeader: () => (
          <Tooltip title='MontantTotal'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Montant Total
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { MontantTotal } = row

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
                  {MontantTotal}
                </Typography>
              </Box>
            </Box>
          )
        }
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListDatas = async () => {
    // setLoadingSearch(true)

    try {
      const response = await axios.get(`caisse/mois`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })

      // setLoadingSearch(false)
      console.log('datas :::', response.data.data.dataCaissMoi)

      if (response.data.data) {
        setDatas(response.data.data.dataCaissMoi as StatCaisse[])
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
          <CardHeader title='Caisse mensuelle' sx={{ fontSize: '60px' }} />

          <CardContent>
            <Grid container spacing={1} justifyContent='flex-end'>
              <Grid item>
                {/* <FormControl sx={{ m: 1, minWidth: 50 }} size='small'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date début'
                      value={startDate}
                      format='DD/MM/YYYY'
                      slotProps={{ textField: { size: 'small' } }}
                      onChange={date => handleStartDateChange(date)}
                    />
                  </LocalizationProvider>
                </FormControl> */}
              </Grid>

              <Grid item>
                {/* <FormControl sx={{ m: 1, minWidth: 50 }} size='small'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date Fin'
                      value={endDate}
                      format='DD/MM/YYYY'
                      slotProps={{ textField: { size: 'small' } }}
                      onChange={date => handleEndDateChange(date)}
                    />
                  </LocalizationProvider>
                </FormControl> */}
              </Grid>

              <Grid item lg={3} md={3} sm={3} xs={3} sx={{ marginTop: '4px', marginLeft: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'right' }}>
                  {/* <LoadingButton
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
                    {t('Search')}
                  </LoadingButton> */}

                  {/* <Button
                    sx={{ marginLeft: '5px' }}
                    size='small'
                    variant='contained'
                    onClick={() => {
                      // setStartDate(null)
                      // setEndDate(null)
                      getListDatas()
                    }}
                  >
                    <AutorenewIcon />
                  </Button> */}

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

export default listeCaisseMensuelle
