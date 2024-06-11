import Box from '@mui/material/Box'
import { TextField } from '@mui/material'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value } = props

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
        label="Recherche facture"
        size="small"
        color="primary"
        type="text"
        value={value}
        onChange={e => handleFilter(e.target.value)}
        sx={{ mr: 4 }}
      />

    </Box>
  )
}

export default TableHeader
