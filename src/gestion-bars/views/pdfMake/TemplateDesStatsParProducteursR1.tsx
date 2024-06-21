/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import StatParProducteur from 'src/gestion-bars/logic/models/StatParProducteur'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: StatParProducteur[]
  fileName: string
  date_debut: string
  date_fin: string
}

const TemplateDesStatsParProducteursR1: React.FC<PdfDocumentProps> = ({ data, fileName, date_debut, date_fin }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: 'Producteur', style: 'tableHeader' },
        { text: 'Quantité', style: 'tableHeader' },
        { text: 'Montant Vendu', style: 'tableHeader' },
        { text: 'Statut', style: 'tableHeader' },
        { text: 'Stock', style: 'tableHeader' }
      ],
      ...data.map(row => [
        row.producteur,
        row.quantite,
        { text: row.montant_vendu, color: 'red' },
        row.statut,
        row.stock
      ])
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: `Statistique par producteur du ${date_debut} au ${date_fin}`,
        alignment: 'center',
        margin: [5, 25, 5, 25],
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
            widths: ['*', '*', '*', '*', '*'],
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

export default TemplateDesStatsParProducteursR1
