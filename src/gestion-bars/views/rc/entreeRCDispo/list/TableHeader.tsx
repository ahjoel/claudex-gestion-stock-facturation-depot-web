import Box from '@mui/material/Box'
import { Button, TextField } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'

interface TableHeaderProps {
  value: string
  onReload: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, onReload } = props

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
        label='Recherche de stock'
        size='small'
        color='primary'
        type='text'
        value={value}
        onChange={e => handleFilter(e.target.value)}
        sx={{ mr: 4 }}
      />
      <Box sx={{ display: 'flex', alignItems: 'right' }}>
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
      </Box>
    </Box>
  )
}

export default TableHeader
