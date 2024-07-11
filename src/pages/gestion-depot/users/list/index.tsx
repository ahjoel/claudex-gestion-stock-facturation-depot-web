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
import TableHeader from 'src/gestion-depot/views/users/list/TableHeader'
import { t } from 'i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import UserService from 'src/gestion-depot/logic/services/UserService'
import User from 'src/gestion-depot/logic/models/User'
import AddUserDrawer from 'src/gestion-depot/views/users/list/AddUserDrawer'

interface CellType {
  row: User
}

interface ColumnType {
  [key: string]: any
}

const UserList = () => {
  const userService = new UserService()

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user)
    setComfirmationMessage('Voulez-vous réellement supprimer ce utilisateur ?')
    setComfirmationFunction(() => () => deleteUser(user))
    setOpen(true)
  }

  const deleteUser = async (user: User) => {
    setSendDelete(true)

    try {
      const rep = await userService.delete(user.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Utilisateur supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Utilisateur non trouvé')
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
  const [statusUsers, setStatusUsers] = useState<boolean>(true)
  const [users, setUsers] = useState<User[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [currentUsers, setCurrentUser] = useState<null | User>(null)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateUser: (user: User) => void, handleDeleteUser: (user: User) => void) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.2,
        field: 'username',
        renderHeader: () => (
          <Tooltip title='Nom Utilisateur'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Nom Utilisateur
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { username } = row

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
                  {username}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 200,
        field: 'lastname',
        renderHeader: () => (
          <Tooltip title='Nom'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Nom
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { lastname } = row

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
                  {lastname}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'firstname',
        renderHeader: () => (
          <Tooltip title={t('Prénom')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Prénom')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { firstname } = row

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
                  {firstname}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'email',
        renderHeader: () => (
          <Tooltip title={t('Email')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Email')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { email } = row

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
                  {email}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.18,
        minWidth: 200,
        field: 'zone',
        renderHeader: () => (
          <Tooltip title='Zone'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Zone
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { zone } = row

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
                  {zone.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
        minWidth: 200,
        field: 'profil',
        renderHeader: () => (
          <Tooltip title='Profil'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Profil
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { profile } = row

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
                  {profile}
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
            <Tooltip title='Mettre à jour un utilisateur'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateUser(row)
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
                  handleDeleteUser(row)
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
  const getListUsers = async () => {
    const result = await userService.listUsers()

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as User[]).filter(user => {
        return (
          user.username.toLowerCase().includes(queryLowered) ||
          user.firstname.toLowerCase().includes(queryLowered) ||
          user.lastname.toLowerCase().includes(queryLowered) ||
          user.email.toLowerCase().includes(queryLowered) ||
          user.zone.toLowerCase().includes(queryLowered) ||
          user.profile.toLowerCase().includes(queryLowered)
        )
      })

      setUsers(filteredData)
      setStatusUsers(false)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListUsers()
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    setColumns(getColumns(handleUpdateUser, handleDeleteUser))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // Show Modal
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  // Add Data
  const handleCreateUser = () => {
    setCurrentUser(null)
    toggleAddUserDrawer()
  }

  // Update Data
  const handleUpdateUser = (user: User) => {
    setCurrentUser(user)
    toggleAddUserDrawer()
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={handleCreateUser} />

          <DataGrid
            autoHeight
            loading={statusUsers}
            rowHeight={62}
            rows={users as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {/* Add or Update Right Modal */}
      <AddUserDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        handleChange={handleChange}
        onSuccess={handleSuccess}
        currentUser={currentUsers}
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

export default UserList
