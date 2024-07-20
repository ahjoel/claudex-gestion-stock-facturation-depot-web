/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NumberToLetter } from 'convertir-nombre-lettre'
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
  mtrestant: string;
  mtencaisse: string;
  impayee: string;
  dateEcheance: string;
}

const TemplateFactureRegleUnique: React.FC<PdfDocumentProps> = ({
  data,
  fileName,
  client,
  code,
  remise,
  dateFact,
  auteur,
  mtrestant,
  mtencaisse,
  impayee,
  dateEcheance,
}) => {

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
        { text: `${row.produit} ${row.modele}`, fontSize: 10 },
        { text: row.qte, alignment: 'center', fontSize: 10 },
        { text: row.pv.toFixed(2), alignment: 'center', fontSize: 10 },
        { text: (row.qte * row.pv).toFixed(2), alignment: 'center', fontSize: 10 }
      ])
    ];

    const recap = recapFacture(data);
    const paymentSummary = [
      [
        { text: 'Mode Paiement: ESPECES', style: 'paymentSummary', margin: [0, 10] },
        { text: `Ancien reste à payer: ${impayee}`, style: 'paymentSummary', margin: [0, 10] }
      ],
      [
        { text: `Date Echeance: ${dateEcheance}`, style: 'paymentSummary', margin: [0, 10] },
        { text: 'Reliquat: 0', style: 'paymentSummary', margin: [0, 10] }
      ],
      [
        { text: `Reste à payer: ${mtrestant}`, style: 'paymentSummary', margin: [0, 10] },
        { text: `Total Encaisse: ${mtencaisse}`, style: 'paymentSummary', margin: [0, 10] }
      ]
    ];

    const getInvoiceContent = (pageIndex: number, pageCount: number) => [
      { text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB', style: 'header', alignment: 'center' },
      { text: `From: CLAUDEX\nFacturation : ${auteur}`, margin: [0, 30, 0, 20], style: 'details' },
      { text: `To: Client : ${client}\nFacture N° ${code}\nDate: ${dateFact}`, margin: [350, 5, 0, 20], style: 'details' },
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
            style: 'totals'
          },
          {
            text: `Récap Facture :\n${recap.map(item => `("${item.fournisseur}", "${item.modele}") - ${item.quantite} U`).join('\n')}`,
            style: 'totals'
          }
        ],
        margin: [0, 10]
      },
      {
        table: {
          widths: ['*', '*'],
          body: paymentSummary
        },
        layout: 'noBorders',
        margin: [0, 10]
      },
      {
        text: `ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE : ${NumberToLetter((Math.trunc(totalMontant) - Number(remise)).toFixed(2)).toUpperCase()} FRANCS CFA`,
        margin: [0, 15],
        alignment: 'center',
        style: 'footer'
      },
      {
        text: 'AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38',
        alignment: 'center',
        style: 'footer'
      },
      {
        text: `Page ${pageIndex} sur ${pageCount}`,
        alignment: 'center',
        margin: [0, 10],
        style: 'pageNumber'
      }
    ];

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 30, 20, 40],
      content: getInvoiceContent(1, 1), // Update this if you have multiple pages
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10]
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
          fontSize: 10,
        },
        footer: {
          fontSize: 10,
          margin: [0, 10]
        },
        pageNumber: {
          fontSize: 10,
          bold: true
        },
        paymentSummary: {
          fontSize: 10,
          margin: [0, 10],
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

export default TemplateFactureRegleUnique;
