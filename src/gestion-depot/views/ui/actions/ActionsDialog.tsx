// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { t } from 'i18next'

const ActionsDialog = ({
  actionText,
  open = false,
  onClose,
  onValid
}: {
  actionText: string
  open: boolean
  onClose: () => void
  onValid: () => void
}) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle id='alert-dialog-title' color='error'>
        {t('Confirmation')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{actionText}</DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button color='error' onClick={onClose}>
          {t('No')}
        </Button>
        <Button color='success' onClick={onValid}>
          {t('Yes')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionsDialog
