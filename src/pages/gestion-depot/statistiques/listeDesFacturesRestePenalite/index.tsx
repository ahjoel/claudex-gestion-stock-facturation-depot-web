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
import StatFactureReglement from 'src/gestion-depot/logic/models/StatFactureReglement'
import { format, parseISO } from 'date-fns'
import TemplateFactureRegleOuNon from 'src/gestion-depot/views/pdfMake/TemplateFactureRegleOuNon'
import TemplateFactureReglement from 'src/gestion-depot/views/pdfMake/TemplateFactureReglement'
import StatFactureArchivee from 'src/gestion-depot/logic/models/StatFactureArchivee'
import TemplateFactureArchivees from 'src/gestion-depot/views/pdfMake/TemplateFactureArchivees'
import StatFacturePenalite from 'src/gestion-depot/logic/models/StatFacturePenalite'
import TemplateFactureImpayeePenalite from 'src/gestion-depot/views/pdfMake/TemplateFactureImpayeePenalite'

interface CellType {
  row: StatFacturePenalite
}

interface ColumnType {
  [key: string]: any
}

const listeDesFacturesRestePenalite = () => {
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
  const [datas, setDatas] = useState<StatFactureReglement[]>([])
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  let infoTranslate

  const [downloadCount, setDownloadCount] = useState(0)

  const handleDownload = async () => {
    setDownloadCount(downloadCount + 1)
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
        width: 200
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
        width: 200
      },
      {
        field: 'nbJour',
        renderHeader: () => (
          <Tooltip title='Nombre de Jours'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Nbr. Jours
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { nbJour } = row

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
                  {nbJour}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 200
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
        width: 200
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
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListDatas = async () => {
    setLoadingSearch(true)
    try {
      const response = await axios.get(`stat/stock/factures/penalitees`, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })
      setLoadingSearch(false)

      if (response.data.data) {
        setDatas(response.data.data.data as StatFactureArchivee[])
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Factures Impayées' sx={{ fontSize: '60px' }} />

          <CardContent>
            <Grid container justifyContent='flex-end'>
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
                onClick={handleDownload}
                variant='contained'
                sx={{ height: '38px', marginLeft: '5px' }}
              >
                <span style={{ marginRight: '0.2rem' }}>Exporter</span>
                <SaveAltIcon />
              </Button>

            </Grid>
          </CardContent>

          {downloadCount > 0 && (
            <TemplateFactureImpayeePenalite
              data={datas as never[]}
              fileName={`Statistique_factures_impayees_${downloadCount}`}
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

export default listeDesFacturesRestePenalite
