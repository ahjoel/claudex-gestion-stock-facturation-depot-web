import React, { useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NumberToLetter } from 'convertir-nombre-lettre';
import FactureDetail from 'src/gestion-depot/logic/models/FactureDetail';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface PdfDocumentProps {
  data: FactureDetail[];
  fileName: string;
  code: string;
  client: string;
  remise: string;
  dateFact: string;
  auteur: string;
}

const TemplateFactureUnique: React.FC<PdfDocumentProps> = ({ data, fileName, client, code, remise, dateFact, auteur }) => {
  // Fonction pour compter les modèles par fournisseur
  const recapFacture = (data: FactureDetail[]): any[] => {
    const recap: any[] = [];

    data.forEach(row => {
      const { fournisseur, modele, qte } = row;
      const existingItem = recap.find(item => item.fournisseur === fournisseur && item.modele === modele);
      if (existingItem) {
        existingItem.quantite += qte;
      } else {
        recap.push({ fournisseur, modele, quantite: qte });
      }
    });

    return recap;
  };

  const totalMontant = data.reduce((acc, row) => acc + (row.qte * row.pv), 0);

  const generatePdf = () => {
    const tableBody = [
      [
        { text: 'DESIGNATION', style: 'tableHeader' },
        { text: 'QTE', style: 'tableHeader' },
        { text: 'P.U', style: 'tableHeader' },
        { text: 'MONTANT', style: 'tableHeader' }
      ],
      ...data.map(row => [
        { text: `${row.produit} ${row.modele}`, fontSize: 8 },
        { text: row.qte, alignment: 'center', fontSize: 8 },
        { text: row.pv, alignment: 'center', fontSize: 8 },
        { text: (row.qte * row.pv).toFixed(2), alignment: 'center', fontSize: 8 }
      ])
    ];

    const recap = recapFacture(data);

    // Fonction pour obtenir le contenu du footer avec la pagination
    const getFooter = (pageIndex: number, pageCount: number) => {
      return {
        text: [
          { text: `AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38\n`, alignment: 'center', style: 'footer' },
          { text: `Page ${pageIndex} of ${pageCount}`, alignment: 'center', margin: [0, 10], style: 'pageNumber' }
        ],
        margin: [0, 10]
      };
    };

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait', // Orientation portrait
      pageMargins: [20, 30, 20, 50], // Marges de la page (haut, gauche, bas, droite)

      content: [
        {
          text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB',
          style: 'header',
          alignment: 'center',
          margin: [0, 10]
        },
        {
          text: `From: CLAUDEX\nFacturation : ${auteur}`,
          style: 'details',
          margin: [0, 10]
        },
        {
          text: `To: Client : ${client}\nFacture N° ${code}\nDate: ${dateFact}`,
          style: 'details',
          alignment: 'right',
          margin: [0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: tableBody
          },
          layout: {
            fillColor: function (rowIndex: any) {
              return rowIndex % 2 === 0 ? '#F3F3F3' : null;
            }
          },
          style: 'tableStyle'
        },
        {
          columns: [
            {
              text: `MONTANT HT : ${totalMontant.toFixed(2)} XOF\nTAUX TVA : 0%\nMONTANT TVA : 0\nREMISE : ${remise}\nMONTANT TTC : ${(totalMontant - Number(remise)).toFixed(2)} XOF`,
              style: 'totals',
              margin: [0, 10]
            },
            {
              text: `Récap Facture :\n${recap.map(item => `("${item.fournisseur}", "${item.modele}") - ${item.quantite} U`).join('\n')}`,
              style: 'totals',
              margin: [0, 10]
            }
          ]
        },
        {
          text: `ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE : ${NumberToLetter((Math.trunc(totalMontant) - Number(remise)).toFixed(2)).toUpperCase()} FRANCS CFA`,
          style: 'footer',
          alignment: 'center',
          margin: [0, 10]
        }
      ],

      footer: getFooter,

      styles: {
        header: {
          fontSize: 12,
          bold: true
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillColor: '#CCCCCC',
          alignment: 'center'
        },
        tableStyle: {
          margin: [0, 5, 0, 15]
        },
        totals: {
          fontSize: 10,
          margin: [0, 5]
        },
        details: {
          fontSize: 10
        },
        footer: {
          fontSize: 10
        },
        pageNumber: {
          fontSize: 8,
          bold: true
        }
      }
    };

    pdfMake.createPdf(documentDefinition).download(`${fileName}.pdf`);
  };

  useEffect(() => {
    generatePdf();
  }, [fileName]);

  return null;
};

export default TemplateFactureUnique;
