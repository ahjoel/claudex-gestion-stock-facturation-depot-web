/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: Array<{ col1: string; col2: string; col3: string; col4: string }>
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ data }) => {
  const generatePdf = () => {
    const documentDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'En-tête personnalisé',
        alignment: 'center',
        margin: [0, 20, 0, 20]
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
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Header 1', style: 'tableHeader' },
                { text: 'Header 2', style: 'tableHeader' },
                { text: 'Header 3', style: 'tableHeader' },
                { text: 'Header 4', style: 'tableHeader' }
              ],
              ...data.map(row => [row.col1, row.col2, row.col3, row.col4])
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }

    pdfMake.createPdf(documentDefinition).download('table_document.pdf')
  }

  useEffect(() => {
    generatePdf()
  }, [])

  return null
}

export default PdfDocument
