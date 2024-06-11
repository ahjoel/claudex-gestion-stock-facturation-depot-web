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
import TableHeader from 'src/gestion-bars/views/fournisseurs/list/TableHeader'
import AddFournisseurDrawer from 'src/gestion-bars/views/fournisseurs/list/AddFournisseurDrawer'
import { t } from 'i18next'
import Fournisseur from 'src/gestion-bars/logic/models/Fournisseur'
import FournisseurService from 'src/gestion-bars/logic/services/FournisseurService'
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab'

interface CellType {
  row: Fournisseur
}

interface ColumnType {
  [key: string]: any
}

const FournisseurList = () => {
  const fournisseurService = new FournisseurService()

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteFournisseur = (fournisseur: Fournisseur) => {
    setCurrentFournisseur(fournisseur)
    setComfirmationMessage('Are you sure you want to remove it ?')
    setComfirmationFunction(() => () => deleteFournisseur(fournisseur))
    setOpen(true)
  }

  const deleteFournisseur = async (fournisseur: Fournisseur) => {
    setSendDelete(true)

    try {
      const rep = await fournisseurService.delete(fournisseur.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true);
        setTypeMessage("success");
        setMessage('Fournisseur supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage('Fournisseur non trouvé')
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSendDelete(false)
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage('Une erreur est survenue')
    }
  }

  // Search State
  const [value, setValue] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  const handleSuccess = (message: string, type = 'success') => {
    setOpenNotification(true);
    setTypeMessage(type);
    const messageTrans = t(message)
    setMessage(messageTrans)
  };

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false);
    }
    setOpenNotification(false);
  };

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusFournisseurs, setStatusFournisseurs] = useState<boolean>(true)
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addFournisseurOpen, setAddFournisseurOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)
  const [currentFournisseur, setCurrentFournisseur] = useState<null | Fournisseur>(null)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateFournisseur: (fournisseur: Fournisseur) => void) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.25,
        minWidth: 200,
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
        flex: 0.25,
        minWidth: 200,
        field: 'description',
        renderHeader: () => (
          <Tooltip title={t('Description')}>

            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Description')}
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
        flex: 0.1,
        minWidth: 50,
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

            <Tooltip title='Mettre à jour un fournisseur'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateFournisseur(row)
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
                  handleDeleteFournisseur(row)
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
  const getListFournisseurs = async (page: number, pageSize: number) => {

    const result = await fournisseurService.listFournisseurs({ page: page + 1, length: pageSize })

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Fournisseur[]).filter(fournisseur => {
        return (
          fournisseur.name.toLowerCase().includes(queryLowered) ||
          fournisseur.description.toLowerCase().includes(queryLowered)
        )
      })

      setFournisseurs(filteredData)
      setStatusFournisseurs(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListFournisseurs(0, 10)
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()

    setColumns(getColumns(handleUpdateFournisseur))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // Show Modal
  const toggleAddFournisseurDrawer = () => setAddFournisseurOpen(!addFournisseurOpen)

  // Add Data
  const handleCreateFournisseur = () => {
    setCurrentFournisseur(null)
    toggleAddFournisseurDrawer()
  }

  // Update Data
  const handleUpdateFournisseur = (fournisseur: Fournisseur) => {
    setCurrentFournisseur(fournisseur)
    toggleAddFournisseurDrawer()
  }

  // Pagination
  useEffect(() => {
    getListFournisseurs(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={handleCreateFournisseur} />

          <DataGrid
            autoHeight
            loading={statusFournisseurs}
            rowHeight={62}
            rows={fournisseurs as never[]}
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
      <AddFournisseurDrawer open={addFournisseurOpen} toggle={toggleAddFournisseurDrawer} onChange={handleChange} currentFournisseur={currentFournisseur} onSuccess={handleSuccess} />

      {/* Notification */}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openNotification} onClose={handleCloseNotification} autoHideDuration={5000}>
        <Alert onClose={handleCloseNotification} severity={typeMessage as AlertColor} variant="filled" sx={{ width: '100%' }}>
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
            onClick={() => { comfirmationFunction(); }}
            loading={sendDelete}
            endIcon={<DeleteIcon />}
            variant="contained"
            color='error'
          >
            {t('Supprimer')}
          </LoadingButton>
        </DialogActions>
      </Dialog>

    </Grid>
  )
}

export default FournisseurList
