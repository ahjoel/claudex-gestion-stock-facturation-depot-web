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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import StorageData from 'src/gestion-depot/logic/models/StorageData'
import { Controller, useForm } from 'react-hook-form'
import FactureService from 'src/gestion-depot/logic/services/FactureService'
import CustomTextField from 'src/@core/components/mui/text-field'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import * as yup from 'yup'
import axios from 'src/configs/axios-config'
import { getHeadersInformation } from 'src/gestion-depot/logic/utils/constant'
import router from 'next/router'
import Client from 'src/gestion-depot/logic/models/Client'
import Icon from 'src/@core/components/icon'
import ProduitService from 'src/gestion-depot/logic/services/ProduitService'
import Produit from 'src/gestion-depot/logic/models/Produit'
import Autocomplete from '@mui/material/Autocomplete'
import EntreeR1 from 'src/gestion-depot/logic/services/EntreeR1Service'
import EntreeR1Dispo from 'src/gestion-depot/logic/models/EntreeR1Dispo'

interface CellType {
  row: StorageData
}

interface FactureData {
  id?: number
  code: string
  client_id: string
  remise: number
}

interface ColumnType {
  [key: string]: any
}

const schema = yup.object().shape({
  client_id: yup.string().required(() => 'Le champ client est obligatoire')
})

const defaultValues = {
  code: '',
  client_id: '',
  remise: 0
}

const schemap = yup.object().shape({
  client_id: yup.string().required(() => 'Le champ client est obligatoire')
})

const defaultValuesp = {
  produitId: '',
  qte: 0
}

const FactureEnCours = () => {
  // Notifications - snackbar

  const [factureCode, setFactureCode] = useState<string>('')
  const [clients, setClients] = useState<Client[]>([])
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [openNotificationSuccess, setOpenNotificationSuccess] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const [openModal, setOpenModal] = React.useState(false);

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


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
        const annee = response.data.data.infos[0].annee
        const codeFormat = `CLAUDEX-${annee}/${mois}/${id}`
        setFactureCode(codeFormat)
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

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
      router.push('/gestion-depot/factures/list')
    }
    setOpenNotificationSuccess(false)
    router.push('/gestion-depot/factures/list')
  }

  const [storageData, setStorageData] = useState<StorageData[]>([])
  const [sousTotal, setSousTotal] = useState(0)
  const [qteTotal, setQteTotal] = useState(0)
  const [totalFacture, setTotalFacture] = useState(0)
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [send, setSend] = useState<boolean>(false)

  const refresh = () => {
    const cartData = localStorage.getItem('cart1') || ''

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
    const updatedQuantity = row.quantity;
    console.log("quantityUpdated ::", updatedQuantity);

    const cartProductArray = JSON.parse(localStorage.getItem('cart1') || '[]')

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
        cartProductArray[existingProductIndex].quantity += 0.25
        localStorage.setItem('cart1', JSON.stringify(cartProductArray))
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
    const cartProductArray = JSON.parse(localStorage.getItem('cart1') || '[]')

    const productToCart = {
      productId: row.productId
    }

    const existingProductIndex = cartProductArray.findIndex(
      (item: { productId: number }) => item.productId === productToCart.productId
    )

    if (existingProductIndex !== -1) {
      if (cartProductArray[existingProductIndex].quantity > 1) {
        cartProductArray[existingProductIndex].quantity -= 0.25
      }
      localStorage.setItem('cart1', JSON.stringify(cartProductArray))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
    refresh()
  }

  // Fonction pour gérer l'action Supprimer de Produit
  const handleActionSupprimer = (row: any) => {
    const cartProductArray = JSON.parse(localStorage.getItem('cart1') || '[]')

    const productToCart = {
      productId: row.productId
    }

    const existingProductIndex = cartProductArray.findIndex(
      (item: { productId: number }) => item.productId === productToCart.productId
    )

    if (existingProductIndex !== -1) {
      cartProductArray.splice(existingProductIndex, 1)
      localStorage.setItem('cart1', JSON.stringify(cartProductArray))
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
        },
        width: 300
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
        },
        width: 150
      },
      {
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
        },
        width: 150,
        editable: true
      },
      {
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
        },
        width: 250
      },
      {
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
        ),
        width: 200
      },
      {
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
        ),
        width: 250
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
    const cartData = localStorage.getItem('cart1')
    setSend(true)

    // console.log("factureCode :::", factureCode);

    const sendData = {
      code: factureCode,
      client_id: data.client_id + '',
      remise: Number(data.remise),
      tax: 0 + ''
    }
    console.log('sendData :::', sendData.code)

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
                localStorage.removeItem('cart1')
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

  const handleAddToCart = (entreeR1Dispo: EntreeR1Dispo) => {
    // console.log('data to save :::', entreeR1Dispo);
    const qteSaisie = parseFloat(entreeR1Dispo.quantity)
    const stockDispo = parseFloat(entreeR1Dispo.st_dispo)
    // console.log('add to cart ::', qteSaisie, stockDispo);
    
    if (stockDispo >= qteSaisie) {
      const cartProductArray = JSON.parse(localStorage.getItem('cart1') || '[]')
      
      // Créer un nouvel objet pour le produit à ajouter au panier
      const productToCart = {
        productId: entreeR1Dispo?.produitId,
        product: entreeR1Dispo?.produit.toString(),
        model: entreeR1Dispo?.model,
        fournisseur: entreeR1Dispo?.fournisseur,
        pv: Number(entreeR1Dispo?.pv),
        stockDispo: Number(entreeR1Dispo?.st_dispo),
        quantity: parseFloat(entreeR1Dispo?.quantity)
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
      setMessage('La quantité demandée est supérieur au stock disponible')
    }
  }
  
  const [produitId, setProduitId] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [st_dispo, setSt_Dispo] = useState('');
  const [model, setModel] = useState('');
  const [productName, setProductName] = useState('');
  const [pv, setPv] = useState('');
  const [stockDispo, setStockDispo] = useState('');
  const [quantite, setQuantite] = useState('');
  const [seuil, setSeuil] = useState('');
  const [error, setError] = useState(false);

  const handleProduitChange = async (selectedProductId: any) => {
    // Ici, vous pouvez mettre à jour l'état ou effectuer d'autres actions
    // console.log('Produit sélectionné :', selectedProductId);
    // Mettre à jour l'état dans votre composant parent, par exemple :
    // productId, product, model, fournisseur, pv, stockDispo
    setProduitId(selectedProductId); // Si vous utilisez useState pour gérer produitId

    // Load Data
    const entreeR1 = new EntreeR1()
    try {
      const sendData = {
        produitId: Number(selectedProductId)
      }
      const rep = await entreeR1.listProduitInfo(sendData);

      if (rep.success) {
        const filteredData = rep.data[0] as StorageData;
        console.log('Data trouvé :', filteredData);
        setProductName(filteredData.produit);
        setModel(filteredData.model);
        setFournisseur(filteredData.fournisseur);
        setPv(filteredData.pv + '');
        setSt_Dispo(filteredData.st_dispo + '');
        setSeuil(filteredData.stockMinimal + '')
      } else {
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Reglement non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);

      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue lors du chargement des infos du produit");
    }
  };

  const handleSubmitProd = (event:any) => {
    event.preventDefault(); // Prevent form submission for demonstration purposes
    // console.log('Data send::::', produitId, quantite, st_dispo);
    if (produitId != '' && quantite != ''){
      const productToCart: EntreeR1Dispo = {
        produitId: Number(produitId),
        produit: productName,
        model: model,
        fournisseur: fournisseur,
        pv: pv,
        st_dispo: st_dispo,
        quantity: quantite,
        seuil: seuil,
        id: -1,
        createdBy: null,
        createdAt: '',
        updatedAt: '',
        updatedBy: null,
        deletedAt: '',
        deletedBy: null
      }
      handleAddToCart(productToCart)
      refresh()
      setProduitId('');
      setModel('');
      setFournisseur('');
      setQuantite('');
      setSt_Dispo('');
    }else{
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Veuillez remplir tous les champs du formulaire.')
    }
  };

  const produitService = new ProduitService()
  const [produits, setProduits] = useState<Produit[]>([])
  const handleLoadingProduits = async () => {
    const result = await produitService.listProduitsLongue();

    if (result.success) {
      setProduits(result.data as Produit[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  // Control search data in datagrid
  useEffect(() => {
    loadCodefacture()
    handleLoadingProduits()
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
                py: 4,
                px: 2,
                rowGap: 2,
                columnGap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginRight: 0.6
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
                name='remise'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    sx={{ mr: 4 }}
                    size='small'
                    label='Remise Facture'
                    onChange={onChange}
                    error={Boolean(errors.remise)}
                    {...(errors.remise && { helperText: errors.remise.message })}
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
                    sx={{ mr: 4, width: '250px' }}
                    fullWidth
                    error={Boolean(errors.client_id)}
                    {...(errors.client_id && { helperText: errors.client_id.message })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem value={''}>Sélectionnez le client</MenuItem>
                    {clients?.map(client => (
                      <MenuItem key={client.id} value={`${client.id}-${client.name}`}>
                        {client.code}-{client.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />


              <Box sx={{ display: 'flex', alignItems: 'right' }}>
                <Button onClick={handleClickOpenModal} variant='contained' sx={{ height: '38px' }}>
                  <span style={{ marginRight: '0.2rem' }}>Ajouter un produit</span>
                  <Icon icon='tabler:plus' />
                </Button>
              </Box>
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

      {/* Add Product to cart */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        // PaperProps={{
        //   component: 'form',
        //   onSubmit: (event) => {
        //     event.preventDefault();
        //     const formData = new FormData(event.currentTarget);
        //     const formJson = Object.fromEntries(formData.entries());
        //     const email = formJson.email;
        //     console.log(email);
        //     handleCloseModal();
        //   },
        // }}
      >
        <DialogTitle>Ajout de Produit</DialogTitle>
          <form onSubmit={handleSubmitProd} autoComplete='off'>
            <DialogContent>
              <DialogContentText>
                Ajoutez des produits du stock sur la facture en cours
              </DialogContentText>
                <FormControl sx={{ m: 1, mt:5, width: 350}} size='small'>
                    <Autocomplete
                      id="produitId"
                      options={produits}
                      getOptionLabel={(product) => `${product.name} ${product.model}`}
                      value={produits.find((p) => p.id === Number(produitId)) || null}
                      onChange={(event, newValue) => {
                        handleProduitChange(newValue ? newValue.id : 0);
                      }}
                      renderInput={(params) => <TextField {...params} label="Sélectionnez un produit" />}
                      fullWidth
                    />

                  <Grid container spacing={2} sx={{mt:2}}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Fournisseur:</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1">{produitId ? fournisseur : ''}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Quantité Disponible:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {produitId ? st_dispo : ''}
                      </Typography>
                    </Grid>
                  </Grid>

                    <TextField
                      sx={{mt: 5}}
                      label="Quantité"
                      id="outlined-size-small"
                      defaultValue=""
                      size="small"
                      fullWidth
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button type="submit">Ajouter</Button>
            </DialogActions>
          </form>
      </Dialog>
      
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
