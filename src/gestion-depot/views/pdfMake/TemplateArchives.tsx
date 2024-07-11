/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import StatArchive from 'src/gestion-depot/logic/models/StatArchive'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: StatArchive[]
  fileName: string
  date_debut: string
  stock: string
  date_fin: string
}

const TemplateArchives: React.FC<PdfDocumentProps> = ({ data, fileName, stock, date_debut, date_fin }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: '#', style: 'tableHeader', alignment: 'center' },
        { text: 'Code', style: 'tableHeader' },
        { text: 'Client', style: 'tableHeader' },
        { text: 'Date Creation', style: 'tableHeader' },
        { text: 'Taxe', style: 'tableHeader' },
        { text: 'Nombre de Produit', style: 'tableHeader' },
        { text: 'Montant Facture', style: 'tableHeader' },
        { text: 'Statut', style: 'tableHeader' }
      ],
      ...data.map(row => [
        { text: row.id, alignment: 'center' },
        row.code,
        row.client,
        { text: row.date_creation.toString().split('T')[0], color: 'red', alignment: 'center' },
        { text: row.taxe, alignment: 'center' },
        { text: row.nbproduit, alignment: 'center' },
        { text: row.totalfacture, alignment: 'center' },
        { text: row.statut.toString(), alignment: 'center', color: 'red' }
      ])
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: `LISTE DES FACTURES ARCHIVEES STOCK - ${stock}`,
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
        {
          text: `Période du ${date_debut} au ${date_fin}`,
          alignment: 'center',
          fontSize: 12,
          margin: [0, 0, 0, 15]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
          margin: [1, 5, 0, 5]
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

export default TemplateArchives
