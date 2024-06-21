/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import {
  Box,
  Button,
  ButtonGroup,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import StorageData from 'src/gestion-bars/logic/models/StorageData'
import { Controller, useForm } from 'react-hook-form'
import FactureService from 'src/gestion-bars/logic/services/FactureService'
import CustomTextField from 'src/@core/components/mui/text-field'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import * as yup from 'yup'
import axios from 'src/configs/axios-config'
import { getHeadersInformation } from 'src/gestion-bars/logic/utils/constant'
import router from 'next/router'
import Client from 'src/gestion-bars/logic/models/Client'

interface CellType {
  row: StorageData
}

interface FactureData {
  id?: number
  code: string
  client_id: string
}

interface ColumnType {
  [key: string]: any
}

const schema = yup.object().shape({
  client_id: yup.string().required(() => 'Le champ client est obligatoire')
})

const defaultValues = {
  code: '',
  client_id: ''
}

const FactureEnCours = () => {
  // Notifications - snackbar

  const [factureCode, setFactureCode] = useState<string>('')
  const [clients, setClients] = useState<Client[]>([])
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [openNotificationSuccess, setOpenNotificationSuccess] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const loadCodefacture = async () => {
    try {
      const response = await axios.get(`codefacture`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200 && response.data.message === 'SUCCESS') {
        const id = Number(response.data.data.infos[0].nb_id_deja) + 1
        const mois = response.data.data.infos[0].num_mois
        const userData = JSON.parse(window.localStorage.getItem('userData') as string)
        const stock = userData?.zone
        const codeFormat = `${stock}/BAR/${mois}/${id}`
        setFactureCode(codeFormat)
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

  // const handleSuccess = (message: string, type = 'success') => {
  //   setOpenNotification(true);
  //   setTypeMessage(type);
  //   const messageTrans = t(message)
  //   setMessage(messageTrans)
  // };

  const loadClients = async () => {
    try {
      const response = await axios.get(`clients/all?page=1&length=1000`, {
        headers: {
          ...getHeadersInformation()
        }
      })

      if (response.data.status === 200 && response.data.message === 'SUCCESS') {
        setClients(response.data.data.clients)
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  const handleCloseNotificationSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotificationSuccess(false)
      router.push('/gestion-bars/factures/list')
    }
    setOpenNotificationSuccess(false)
    router.push('/gestion-bars/factures/list')
  }

  const [storageData, setStorageData] = useState<StorageData[]>([])
  const [sousTotal, setSousTotal] = useState(0)
  const [qteTotal, setQteTotal] = useState(0)
  const [totalFacture, setTotalFacture] = useState(0)
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [send, setSend] = useState<boolean>(false)

  const refresh = () => {
    const cartData = localStorage.getItem('cart2') || ''

    // Vérifier si des données existent dans le localStorage
    if (cartData) {
      // Convertir les données JSON en tableau d'objets
      const cartItems = JSON.parse(cartData)

      // Utiliser les données pour construire les lignes du DataGrid
      const rows = cartItems.map((item: any, index: number) => ({
        id: index + 1,
        ...item
      }))

      // Trier les lignes par ordre décroissant selon l'ID
      rows.sort((a: { id: number }, b: { id: number }) => b.id - a.id)
      setStorageData(rows as StorageData[])

      const amountWithoutTax = cartItems.reduce(
        (acc: number, item: { quantity: number; pv: number }) => acc + item.quantity * item.pv,
        0
      )
      const qteTt = cartItems.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0)
      const totFact = amountWithoutTax
      setSousTotal(amountWithoutTax)
      setQteTotal(qteTt)
      setTotalFacture(totFact)
    } else {
      setStorageData([])
      setSousTotal(0)
      setQteTotal(0)
      setTotalFacture(0)
    }
  }

  // Fonction pour gérer l'action Ajouter de Quantité
  const handleActionAjouter = (row: any) => {
    const cartProductArray = JSON.parse(localStorage.getItem('cart2') || '[]')

    const productToCart = {
      productId: row.productId
    }

    const existingProductIndex = cartProductArray.findIndex(
      (item: { productId: number }) => item.productId === productToCart.productId
    )

    // Si element trouvé, alors met à jour la quantité en controlant le stock dispo pour ce produit
    // L'augmentation de qte ne doit pas dépasser la qte dispo pour le produit
    if (existingProductIndex !== -1) {
      if (cartProductArray[existingProductIndex].quantity < row.stockDispo) {
        cartProductArray[existingProductIndex].quantity += 1
        localStorage.setItem('cart2', JSON.stringify(cartProductArray))
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Stock disponible insuffisant')
      }
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
    refresh()
  }

  // Fonction pour gérer l'action Diminuer de Quantité
  const handleActionRetrancher = (row: any) => {
    const cartProductArray = JSON.parse(localStorage.getItem('cart2') || '[]')

    const productToCart = {
      productId: row.productId
    }

    const existingProductIndex = cartProductArray.findIndex(
      (item: { productId: number }) => item.productId === productToCart.productId
    )

    if (existingProductIndex !== -1) {
      if (cartProductArray[existingProductIndex].quantity > 1) {
        cartProductArray[existingProductIndex].quantity -= 1
      }
      localStorage.setItem('cart2', JSON.stringify(cartProductArray))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
    refresh()
  }

  // Fonction pour gérer l'action Supprimer de Produit
  const handleActionSupprimer = (row: any) => {
    const cartProductArray = JSON.parse(localStorage.getItem('cart2') || '[]')

    const productToCart = {
      productId: row.productId
    }

    const existingProductIndex = cartProductArray.findIndex(
      (item: { productId: number }) => item.productId === productToCart.productId
    )

    if (existingProductIndex !== -1) {
      cartProductArray.splice(existingProductIndex, 1)
      localStorage.setItem('cart2', JSON.stringify(cartProductArray))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
    refresh()
  }

  const getColumns = (
    handleActionAjouter: (data: StorageData) => void,
    handleActionRetrancher: (data1: StorageData) => void,
    handleActionSupprimer: (data2: StorageData) => void
  ) => {
    const colArray: ColumnType[] = [
      {
        flex: 0.15,
        field: 'product',
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
          const { product, model } = row

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
                  {product}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {model}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.1,
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
              Fournis.
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
        flex: 0.1,
        field: 'quantity',
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
              Qté
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { quantity } = row

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
                  {quantity}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'total',
        renderHeader: () => (
          <Tooltip title='Total'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Total
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { pv, quantity } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {(quantity * pv).toLocaleString()} {'F CFA'}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {pv} {'F CFA'} / quantité
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
          <Tooltip title='GERER QUANTITé'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              GERER QUANTITé
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <ButtonGroup size='small' aria-label='Small button group'>
            <Button color='error' variant='contained' key='one' onClick={() => handleActionRetrancher(row)}>
              -
            </Button>
            <Button key='two'>{row.quantity}</Button>
            <Button color='info' variant='contained' key='three' onClick={() => handleActionAjouter(row)}>
              +
            </Button>
          </ButtonGroup>
        )
      },
      {
        flex: 0.18,
        sortable: false,
        field: 'suppression',
        renderHeader: () => (
          <Tooltip title='Suppression'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Suppression
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <ButtonGroup size='small' aria-label='Small button group'>
            <Button color='error' variant='outlined' key='three' onClick={() => handleActionSupprimer(row)}>
              <Tooltip title='Retirer ce produit sur la facture'>
                <Typography
                  sx={{
                    fontWeight: 500,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontSize: '0.8125rem'
                  }}
                >
                  Supprimer
                </Typography>
              </Tooltip>
            </Button>
          </ButtonGroup>
        )
      }
    ]

    return colArray
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const onSubmit = async (data: FactureData) => {
    const factureService = new FactureService()
    const cartData = localStorage.getItem('cart2')
    setSend(true)

    const sendData = {
      code: factureCode,
      client_id: data.client_id + '',
      tax: 0 + ''
    }

    if (cartData) {
      const result = await factureService.createFacture(sendData)

      if (result.success) {
        console.log('facture cree avec success :::', result.dataId)
        const factureId = result.dataId

        // Étape 2 : Conversion des données
        const parsedCartData = JSON.parse(cartData)

        // Vérifie si parsedCartData est un tableau
        if (Array.isArray(parsedCartData)) {
          // Retirer la propriété id de chaque objet dans parsedCartData
          const modifiedCartData = parsedCartData.map(productSanitize => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, fournisseur, model, product, stockDispo, ...rest } = productSanitize

            return rest
          })

          // Ajout des propriétés facture_id et stock à chaque objet dans modifiedCartData
          modifiedCartData.forEach(product => {
            product.facture_id = factureId
            product.stock = 'RC'
          })

          const nombreProduitFactureTotal = modifiedCartData.length
          let nombreProduitFactureEnregistrer = 0

          // Boucle à travers chaque objet dans modifiedCartData
          modifiedCartData.forEach(async (product, index) => {
            try {
              const response = await axios.post('factures/lignes', JSON.stringify(product), {
                headers: {
                  ...getHeadersInformation(),
                  'Content-Type': 'application/json'
                }
              })

              // Vérifier si la requête a réussi et que response.data est défini
              if (response.data.status === 200 && response.data.message === 'SUCCESS') {
                nombreProduitFactureEnregistrer += 1
                console.log('-----', nombreProduitFactureEnregistrer)
              }

              // Dernier tour de la boucle
              if (index === nombreProduitFactureTotal - 1) {
                setSend(false)
                setOpenNotificationSuccess(true)
                setTypeMessage('success')
                setMessage(
                  `Facture ${sendData.code} avec ${nombreProduitFactureTotal} produit(s) enregistré(s) avec succès.`
                )
                reset()
                localStorage.removeItem('cart2')
                refresh()
              }
            } catch (error) {
              console.error('Erreur lors de la requête:', error)
              setOpenNotification(true)
              setTypeMessage('error')
              setMessage("Une erreur est survenue lors de l'insertion des produits")
            }
          })
          setFactureCode('')
        } else {
          setSend(false)
          console.log("parsedCartData n'est pas un tableau")
          setOpenNotification(true)
          setTypeMessage('error')
          setMessage('Une erreur est survenue, un soucis avec les produits de la facture en cours')
        }
      } else {
        setSend(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Facture non crée')
      }
    } else {
      setSend(false)
      console.log('Le panier est vide')
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Aucun produit sur la facture en cours.')
    }
  }

  // Control search data in datagrid
  useEffect(() => {
    loadCodefacture()
    loadClients()
    refresh()
    setColumns(getColumns(handleActionAjouter, handleActionRetrancher, handleActionSupprimer))
  }, [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Card>
            <Box
              sx={{
                py: 3,
                px: 6,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Controller
                name='code'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <TextField
                    value={factureCode}
                    sx={{ mr: 4 }}
                    size='small'
                    label='Code Facture'
                    onChange={onChange}
                    error={Boolean(errors.code)}
                    {...(errors.code && { helperText: errors.code.message })}
                  />
                )}
              />

              <Controller
                name='client_id'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    sx={{ mr: 0 }}
                    error={Boolean(errors.client_id)}
                    {...(errors.client_id && { helperText: errors.client_id.message })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem value=''>Sélectionnez la table client</MenuItem>
                    {clients?.map(client => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Box>
            <Divider sx={{ m: '0 !important' }} />

            <div style={{ height: 350, width: '100%' }}>
              <DataGrid
                rows={storageData as never[]}
                columns={columns as GridColDef<never>[]}
                rowHeight={48}
                disableRowSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 50
                    }
                  }
                }}
                pageSizeOptions={[50]}
              />
            </div>

            {/* <Box
              sx={{
                position: 'fixed',
                top: 540,
                right: 0,
                marginRight: '90px'
              }}
            >
              <Card sx={{ width: '100%' }}>  {/* Adjust width as needed 
                <CardHeader title="Récapitulatif Facture" sx={{ marginBottom: "-2px" }} subheader="Revérifiez les produits de la facture en cours avant d'enregistrer la facture" />
                <CardContent sx={{ height: "140px" }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Sous Total:</TableCell>
                        <TableCell align="right">{sousTotal.toLocaleString()} {'F CFA'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Quantité:</TableCell>
                        <TableCell align="right">{qteTotal} (Quantité)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax:</TableCell>
                        <TableCell align="right">{0} {'F CFA'}</TableCell>
                      </TableRow>
                      <TableRow sx={{ fontWeight: 'bold' }}>
                        <TableCell>Total Facture:</TableCell>
                        <TableCell align="right"><span style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalFacture.toLocaleString()} {'F CFA'}</span></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}> 

                  <LoadingButton
                    type='submit'
                    loading={send}
                    endIcon={<SaveIcon />}
                    variant="contained"
                  >
                    Enregistrer
                  </LoadingButton>
                </CardActions>
              </Card>
            </Box> */}
          </Card>
          <Card style={{ marginTop: '10px' }}>
            <Box

            // sx={{
            //   position: 'fixed',
            //   top: 535,
            //   right: 15,
            //   marginRight: '90px'
            // }}
            >
              <Card sx={{ width: '100%' }}>
                {' '}
                {/* Adjust width as needed */}
                <CardHeader
                  title='Récapitulatif Facture'
                  sx={{ marginBottom: '-2px' }}
                  subheader="Revérifiez les produits de la facture en cours avant d'enregistrer la facture"
                />
                <CardContent sx={{ height: '145px' }}>
                  <Table size='small'>
                    <TableBody>
                      <TableRow>
                        <TableCell>Sous Total:</TableCell>
                        <TableCell align='right'>
                          {sousTotal.toLocaleString()} {'F CFA'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Quantité:</TableCell>
                        <TableCell align='right'>{qteTotal} (Quantité)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax:</TableCell>
                        <TableCell align='right'>
                          {0} {'F CFA'}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ fontWeight: 'bold' }}>
                        <TableCell>Total Facture:</TableCell>
                        <TableCell align='right'>
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {totalFacture.toLocaleString()} {'F CFA'}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {' '}
                  {/* Align button to right */}
                  <LoadingButton type='submit' loading={send} endIcon={<SaveIcon />} variant='contained'>
                    Enregistrer
                  </LoadingButton>
                </CardActions>
              </Card>
            </Box>
          </Card>
        </form>
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

      {/* Success */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openNotificationSuccess}
        onClose={handleCloseNotificationSuccess}
        autoHideDuration={2000}
      >
        <Alert
          onClose={handleCloseNotificationSuccess}
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

export default FactureEnCours
