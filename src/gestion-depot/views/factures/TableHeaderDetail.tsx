import Box from "@mui/material/Box";
import { Button, TextField, Tooltip } from "@mui/material";
import SaveAltIcon from '@mui/icons-material/SaveAlt'

interface TableHeaderProps {
  value: string;
  factureModifiee: string;
  onDownload: () => void
  toggle: (data: any) => void;
  handleFilterDetail: (val: string) => void;
}

const TableHeaderDetail = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilterDetail, toggle, value, factureModifiee, onDownload } = props;

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextField
        label="Recherche de produit"
        size="small"
        color="primary"
        type="text"
        value={value}
        onChange={(e) => handleFilterDetail(e.target.value)}
        sx={{ mr: 4 }}
      />

      {/* {etatFacture === "impayée" && ( */}
      <Box
        sx={{
          rowGap: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >

        {factureModifiee === "intact" ? <Button
          onClick={toggle}
          variant="contained"
          sx={{ "& svg": { mr: 2 } }}
        >
          <span style={{ marginRight: "0.1rem" }}>Ajouter un produit</span>
        </Button> : ''}
        <Tooltip title="Imprimer la facture">
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
  );
};

export default TableHeaderDetail;
