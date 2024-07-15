/* eslint-disable react-hooks/exhaustive-deps */
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import FactureDetail from 'src/gestion-depot/logic/models/FactureDetail'
import Produit from 'src/gestion-depot/logic/models/Produit'
import SortieR1Service from 'src/gestion-depot/logic/services/SortieR1Service'

interface ModelData {
  id?: number
  produitId: number
  factureId: number
  qte: number
}

interface SidebarAddFactureDetailType {
  open: boolean
  toggle: () => void
  onSuccess: (data: any) => void
  onAdd: () => void
  currentFactureDetail: null | FactureDetail
  products: Produit[]
  factureId: number
  codeFact: string
  stock: boolean
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  produitId: yup.string().required(() => 'Le champ produit est obligatoire'),
  qte: yup.number().required(() => 'Le champ quantité est obligatoire')
})

const defaultValues = {
  produitId: 0,
  factureId: 0,
  qte: 0
}

const SidebarAddFactureDetail = (props: SidebarAddFactureDetailType) => {
  // ** Props
  const { open, toggle, onSuccess, onAdd, stock, currentFactureDetail, products, factureId, codeFact } = props

  const [send, setSend] = useState<boolean>(false)
  const mouvementService = new SortieR1Service()

  // const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  // const stock = userData?.zone

  // Notification
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  // Control Forms
  const [id, setId] = useState<number>(-1)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const onSubmit = async (data: ModelData) => {
    setSend(true)

    const sendData = {
      factureId: Number(factureId),
      produitId: Number(data.produitId),
      qte: Number(data.qte)
    }

    if (stock) {
      if (id === -1) {
        const result = await mouvementService.createSortieR1(sendData)
        setSend(false)

        console.log('resultR1 :::', result.description)

        if (result.description === 'La quantité est supérieur au stock disponible') {
          setOpenNotification(true)
          setTypeMessage('error')
          setMessage(result.description)
        }

        if (result.success) {
          reset()
          onAdd()
          toggle()
          onSuccess('Registration completed successfully')
        } else {
          setOpenNotification(true)
          setTypeMessage('error')
          console.log('-----', result.description)
          setMessage('Une erreur est survenue.')
        }
      }
    } else {
      if (id === -1) {
        const result = await mouvementService.createSortieRC(sendData)
        setSend(false)

        console.log('resultRC :::', result.description)

        if (result.description === 'La quantité est supérieur au stock disponible') {
          setOpenNotification(true)
          setTypeMessage('error')
          setMessage(result.description)
        }

        if (result.success) {
          reset()
          onAdd()
          toggle()
          onSuccess('Registration completed successfully')
        } else {
          setOpenNotification(true)
          setTypeMessage('error')
          console.log('-----', result.description)
          setMessage('Une erreur est survenue.')
        }
      }
    }

    // if (id === -1) {
    //   const result = await mouvementService.createSortieR1(sendData)
    //   setSend(false)

    //   console.log("result :::", result.description);

    //   if (result.description === "La quantité est supérieur au stock disponible") {
    //     setOpenNotification(true);
    //     setTypeMessage("error");
    //     setMessage(result.description)
    //   }

    //   if (result.success) {
    //     reset()
    //     onAdd()
    //     toggle()
    //     onSuccess("Registration completed successfully");
    //   } else {
    //     setOpenNotification(true);
    //     setTypeMessage("error");
    //     console.log("-----", result.description);
    //     setMessage("Une erreur est survenue.")
    //   }
    // }
  }
  // console.log('fact-Id :::', factureId)

  const handleClose = () => {
    toggle()
    reset()
  }

  useEffect(() => {
    reset({
      factureId: currentFactureDetail && currentFactureDetail?.factureId !== undefined ? 0 : 0,
      produitId: currentFactureDetail && currentFactureDetail?.produitId !== undefined ? 0 : 0,
      qte: currentFactureDetail !== null ? 0 : 0
    })
    setId(-1)
  }, [open, currentFactureDetail])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>
          {id === -1 ? `Ajout de Produit sur facture ${codeFact}` : 'Modification de facture'}
        </Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Controller
            name='produitId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                fullWidth
                sx={{ mb: 6 }}
                options={products} 
                getOptionLabel={product => `${product.name} ${product.model}`}
                value={products.find(product => product.id === value) || null} 
                onChange={(e, newValue) => onChange(newValue ? newValue.id : 0)}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    error={Boolean(errors.produitId)}
                    {...(errors.produitId && { helperText: errors.produitId.message })}
                    label='Sélectionnez un produit'
                  />
                )}
              />
            )}
          />
          <Controller
            name='qte'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                size='small'
                sx={{ mb: 4 }}
                label='Quantité'
                onChange={onChange}
                error={Boolean(errors.qte)}
                {...(errors.qte && { helperText: errors.qte.message })}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='outlined' sx={{ mr: 3 }} color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <LoadingButton type='submit' loading={send} endIcon={<SaveIcon />} variant='contained'>
              {t('Submit')}
            </LoadingButton>
          </Box>
        </form>

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
      </Box>
    </Drawer>
  )
}

export default SidebarAddFactureDetail
