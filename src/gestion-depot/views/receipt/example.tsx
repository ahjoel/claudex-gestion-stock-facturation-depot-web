// components/ReceiptExample.js
import React from 'react';

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


const ReceiptExample = () => {
  return (
    <div className="ticket" style={styles['.ticket']}>
      <img src="./logo.png" alt="Logo" style={styles.img} />
      <p className="centered" style={styles['.centered']}>CLAUDEX-BAR<br />AGOE AMANDETA EPP Amandeta Face Antenne Togocom<br />Tel : (+228) 92 80 26 38</p>
      <table style={styles['td, th, tr, table']}>
        <thead>
          <tr>
            <th className="quantity" style={styles['.quantity']}>Qte.</th>
            <th className="description" style={styles['.description']}>Description</th>
            <th className="price" style={styles['.price .total']}>Prix Vente</th>
          </tr>
        </thead>
        <br />
        <tbody>
          <tr>
            <td className="quantity" style={styles['.quantity']}>1.00</td>
            <td className="description" style={styles['.description']}>ARDUINO UNO R3</td>
            <td className="price" style={styles['.price']}>$25.00</td>
          </tr>
          <tr>
            <td className="quantity" style={styles['.quantity']}>2.00</td>
            <td className="description" style={styles['.description']}>JAVASCRIPT BOOK</td>
            <td className="price" style={styles['.price']}>$10.00</td>
          </tr>
          <tr>
            <td className="quantity" style={styles['.quantity']}>1.00</td>
            <td className="description" style={styles['.description']}>STICKER PACK</td>
            <td className="price" style={styles['.price']}>$10.00</td>
          </tr>
          <br />
          <tr>
            <td className="quantity" style={styles['.quantity']}></td>
            <td className="description" style={styles['.total']}>TOTAL</td>
            <td className="price" style={styles['.total']}>$55.00</td>
          </tr>
        </tbody>
      </table>
      <p className="centered" style={styles['.centered']}>Merci de votre commande !</p>
    </div>
  );
};

export default ReceiptExample;
