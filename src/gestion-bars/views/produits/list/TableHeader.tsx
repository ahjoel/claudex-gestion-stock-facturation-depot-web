import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { TextField } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import SaveAltIcon from '@mui/icons-material/SaveAlt'

interface TableHeaderProps {
  value: string
  onDownload: () => void
  toggle: () => void
  onReload: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, onReload, onDownload } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <TextField
        label='Recherche de produit'
        size='small'
        color='primary'
        type='text'
        value={value}
        onChange={e => handleFilter(e.target.value)}
        sx={{ mr: 4 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'right' }}>
        <Button onClick={toggle} variant='contained' sx={{ height: '38px' }}>
          <span style={{ marginRight: '0.2rem' }}>Ajouter un produit</span>
          <Icon icon='tabler:plus' />
        </Button>

        <Button
          sx={{ marginLeft: '5px' }}
          size='small'
          variant='contained'
          onClick={() => {
            onReload()
          }}
        >
          <AutorenewIcon />
        </Button>
        <Button
          sx={{ marginLeft: '5px' }}
          size='small'
          variant='contained'
          onClick={() => {
            onDownload()
          }}
        >
          <SaveAltIcon />
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
