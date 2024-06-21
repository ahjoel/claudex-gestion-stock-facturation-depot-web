/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/gestion-bars/views/rc/entreeRCDispo/list/TableHeader'
import EntreeRCService from 'src/gestion-bars/logic/services/EntreeRCService'
import EntreeRCDispo from 'src/gestion-bars/logic/models/EntreeRCDispo'

interface CellType {
  row: EntreeRCDispo
}

interface ColumnType {
  [key: string]: any
}

const EntreeRCList = () => {
  const entreeRCService = new EntreeRCService()

  // Search State
  const [value, setValue] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  // const handleSuccess = (message: string, type = 'success') => {
  //   setOpenNotification(true);
  //   setTypeMessage(type);
  //   const messageTrans = t(message)
  //   setMessage(messageTrans)
  // };

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusEntreeRC, setStatusEntreeRC] = useState<boolean>(true)
  const [entreesRCDispo, setEntreesRCDispo] = useState<EntreeRCDispo[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleAddToCart: (entreeRCDispo: EntreeRCDispo) => void) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.25,
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
        flex: 0.18,
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
        flex: 0.18,
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
        flex: 0.18,
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        flex: 0.18,
        field: 'st_dispo',
        renderHeader: () => (
          <Tooltip title='Quantité Disponible'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Quantité Disponible
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { st_dispo } = row

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
                  {st_dispo}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.15,
        field: 'stockMinimal',
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
              Stock Minimal
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { stockMinimal } = row

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
                  {stockMinimal.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        sortable: false,
        field: 'actions',
        renderHeader: () => (
          <Tooltip title='Actions'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Action
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Créer une facture avec ce produit du stock'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary', ':hover': 'none' }}
                onClick={() => {
                  handleAddToCart(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                  <Icon icon='tabler:plus' />
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
  const getListEntreesRCDispo = async (page: number, pageSize: number) => {
    const result = await entreeRCService.listEntreesRCDispo({ page: page + 1, length: pageSize })

    if (result.success) {
      const queryLowered = value.toLowerCase()

      const filteredData = (result.data as EntreeRCDispo[]).filter(entree => {
        return (
          (entree.produit && entree.produit.toString().toLowerCase().includes(queryLowered)) ||
          entree.model.toString().toLowerCase().includes(queryLowered) ||
          entree.fournisseur.toLowerCase().includes(queryLowered) ||
          entree.st_dispo.toString().toLowerCase().includes(queryLowered) ||
          entree.pv.toString().toLowerCase().includes(queryLowered) ||
          entree.stockMinimal.toString().toLowerCase().includes(queryLowered)
        )
      })
      setEntreesRCDispo(filteredData)
      setStatusEntreeRC(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListEntreesRCDispo(0, 10)
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    setColumns(getColumns(handleAddToCart))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleAddToCart = (entreeRCDispo: EntreeRCDispo) => {
    // console.log('data to save :::', entreeR1Dispo);
    const stockMinimal = Number(entreeRCDispo.stockMinimal)
    const stockDispo = Number(entreeRCDispo.st_dispo)

    if (stockDispo >= stockMinimal) {
      const cartProductArray = JSON.parse(localStorage.getItem('cart2') || '[]')

      // Créer un nouvel objet pour le produit à ajouter au panier
      const productToCart = {
        productId: entreeRCDispo.id,
        product: entreeRCDispo.produit.toString(),
        model: entreeRCDispo.model,
        fournisseur: entreeRCDispo.fournisseur,
        pv: Number(entreeRCDispo.pv),
        stockDispo: Number(entreeRCDispo.st_dispo),
        quantity: 1
      }

      // Vérifier si le produit existe déjà dans le panier
      const existingProductIndex = cartProductArray.findIndex(
        (item: { productId: number }) => item.productId === productToCart.productId
      )

      // Si le produit existe déjà dans le panier, ne l'ajoute pas à nouveau
      if (existingProductIndex === -1) {
        // Ajouter le nouveau produit au panier
        cartProductArray.push(productToCart)

        // Mettre à jour le localStorage avec le nouveau panier
        localStorage.setItem('cart2', JSON.stringify(cartProductArray))
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Produit ajouté à la facture en cours')
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Produit existe déja sur la facture en cours')
      }
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Le stock disponible est insuffisant pour créer une facture')
    }
  }

  // Pagination
  useEffect(() => {
    getListEntreesRCDispo(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            onReload={() => {
              setValue('')
              handleChange()
            }}
          />

          <DataGrid
            autoHeight
            loading={statusEntreeRC}
            rowHeight={62}
            rows={entreesRCDispo as never[]}
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

export default EntreeRCList
