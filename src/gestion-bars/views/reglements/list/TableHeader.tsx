import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'
import { TextField } from '@mui/material'

interface TableHeaderProps {
  toggle: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { toggle } = props

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
        label={t('Search Fournisseur') as string}
        size="small"
        color="primary"
        type="text"
        sx={{ mr: 4, display: "none" }}
      />

      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <span style={{ marginRight: '0.1rem' }}>{t('Add an fournisseur')}</span>
          <Icon fontSize='1.5rem' icon='tabler:plus' />
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
