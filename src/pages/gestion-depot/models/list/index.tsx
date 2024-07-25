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
import TableHeader from 'src/gestion-depot/views/models/list/TableHeader'
import AddModelDrawer from 'src/gestion-depot/views/models/list/AddModelDrawer'
import { t } from 'i18next'
import Model from 'src/gestion-depot/logic/models/Model'
import ModelService from 'src/gestion-depot/logic/services/ModelService'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'

interface CellType {
  row: Model
}

interface ColumnType {
  [key: string]: any
}

const ModelList = () => {
  const modelService = new ModelService()
  let infoTranslate

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteModel = (model: Model) => {
    setCurrentModel(model)
    setComfirmationMessage('Are you sure you want to remove it ?')
    setComfirmationFunction(() => () => deleteModel(model))
    setOpen(true)
  }

  const deleteModel = async (model: Model) => {
    setSendDelete(true)

    try {
      const rep = await modelService.delete(model.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        infoTranslate = t('Model successfully deleted')
        setMessage(infoTranslate)
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        infoTranslate = t('Model not found')
        setMessage(infoTranslate)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      setSendDelete(false)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occurred')
      setMessage(infoTranslate)
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
  const [statusModels, setStatusModels] = useState<boolean>(true)
  const [models, setModels] = useState<Model[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addModelOpen, setAddModelOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)
  const [currentModel, setCurrentModel] = useState<null | Model>(null)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateModel: (model: Model) => void) => {
    const colArray: ColumnType[] = [
      {
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
        },
        width: 150
      },
      {
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
        },
        width: 350
      },
      {
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
            <Tooltip title={t('Update an model')}>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateModel(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                  <Icon icon='tabler:edit' />
                </Box>
              </IconButton>
            </Tooltip>

            <Tooltip title={t('Delete')}>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleDeleteModel(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.error.main }}>
                  <Icon icon='tabler:trash' />
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        ),
        width: 100
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListModels = async (page: number, pageSize: number) => {
    const result = await modelService.listModels({ page: page + 1, length: pageSize })

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Model[]).filter(model => {
        return model.name.toLowerCase().includes(queryLowered) || model.description.toLowerCase().includes(queryLowered)
      })

      setModels(filteredData)
      setStatusModels(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListModels(0, 10)
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()

    setColumns(getColumns(handleUpdateModel))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // Show Modal
  const toggleAddModelDrawer = () => setAddModelOpen(!addModelOpen)

  // Add Data
  const handleCreateModel = () => {
    setCurrentModel(null)
    toggleAddModelDrawer()
  }

  // Update Data
  const handleUpdateModel = (model: Model) => {
    setCurrentModel(model)
    toggleAddModelDrawer()
  }

  // Pagination
  useEffect(() => {
    getListModels(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={handleCreateModel}
            onReload={() => {
              setValue('')
              handleChange()
            }}
          />

          <DataGrid
            autoHeight
            loading={statusModels}
            rowHeight={62}
            rows={models as never[]}
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
      <AddModelDrawer
        open={addModelOpen}
        toggle={toggleAddModelDrawer}
        onChange={handleChange}
        currentModel={currentModel}
        onSuccess={handleSuccess}
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

export default ModelList
