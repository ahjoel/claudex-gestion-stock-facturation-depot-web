import { Alert, AlertColor, Button, CircularProgress, Dialog, DialogActions, DialogContent, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PrintIcon from '@mui/icons-material/Print';
import { t } from 'i18next';
import FactureDetail from 'src/gestion-bars/logic/models/FactureDetail';
import FactureService from 'src/gestion-bars/logic/services/FactureService';

interface TableReceiptProps {
  open: boolean
  codeFact: string
  totalFacture: string
  closeDialog: () => void
}
interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  '*': {
    fontSize: '10px',
    fontFamily: 'Times New Roman',
  },
  'td, th, tr, table': {
    borderTop: '1px solid black',
    borderCollapse: 'collapse',
  },
  '.description': {
    width: '150px',
    maxWidth: '150px',
  },
  '.quantity': {
    width: '50px',
    maxWidth: '50px',
    wordBreak: 'break-all',
  },
  '.price': {
    width: '60px',
    maxWidth: '60px',
    wordBreak: 'break-all',
  },
  '.total': {
    fontWeight: 'bold',
  },
  '.centered': {
    textAlign: 'center',
    alignContent: 'center',
  },
  '.ticket': {
    width: '300px',
    maxWidth: '300px',
  },
  img: {
    maxWidth: 'inherit',
    width: 'inherit',
  },
};


const PrintReceiptDialog = (props: TableReceiptProps) => {
  const { open, closeDialog, codeFact, totalFacture } = props
  console.log("detail Facture : ", codeFact);
  console.log("totalFacture Facture : ", totalFacture);
  const factureService = new FactureService()
  const [facturesDetailPrint, setFacturesDetailPrint] = useState<FactureDetail[]>([])
  const [statusFactureDetailPrint, setStatusFactureDetailPrint] = useState<boolean>(false)

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false);
    }
    setOpenNotification(false);
  };

  // const handleClose = () => {
  //   setFacturesDetailPrint([])
  //   setStatusFactureDetailPrint(false)
  //   closeDialog()
  // }

  const handlePrint = () => {
    // Masquer les éléments que vous ne souhaitez pas imprimer
    const dialogActions = document.querySelector('.dialog-actions-dense') as HTMLElement | null;
    if (dialogActions) {
      dialogActions.style.display = 'none';
    }

    // Imprimer la fenêtre actuelle
    window.print();

    // Rétablir l'affichage des éléments masqués après l'impression
    if (dialogActions) {
      dialogActions.style.display = 'flex';
    }
  };

  const getDetailsFactureForPrint = async () => {
    setStatusFactureDetailPrint(false)
    const result = await factureService.listFactureDetail({ code: codeFact || null })

    if (result.success) {
      setStatusFactureDetailPrint(true)
      setFacturesDetailPrint(result.data as FactureDetail[])
    } else {
      setOpenNotification(true);
      setTypeMessage("error")
      setMessage("Une erreur est survenue lors du chargement des produits de facture")
    }
  }

  useEffect(() => {
    getDetailsFactureForPrint()
  }, [])

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason === 'backdropClick') {
          closeDialog;
        }
      }}
    >
      <DialogContent>
        <div className="ticket" style={styles['.ticket']}>
          <img src="./logo.png" alt="Logo" style={styles.img} />
          <p className="centered" style={styles['.centered']}>CLAUDEX-BAR<br />AGOE AMANDETA EPP Amandeta Face Antenne Togocom<br />Tel : (+228) 92 80 26 38</p>
          <table style={styles['td, th, tr, table']}>
            <thead>
              <tr>
                <th className="quantity" style={styles['.quantity']}>Qte.</th>
                <th className="description" style={styles['.description']}>Description</th>
                <th className="price" style={styles['.price']}>Prix Vte</th>
              </tr>
            </thead>
            <br />
            <tbody>
              {statusFactureDetailPrint ? (
                facturesDetailPrint?.map((facturesDetp) => (
                  <tr key={facturesDetp.id}>
                    <td className="quantity" style={styles['.quantity']}>{facturesDetp.qte}</td>
                    <td className="description" style={styles['.description']}>{facturesDetp.produit}{''}{facturesDetp.modele}</td>
                    <td className="price" style={styles['.price']}>{facturesDetp.pv}</td>
                  </tr>
                ))
              ) : <CircularProgress />}
              <br />
              <tr>
                <td className="quantity" style={styles['.quantity']}></td>
                <td className="description" style={styles['.total']}>TOTAL</td>
                <td className="price" style={styles['.total']}>{totalFacture} {' F CFA'}</td>
              </tr>

            </tbody>
          </table>
          <p className="centered" style={styles['.centered']}>Merci de votre commande !</p>
        </div>
      </DialogContent>

      <DialogActions className='dialog-actions-dense' style={{ visibility: open ? 'visible' : 'hidden' }}>
        <Button variant='contained' onClick={closeDialog} color='secondary'>
          {t('Cancel')}
        </Button>
        <Button variant='contained' onClick={handlePrint}><span>Imprimer</span>{' '}<PrintIcon /></Button>
      </DialogActions>

    </Dialog>

  );
  <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openNotification} onClose={handleCloseNotification} autoHideDuration={5000}>
    <Alert onClose={handleCloseNotification} severity={typeMessage as AlertColor} variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>

};

export default PrintReceiptDialog;
