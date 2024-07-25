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
import TableHeader from 'src/gestion-depot/views/entreeR1Dispo/list/TableHeader'
import EntreeR1Service from 'src/gestion-depot/logic/services/EntreeR1Service'
import EntreeR1Dispo from 'src/gestion-depot/logic/models/EntreeR1Dispo'
import { CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import Produit from 'src/gestion-depot/logic/models/Produit'
import { LoadingButton } from '@mui/lab'
import axios from 'src/configs/axios-config'
import { getHeadersInformation } from 'src/gestion-depot/logic/utils/constant'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import ProduitService from 'src/gestion-depot/logic/services/ProduitService'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Button from '@mui/material/Button'

interface CellType {
  row: EntreeR1Dispo
}

interface ColumnType {
  [key: string]: any
}

const EntreeR1List = () => {
  const entreeR1Service = new EntreeR1Service()

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
  const produitService = new ProduitService()
  const [produit, setProduit] = useState<string>('')
  const [produits, setProduits] = useState<Produit[]>([])
  const [statusData, setStatusData] = useState<boolean>(true)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [statusEntreeR1, setStatusEntreeR1] = useState<boolean>(true)
  const [entreesR1Dispo, setEntreesR1Dispo] = useState<EntreeR1Dispo[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleAddToCart: (entreeR1Dispo: EntreeR1Dispo) => void) => {
    const colArray: ColumnType[] = [
      {
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
        },
        width: 250
      },
      {
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
        },
        width: 250
      },
      {
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
        },
        width: 250
      },
      {
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
        },
        width: 150
      },
      {
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
        },
        width: 200
      },
      {
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
                  {seuil.toString()}
                </Typography>
              </Box>
            </Box>
          )
        },
        width: 150
      }
      // {
      //   flex: 0.2,
      //   sortable: false,
      //   field: 'actions',
      //   renderHeader: () => (
      //     <Tooltip title='Actions'>
      //       <Typography
      //         noWrap
      //         sx={{
      //           fontWeight: 500,
      //           letterSpacing: '1px',
      //           textTransform: 'uppercase',
      //           fontSize: '0.8125rem'
      //         }}
      //       >
      //         Action
      //       </Typography>
      //     </Tooltip>
      //   ),
      //   renderCell: ({ row }: CellType) => (
      //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
      //       <Tooltip title='Créer une facture avec ce produit du stock'>
      //         <IconButton
      //           size='small'
      //           sx={{ color: 'text.primary', ':hover': 'none' }}
      //           onClick={() => {
      //             handleAddToCart(row)
      //           }}
      //         >
      //           <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
      //             <Icon icon='tabler:plus' />
      //           </Box>
      //         </IconButton>
      //       </Tooltip>
      //     </Box>
      //   )
      // }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListEntreesR1Dispo = async (page: number, pageSize: number) => {
    const result = await entreeR1Service.listEntreesR1Dispo({ page: page + 1, length: pageSize })

    if (result.success) {
      const queryLowered = value.toLowerCase()

      const filteredData = (result.data as EntreeR1Dispo[]).filter(entree => {
        return (
          (entree.produit && entree.produit.toString().toLowerCase().includes(queryLowered)) ||
          entree.model.toString().toLowerCase().includes(queryLowered) ||
          entree.fournisseur.toLowerCase().includes(queryLowered) ||
          entree.st_dispo.toString().toLowerCase().includes(queryLowered) ||
          entree.pv.toString().toLowerCase().includes(queryLowered) ||
          entree.seuil.toString().toLowerCase().includes(queryLowered)
        )
      })
      setEntreesR1Dispo(filteredData)
      setStatusEntreeR1(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleSearch = async () => {
    const searchData = {
      page: 1,
      length: 10,
      produitId: produit + "",
    }
    setLoadingSearch(true)

    await axios
      .post('/entreer1/produit/all', searchData, {
        headers: {
          ...getHeadersInformation(),
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const repp = response.data
        setLoadingSearch(false)

        if (repp.status === 200) {
          setTotal(Number(repp.data.mouvementsEntreeR1DispoNumber))
          setEntreesR1Dispo(repp.data.mouvementsEntreeR1Dispo as EntreeR1Dispo[])
          setStatusData(false)

        } else {
          setOpenNotification(true);
          setTypeMessage("success");
          setMessage("Aucun résultat")
        }
      })
      .catch(error => {
        console.log(error)
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage(error)
      })
  }

  const handleLoadingProduits = async () => {
    const result = await produitService.listProduitsLongue()

    if (result.success) {
      setProduits(result.data as Produit[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListEntreesR1Dispo(0, 10)
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    handleLoadingProduits()
    setColumns(getColumns(handleAddToCart))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleProduitChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setProduit(e.target.value as string)
  }, [])

  const handleAddToCart = (entreeR1Dispo: EntreeR1Dispo) => {
    // console.log('data to save :::', entreeR1Dispo);
    const stockMinimal = Number(entreeR1Dispo.seuil)
    const stockDispo = Number(entreeR1Dispo.st_dispo)

    if (stockDispo >= stockMinimal) {
      const cartProductArray = JSON.parse(localStorage.getItem('cart1') || '[]')

      // Créer un nouvel objet pour le produit à ajouter au panier
      const productToCart = {
        productId: entreeR1Dispo.id,
        product: entreeR1Dispo.produit.toString(),
        model: entreeR1Dispo.model,
        fournisseur: entreeR1Dispo.fournisseur,
        pv: Number(entreeR1Dispo.pv),
        stockDispo: Number(entreeR1Dispo.st_dispo),
        quantity: 0.25
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
        localStorage.setItem('cart1', JSON.stringify(cartProductArray))
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
    getListEntreesR1Dispo(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='STOCK DISPONIBLE' />

          <CardContent>

            <Grid container spacing={1} justifyContent="flex-end">

              <Grid item>
                <FormControl sx={{ m: 1, minWidth: 50 }} size="small">
                  <InputLabel id="demo-simple-select-small-label">Rechercher un produit</InputLabel>
                  <Select
                    labelId="demo-simple-select-small-label"
                    id="demo-simple-select-small"
                    value={produit}
                    onChange={handleProduitChange}
                    sx={{width: '250px'}}
                    label="Rechercher un produit"
                  >
                    <MenuItem value={''}>None</MenuItem>
                    {produits.map(produit => (
                      <MenuItem key={produit.id} value={produit.id}>
                        {produit.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item lg={2} md={3} sm={3} xs={3} sx={{ marginTop: '4px', marginLeft: '15px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LoadingButton
                    type='submit'
                    color='error'
                    loading={loadingSearch}
                    onClick={() => { (produit != "") ? handleSearch() : setOpenNotification(true); setTypeMessage("error"); setMessage("Merci de sélectionner un produit") }}
                    loadingPosition='end'
                    endIcon={<SearchSharpIcon />}
                    variant='contained'
                  >
                    Rechercher
                  </LoadingButton>
                  <Button sx={{ marginLeft: '5px' }} size='small' variant="contained" onClick={() => { setValue(''); setProduit(""); handleChange() }}>
                    <AutorenewIcon />
                  </Button>
                </Box>
              </Grid>
            </Grid>

          </CardContent>

          <Divider sx={{ m: '0 !important' }} />

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
            loading={statusEntreeR1}
            rowHeight={62}
            rows={entreesR1Dispo as never[]}
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

export default EntreeR1List
