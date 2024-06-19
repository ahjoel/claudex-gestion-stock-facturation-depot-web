import React, { useState, useEffect, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/gestion-bars/views/rc/entreerc/list/TableHeader'
import AddEntreeRCDrawer from 'src/gestion-bars/views/rc/entreerc/list/AddEntreeRCDrawer'
import { t } from 'i18next'
import Produit from 'src/gestion-bars/logic/models/Produit'
import ProduitService from 'src/gestion-bars/logic/services/ProduitService'
import EntreeRCService from 'src/gestion-bars/logic/services/EntreeRCService'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import EntreeRC from 'src/gestion-bars/logic/models/EntreeRC'

interface CellType {
  row: EntreeRC
}

interface ColumnType {
  [key: string]: any
}

const EntreeRCList = () => {
  const produitService = new ProduitService()
  const entreeRCService = new EntreeRCService()
  const produitId = 0

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteEntreeRC = (entreeRC: EntreeRC) => {
    setCurrentEntreeRC(entreeRC)
    setComfirmationMessage('Voulez-vous réellement supprimer ce produit du stock ?')
    setComfirmationFunction(() => () => deleteEntreeRC(entreeRC))
    setOpen(true)
  }

  const deleteEntreeRC = async (entreeRC: EntreeRC) => {
    setSendDelete(true)

    try {
      const rep = await entreeRCService.delete(entreeRC.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Produit du stock supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Produit du stock non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      setSendDelete(false)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

  // Search State
  const [valuerc, setValuerc] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleSuccess = (message: string, type = 'success') => {
    setOpenNotification(true)
    setTypeMessage(type)
    const messageTrans = t(message)
    setMessage(messageTrans)
  }

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusEntreeRC, setStatusEntreeRC] = useState<boolean>(true)
  const [entreesRC, setEntreesRC] = useState<EntreeRC[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addEntreeRCOpen, setAddEntreeRCOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)
  const [currentEntreeRC, setCurrentEntreeRC] = useState<null | EntreeRC>(null)

  const [produits, setProduits] = useState<Produit[]>([])

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateEntreeRC: (entreeRC: EntreeRC) => void) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.15,
        field: 'code',
        renderHeader: () => (
          <Tooltip title='Code'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Code
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
        }
      },
      {
        flex: 0.25,
        field: 'createdAt',
        renderHeader: () => (
          <Tooltip title='Date creation'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Date creation
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
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {createdAt.slice(0, -5).replace(/T/g, ' ')}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'produit',
        renderHeader: () => (
          <Tooltip title='Produit'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Produit
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { produit } = row

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
                  {produit.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'model',
        renderHeader: () => (
          <Tooltip title='Model'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Model
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { model } = row

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
                  {model.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'fournisseur',
        renderHeader: () => (
          <Tooltip title='Fournisseur'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Fournisseur
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { fournisseur } = row

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
                  {fournisseur}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
        field: 'qte',
        renderHeader: () => (
          <Tooltip title='Quantité'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Quantité
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { qte } = row

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
                  {qte}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.1,
        field: 'stock',
        renderHeader: () => (
          <Tooltip title='Stock'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Stock
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { stock } = row

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
                  {stock.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
        sortable: false,
        field: 'actions',
        renderHeader: () => (
          <Tooltip title={t('Actions')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Actions')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Mettre à jour un produit du stock'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateEntreeRC(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                  <Icon icon='tabler:edit' />
                </Box>
              </IconButton>
            </Tooltip>

            <Tooltip title='Supprimer'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleDeleteEntreeRC(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.error.main }}>
                  <Icon icon='tabler:trash' />
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListEntreesRC = async (page: number, pageSize: number) => {
    const result = await entreeRCService.listEntreesRC({ page: page + 1, length: pageSize })

    if (result.success) {
      const queryLowered = valuerc.toLowerCase()

      const filteredData = (result.data as EntreeRC[]).filter(entree => {
        return (
          entree.code.toString().toLowerCase().includes(queryLowered) ||
          entree.createdAt.toString().toLowerCase().includes(queryLowered) ||
          (entree.produit && entree.produit.toString().toLowerCase().includes(queryLowered)) ||
          entree.model.toString().toLowerCase().includes(queryLowered) ||
          entree.fournisseur.toLowerCase().includes(queryLowered) ||
          entree.qte.toString().toLowerCase().includes(queryLowered) ||
          entree.stock.toString().toLowerCase().includes(queryLowered)
        )
      })

      setEntreesRC(filteredData)
      setStatusEntreeRC(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleLoadingProduits = async () => {
    const result = await produitService.listProduitsRcLongue()

    if (result.success) {
      setProduits(result.data as Produit[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListEntreesRC(0, 10)
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    handleLoadingProduits()
    setColumns(getColumns(handleUpdateEntreeRC))
  }, [valuerc])

  const handleFilter = useCallback((val: string) => {
    setValuerc(val)
  }, [])

  // Show Modal
  const toggleAddEntreeRCDrawer = () => setAddEntreeRCOpen(!addEntreeRCOpen)

  // Add Data
  const handleCreateEntreeRC = () => {
    setCurrentEntreeRC(null)
    toggleAddEntreeRCDrawer()
  }

  // Update Data
  const handleUpdateEntreeRC = (entreeRC: EntreeRC) => {
    setCurrentEntreeRC(entreeRC)
    toggleAddEntreeRCDrawer()
  }

  // Pagination
  useEffect(() => {
    getListEntreesRC(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={valuerc}
            handleFilter={handleFilter}
            toggle={handleCreateEntreeRC}
            onReload={() => {
              setValuerc('')
              handleChange()
            }}
          />

          <DataGrid
            autoHeight
            loading={statusEntreeRC}
            rowHeight={62}
            rows={entreesRC as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationMode='server'
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {/* Add or Update Right Modal */}
      <AddEntreeRCDrawer
        open={addEntreeRCOpen}
        toggle={toggleAddEntreeRCDrawer}
        onChange={handleChange}
        currentEntreeRC={currentEntreeRC}
        onSuccess={handleSuccess}
        produits={produits}
        produitId={produitId}
      />

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
          sx={{ width: 'C00%' }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Delete Modal Confirmation */}
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason === 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>{t('Confirmation')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{t(comfirmationMessage)}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} color='secondary'>
            {t('Cancel')}
          </Button>
          <LoadingButton
            onClick={() => {
              comfirmationFunction()
            }}
            loading={sendDelete}
            endIcon={<DeleteIcon />}
            variant='contained'
            color='error'
          >
            {t('Supprimer')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default EntreeRCList
