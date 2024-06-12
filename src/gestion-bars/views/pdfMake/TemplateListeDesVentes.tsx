import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import Reglement from 'src/gestion-bars/logic/models/Reglement'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: Reglement[]
  fileName: string
}

const TemplateListeDesVentes: React.FC<PdfDocumentProps> = ({ data, fileName }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: 'ID', style: 'tableHeader' },
        { text: 'Date', style: 'tableHeader' },
        { text: 'Client', style: 'tableHeader' },
        { text: 'Code Facture', style: 'tableHeader' },
        { text: 'Total', style: 'tableHeader' },
        { text: 'Auteur', style: 'tableHeader' }
      ],
      ...data.map((row, index) => [
        index + 1,
        row.createdAt.slice(0, -5).replace(/T/g, ' '),
        row.client,
        { text: row.codeFacture, color: 'red' },
        row.totalFacture,
        row.firstname + ' ' + row.lastname
      ])
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'Liste des ventes',
        alignment: 'center',
        margin: [0, 20, 0, 20],
        fontSize: 18,
        bold: true
      },
      footer: (currentPage: number, pageCount: number) => {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          margin: [0, 20, 0, 20]
        }
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: tableBody
          },
          layout: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            fillColor: function (rowIndex: number, node: any, columnIndex: number) {
              return rowIndex % 2 === 0 ? '#F3F3F3' : null
            }
          }
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#CCCCCC',
          alignment: 'center'
        },
        tableCell: {
          margin: [0, 5, 0, 5]
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

export default TemplateListeDesVentes
