/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: {
    designation: string
    qte: string
    pu: string
    montant: string
  }[]
  fileName: string
}

const TemplateListeDesProduits2: React.FC<PdfDocumentProps> = ({ data, fileName }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: 'DESIGNATION', style: 'tableHeader' },
        { text: 'QTE', style: 'tableHeader' },
        { text: 'P.U', style: 'tableHeader' },
        { text: 'MONTANT', style: 'tableHeader' }
      ],
      ...data.map(row => [
        { text: row.designation, fontSize: 8 },
        { text: row.qte, alignment: 'center', fontSize: 8 },
        { text: row.pu, alignment: 'center', fontSize: 8 },
        { text: row.montant, alignment: 'center', fontSize: 8 }
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
        { text: row.designation, fontSize: 8 },
        { text: row.qte, alignment: 'center', fontSize: 8 },
        { text: row.pu, alignment: 'center', fontSize: 8 },
        { text: row.montant, alignment: 'center', fontSize: 8 }
      ])
    ]

    const getInvoiceContent = (pageIndex: number, pageCount: number) => [
      { text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB', style: 'header', alignment: 'center' },
      { text: 'From: CLAUDEX\nFacturation : joel', margin: [0, 10, 0, 10], style: 'details' },
      { text: 'To: Client : TESTRT\nFacture N° CLAUDEX-2024-2/999/25\nDate: 2 février 2024', margin: [0, 10, 0, 10], style: 'details' },
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
          { text: 'MONTANT HT : 85 000,0\nTAUX TVA : 0%\nMONTANT TVA : 0\nREMISE : 0\nMONTANT TTC : 85 000,0', style: 'totals' },
          { text: 'Récap Facture :\n("BB", "C24") - 2.90 U\n("BB", "C12") - 1.00 U\n("SNB-TOG", "C24") - 1.00 U\n("SNB", "C24") - 2.00 U\n("SNB", "C12") - 0.10 U', style: 'totals' }
        ]
      },
      { text: 'ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE : QUATRE-VINGT-CINQ MILLE FRANC(S) CFA', margin: [0, 10, 0, 10], alignment: 'center', style: 'footer' },
      { text: 'AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38', alignment: 'center', style: 'footer' },
      { text: `Page ${pageIndex} of ${pageCount}`, alignment: 'center', margin: [0, 10, 0, 0], style: 'pageNumber' }
    ]

    const getInvoiceContent1 = (pageIndex: number, pageCount: number) => [
      { text: 'CLAUDEX Vente en gros et en détails des produits BB et SNB', style: 'header', alignment: 'center' },
      { text: 'From: CLAUDEX\nFacturation : joel', margin: [0, 10, 0, 10], style: 'details' },
      { text: 'To: Client : TESTRT\nFacture N° CLAUDEX-2024-2/999/25\nDate: 2 février 2024', margin: [0, 10, 0, 10], style: 'details' },
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
          { text: 'MONTANT HT : 85 000,0\nTAUX TVA : 0%\nMONTANT TVA : 0\nREMISE : 0\nMONTANT TTC : 85 000,0', style: 'totals' },
          { text: 'Récap Facture :\n("BB", "C24") - 2.90 U\n("BB", "C12") - 1.00 U\n("SNB-TOG", "C24") - 1.00 U\n("SNB", "C24") - 2.00 U\n("SNB", "C12") - 0.10 U', style: 'totals' }
        ]
      },
      { text: 'ARRÊTEE LA PRESENTE FACTURE A LA SOMME DE : QUATRE-VINGT-CINQ MILLE FRANC(S) CFA', margin: [0, 10, 0, 10], alignment: 'center', style: 'footer' },
      { text: 'AGOE AMANDETA EPP Amandeta Face Antenne Togocom; Tel : (+228) 92 80 26 38', alignment: 'center', style: 'footer' },
      { text: `Page ${pageIndex} of ${pageCount}`, alignment: 'center', margin: [0, 10, 0, 0], style: 'pageNumber' }
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          columns: [
            { width: '48%', stack: getInvoiceContent(1, 2), margin: [10, 10, 10, 0] },
            { width: '49%', stack: getInvoiceContent1(1, 2), margin: [15, 10, 0, 0] }
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

export default TemplateListeDesProduits2