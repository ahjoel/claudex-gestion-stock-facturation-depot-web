/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import FactureDetail from 'src/gestion-depot/logic/models/FactureDetail'

pdfMake.vfs = pdfFonts.pdfMake.vfs
import { NumberToLetter } from 'convertir-nombre-lettre';

interface PdfDocumentProps {
  data: FactureDetail[]
  fileName: string
  code: string
  client: string
  remise: string
  dateFact: string
  auteur: string
}

const TemplateFacture: React.FC<PdfDocumentProps> = ({ data, fileName, client, code, remise, dateFact, auteur }) => {

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
    ]
    const tableBody1 = [
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
    ]
    const recap = recapFacture(data);
    const getInvoiceContent = (pageIndex: number, pageCount: number) => [
      
      { text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB', style: 'header', alignment: 'center' },
      { text: `From: CLAUDEX\nFacturation : ${auteur}`, margin: [0, 30, 0, 20], style: 'details' },
      { text: `To: Client : ${client}\nFacture N° ${code}\nDate: ${dateFact}`, margin: [250, 5, 0, 10], style: 'details' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 50, 50, 80],
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex:any) {
            return rowIndex % 2 === 0 ? '#F3F3F3' : null
          }
        },
        style: 'tableStyle'
      },
      {
        columns: [
          { text: `MONTANT HT : ${totalMontant.toFixed(2)} XOF\nTAUX TVA : 0%\nMONTANT TVA : 0\nREMISE : ${remise}\nMONTANT TTC : ${(totalMontant - Number(remise)).toFixed(2)} XOF`, style: 'totals' },
          { text: `Récap Facture :\n${recap.map(item => `("${item.fournisseur}", "${item.modele}") - ${item.quantite} U`).join('\n')}`, style: 'totals' }
        ]
      },
      { text: `ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE : ${NumberToLetter((Math.trunc(totalMontant) - Number(remise)).toFixed(2)).toUpperCase()} FRANCS CFA`, margin: [0, 10, 0, 10], alignment: 'center', style: 'footer' },
      { text: 'AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38', alignment: 'center', style: 'footer' },
      { text: `Page ${pageIndex} of ${pageCount}`, alignment: 'center', margin: [0, 10, 0, 0], style: 'pageNumber' }
    ]

    const getInvoiceContent1 = (pageIndex: number, pageCount: number) => [
      
      { text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB', style: 'header', alignment: 'center' },
      { text: `From: CLAUDEX\nFacturation : ${auteur}`, margin: [0, 30, 0, 20], style: 'details' },
      { text: `To: Client : ${client}\nFacture N° ${code}\nDate: ${dateFact}`, margin: [260, 5, 0, 10], style: 'details' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 50, 50, 80],
          body: tableBody1
        },
        layout: {
          fillColor: function (rowIndex:any) {
            return rowIndex % 2 === 0 ? '#F3F3F3' : null
          }
        },
        style: 'tableStyle'
      },
      {
        columns: [
          { text: `MONTANT HT : ${totalMontant.toFixed(2)} XOF\nTAUX TVA : 0%\nMONTANT TVA : 0\nREMISE : ${remise}\nMONTANT TTC : ${(totalMontant - Number(remise)).toFixed(2)} XOF`, style: 'totals' },
          { text: `Récap Facture :\n${recap.map(item => `("${item.fournisseur}", "${item.modele}") - ${item.quantite} U`).join('\n')}`, style: 'totals' }
        ]
      },
      { text: `ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE :  ${NumberToLetter((Math.trunc(totalMontant) - Number(remise)).toFixed(2)).toUpperCase()} FRANCS CFA`, margin: [0, 10, 0, 10], alignment: 'center', style: 'footer' },
      { text: 'AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38', alignment: 'center', style: 'footer' },
      { text: `Page ${pageIndex} of ${pageCount}`, alignment: 'center', margin: [0, 10, 0, 0], style: 'pageNumber' }
    ]

    // const getInvoiceContent1 = (pageIndex: number, pageCount: number) => [
    //   { text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB', style: 'header', alignment: 'center' },
    //   { text: 'From: CLAUDEX\nFacturation : joel', margin: [0, 10, 0, 10], style: 'details' },
    //   { text: 'To: Client : TESTRT\nFacture N° CLAUDEX-2024-2/999/25\nDate: 2 février 2024', margin: [0, 10, 0, 10], style: 'details' },
    //   {
    //     table: {
    //       headerRows: 1,
    //       widths: ['*', 50, 50, 80],
    //       body: tableBody1
    //     },
    //     layout: {
    //       fillColor: function (rowIndex:any) {
    //         return rowIndex % 2 === 0 ? '#F3F3F3' : null
    //       }
    //     },
    //     style: 'tableStyle'
    //   },
    //   {
    //     columns: [
    //       { text: 'MONTANT HT : 85 000,0\nTAUX TVA : 0%\nMONTANT TVA : 0\nREMISE : 0\nMONTANT TTC : 85 000,0', style: 'totals' },
    //       { text: 'Récap Facture :\n("BB", "C24") - 2.90 U\n("BB", "C12") - 1.00 U\n("SNB-TOG", "C24") - 1.00 U\n("SNB", "C24") - 2.00 U\n("SNB", "C12") - 0.10 U', style: 'totals' }
    //     ]
    //   },
    //   { text: 'ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE : QUATRE-VINGT-CINQ MILLE FRANC(S) CFA', margin: [0, 10, 0, 10], alignment: 'center', style: 'footer' },
    //   { text: 'AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38', alignment: 'center', style: 'footer' },
    //   { text: `Page ${pageIndex} of ${pageCount}`, alignment: 'center', margin: [0, 10, 0, 0], style: 'pageNumber' }
    // ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          columns: [
            { width: '48%', stack: getInvoiceContent(1, 1), margin: [10, 10, 10, 0] },
            { width: '49%', stack: getInvoiceContent1(1, 1), margin: [15, 10, 0, 0] }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true
        },
        tableHeader: {
          bold: true,
          fontSize: 7,
          fillColor: '#CCCCCC',
          alignment: 'center'
        },
        tableStyle: {
          margin: [0, 5, 0, 10]
        },
        totals: {
          fontSize: 8,
          margin: [0, 5, 0, 5]
        },
        details: {
          fontSize: 8,
        },
        footer: {
          fontSize: 8,
        },
        pageNumber: {
          fontSize: 8,
          bold: true
        }
      }
    }

    pdfMake.createPdf(documentDefinition).download(`${fileName}.pdf`)
  }

  useEffect(() => {
    generatePdf()
  }, [fileName])

  return null
}

export default TemplateFacture