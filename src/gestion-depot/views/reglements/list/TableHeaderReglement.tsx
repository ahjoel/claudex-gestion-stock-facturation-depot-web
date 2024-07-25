import Box from '@mui/material/Box'
import { Button, TextField, Tooltip } from "@mui/material";
import SaveAltIcon from '@mui/icons-material/SaveAlt'

interface TableHeaderProps {
  value: string
  onDownload: () => void
  handleFilterDetail: (val: string) => void
}

const TableHeaderReglement = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilterDetail, value, onDownload } = props

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
        label="Recherche de produit"
        size="small"
        color="primary"
        type="text"
        value={value}
        onChange={e => handleFilterDetail(e.target.value)}
        sx={{ mr: 4 }}
      />

      {/* {etatFacture === "impayée" && ( */}
        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip title="Imprimer la situation facture">
          <Button
          sx={{ marginLeft: "5px" }}
          size="small"
          variant="contained"
          onClick={() => {
            onDownload();
          }}
        >
          <SaveAltIcon />
        </Button>
        </Tooltip>
        </Box>
      {/* )} */}
    </Box>
  )
}

export default TableHeaderReglement
