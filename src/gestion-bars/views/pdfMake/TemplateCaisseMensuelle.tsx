import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import StatCaisse from 'src/gestion-bars/logic/models/StatCaisse'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: StatCaisse[]
  fileName: string
}

const TemplateCaisseMensuelle: React.FC<PdfDocumentProps> = ({ data, fileName }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: '#', style: 'tableHeader', alignment: 'center' },
        { text: 'Mois_Annee', style: 'tableHeader' },
        { text: 'MontantTotal', style: 'tableHeader' }
      ],
      ...data.map(row => [
        { text: row.id.toString(), alignment: 'center' },
        { text: row.Mois_Annee.toString(), alignment: 'center' },
        { text: row.MontantTotal.toString(), alignment: 'center' }
      ])
    ]

    const totalRow = [
      { text: 'Total', colSpan: 2, alignment: 'center', bold: true },
      {},
      { text: formatNumber(calculateTotal(data)), alignment: 'center', bold: true }
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: `SATISTIQUE CAISSE MENSUELLE`,
        alignment: 'center',
        margin: [0, 10, 0, 10],
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
        // {
        //   text: `Période du ${date_debut} au ${date_fin}`,
        //   alignment: 'center',
        //   fontSize: 12,
        //   margin: [0, 0, 0, 15]
        // },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto'],
            body: [...tableBody, totalRow]
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
          margin: [1, 5, 0, 5]
        }
      }
    }

    pdfMake.createPdf(documentDefinition).download(`${fileName}.pdf`)
  }

  // Fonction pour calculer le total des montants
  const calculateTotal = (data: StatCaisse[]): number => {
    let total = 0
    data.forEach(row => {
      total += Number(row.MontantTotal)
    })

    return total
  }

  // Fonction pour formater les nombres avec séparateur de milliers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  useEffect(() => {
    generatePdf()
  }, [fileName])

  return null
}

export default TemplateCaisseMensuelle
