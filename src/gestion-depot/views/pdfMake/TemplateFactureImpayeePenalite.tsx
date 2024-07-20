/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import StatFacturePenalite from 'src/gestion-depot/logic/models/StatFacturePenalite'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: StatFacturePenalite[]
  fileName: string
}

const TemplateFactureImpayeePenalite: React.FC<PdfDocumentProps> = ({ data, fileName }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: '#', style: 'tableHeader', alignment: 'center' },
        { text: 'Date Facture', style: 'tableHeader' },
        { text: 'Code', style: 'tableHeader' },
        { text: 'Montant Restant', style: 'tableHeader' },
        { text: 'Nbr. Jours', style: 'tableHeader' },
        { text: 'Montant TTC', style: 'tableHeader' },
        { text: 'Montant Encaisse', style: 'tableHeader' }
      ],
      ...data.map((row,index) => [
        { text: (index + 1).toString(), alignment: 'center' },
        { text: row.createdAt?.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
        { text: row.code, alignment: 'center' },
        { text: row.mt_restant.toString(), alignment: 'center' },
        { text: row.nbJour, alignment: 'center' },
        { text: row.mt_a_payer.toString(), alignment: 'center' },
        { text: row.mt_encaisse.toString(), alignment: 'center' }
      ])
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 50, 40, 60],
      header: {
        text: `SUIVI DES FACTURES IMPAYEES`,
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
            widths: ['auto', 'auto', '*', '*', 'auto', 'auto', 'auto'],
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

export default TemplateFactureImpayeePenalite
