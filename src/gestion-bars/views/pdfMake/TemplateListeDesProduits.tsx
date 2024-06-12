import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import Produit from 'src/gestion-bars/logic/models/Produit'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: Produit[]
  fileName: string
}

const TemplateListeDesProduits: React.FC<PdfDocumentProps> = ({ data, fileName }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: 'Code', style: 'tableHeader' },
        { text: 'Nom', style: 'tableHeader' },
        { text: 'Description', style: 'tableHeader' },
        { text: 'Model', style: 'tableHeader' },
        { text: 'Fournisseur', style: 'tableHeader' },
        { text: 'Prix de Vente', style: 'tableHeader' },
        { text: 'Stock Minimal', style: 'tableHeader' }
      ],
      ...data.map(row => [
        row.code,
        row.name,
        { text: row.description, color: 'red' },
        row.model,
        row.fournisseur,
        { text: row.pv.toString(), alignment: 'right', color: 'red' },
        { text: row.stock_min.toString(), alignment: 'right', color: 'red' }
      ])
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'Liste des Produits',
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
            widths: ['*', '*', '*', '*', '*', '*', '*'],
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

export default TemplateListeDesProduits
