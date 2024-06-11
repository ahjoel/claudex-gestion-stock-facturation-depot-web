// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// import CustomTextField from 'src/@core/components/mui/text-field'


// ** Hooks Imports
import { DataGrid, GridColDef } from "@mui/x-data-grid";



const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  }
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


const DialogShareProject = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)

  // ** Hooks
  // ** Var

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='tabler:file-description' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Share Project
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Elegant Share Project options modal popup example, easy to use in any page.
        </Typography>
        <Button variant='contained' onClick={() => setShow(true)}>
          Show
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent
          sx={{
            position: 'relative',
            px: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(8)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 1 }}>
              List of stock
            </Typography>
            {/*<Typography variant='body2'>Share project with a team members</Typography>*/}
          </Box>

          <Box
            sx={{
              py: 4,
              px: 2,
              rowGap: 2,
              columnGap: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <TextField
              label="Search"
              size="small"
              color="primary"
              type="email"
              sx={{ width: '250px', mr: 2 }}
            />
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <span style={{ marginRight: '0.1rem' }}>Add Stock</span>
              <Icon fontSize='1.5rem' icon='tabler:plus' />
            </Button>
          </Box>

          {/*<Typography variant='h6'>{`${data.length} Members`}</Typography>*/}


          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </Box>

        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogShareProject
