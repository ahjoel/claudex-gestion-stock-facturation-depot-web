/* eslint-disable react-hooks/exhaustive-deps */
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
import TableHeader from 'src/gestion-depot/views/produits/list/TableHeader'
import AddProduitDrawer from 'src/gestion-depot/views/produits/list/AddProduitDrawer'
import { t } from 'i18next'
import Produit from 'src/gestion-depot/logic/models/Produit'
import ProduitService from 'src/gestion-depot/logic/services/ProduitService'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import Model from 'src/gestion-depot/logic/models/Model'
import Fournisseur from 'src/gestion-depot/logic/models/Fournisseur'
import ModelService from 'src/gestion-depot/logic/services/ModelService'
import FournisseurService from 'src/gestion-depot/logic/services/FournisseurService'
import TemplateListeDesProduits from 'src/gestion-depot/views/pdfMake/TemplateListeDesProduits'

// import PdfDocument from 'src/gestion-depot/views/pdfMake/PdfDocument'
// import TemplateListeDesProduits2 from 'src/gestion-depot/views/pdfMake/TemplateListeDesProduits2'

interface CellType {
  row: Produit
}

interface ColumnType {
  [key: string]: any
}

const ProduitList = () => {
  const produitService = new ProduitService()
  const modelService = new ModelService()
  const fournisseurService = new FournisseurService()
  const modelId = 0
  const fournisseurId = 0

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteProduit = (produit: Produit) => {
    setCurrentProduit(produit)
    setComfirmationMessage('Voulez-vous réellement supprimer ce produit ?')
    setComfirmationFunction(() => () => deleteProduit(produit))
    setOpen(true)
  }

  const deleteProduit = async (produit: Produit) => {
    setSendDelete(true)

    try {
      const rep = await produitService.delete(produit.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Produit supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Produit non trouvé')
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
  const [value, setValue] = useState<string>('')

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
  const [statusProduits, setStatusProduits] = useState<boolean>(true)
  const [produits, setProduits] = useState<Produit[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addProduitOpen, setAddProduitOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)
  const [currentProduit, setCurrentProduit] = useState<null | Produit>(null)

  const [models, setModels] = useState<Model[]>([])
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateProduit: (produit: Produit) => void) => {
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
        flex: 0.15,
        field: 'name',
        renderHeader: () => (
          <Tooltip title={t('Name')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Name')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { name } = row

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
                  {name}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.18,
        field: 'description',
        renderHeader: () => (
          <Tooltip title='Description'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Description
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { description } = row

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
                  {description}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
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
        flex: 0.15,
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
                  {fournisseur.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
        field: 'pv',
        renderHeader: () => (
          <Tooltip title='Prix de vente'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Prix de vente
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { pv } = row

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
                  {pv}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
        field: 'seuil',
        renderHeader: () => (
          <Tooltip title='Stock Minimal'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Stock Minimal
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { seuil } = row

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
                  {seuil}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.1,
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
            <Tooltip title='Mettre à jour un produit'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateProduit(row)
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
                  handleDeleteProduit(row)
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
  const getListProduits = async (page: number, pageSize: number) => {
    const result = await produitService.listProduits({ page: page + 1, length: pageSize })

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Produit[]).filter(produit => {
        return (
          produit.code.toLowerCase().includes(queryLowered) ||
          produit.name.toLowerCase().includes(queryLowered) ||
          produit.description.toLowerCase().includes(queryLowered) ||
          (produit.model && produit.model.toString().toLowerCase().includes(queryLowered)) ||
          (produit.fournisseur && produit.fournisseur.toString().toLowerCase().includes(queryLowered)) ||
          produit.pv.toString().toLowerCase().includes(queryLowered) ||
          produit.seuil.toString().toLowerCase().includes(queryLowered)
        )
      })

      setProduits(filteredData)
      setStatusProduits(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleLoadingModels = async () => {
    const result = await modelService.readAllModels()

    if (result.success) {
      setModels(result.data as Model[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleLoadingFournisseurs = async () => {
    const result = await fournisseurService.readAllFournisseurs()

    if (result.success) {
      setFournisseurs(result.data as Fournisseur[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListProduits(0, 10)
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    handleLoadingModels()
    handleLoadingFournisseurs()
    setColumns(getColumns(handleUpdateProduit))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // Show Modal
  const toggleAddProduitDrawer = () => setAddProduitOpen(!addProduitOpen)

  // Add Data
  const handleCreateProduit = () => {
    setCurrentProduit(null)
    toggleAddProduitDrawer()
  }

  // Update Data
  const handleUpdateProduit = (produit: Produit) => {
    setCurrentProduit(produit)
    toggleAddProduitDrawer()
  }
  const [downloadCount, setDownloadCount] = useState(0)

  const handleDownload = () => {
    setDownloadCount(downloadCount + 1)
  }

  // Pagination
  useEffect(() => {
    getListProduits(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={handleCreateProduit}
            onReload={() => {
              setValue('')
              handleChange()
            }}
            onDownload={() => {
              handleDownload()
            }}
          />
          {downloadCount > 0 && (
            <TemplateListeDesProduits data={produits as never[]} fileName={`Liste_des_produits_${downloadCount}`} />
          )}

          <DataGrid
            autoHeight
            loading={statusProduits}
            rowHeight={62}
            rows={produits as never[]}
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
      <AddProduitDrawer
        open={addProduitOpen}
        toggle={toggleAddProduitDrawer}
        onChange={handleChange}
        currentProduit={currentProduit}
        onSuccess={handleSuccess}
        models={models}
        modelId={modelId}
        fournisseurs={fournisseurs}
        fournisseurId={fournisseurId}
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
          sx={{ width: '100%' }}
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

export default ProduitList
