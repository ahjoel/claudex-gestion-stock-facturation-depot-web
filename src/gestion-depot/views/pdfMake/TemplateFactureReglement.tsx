/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import StatFactureReglement from 'src/gestion-depot/logic/models/StatFactureReglement'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: StatFactureReglement[]
  fileName: string
  date_debut: string
  date_fin: string
}

const TemplateFactureReglement: React.FC<PdfDocumentProps> = ({ data, fileName, date_debut, date_fin }) => {
  const generatePdf = () => {
    // Calcul des totaux
    const totals = data.reduce((acc, row) => {
      acc.mt_a_payer += Number(row.mt_a_payer)
      acc.mt_encaisse += Number(row.mt_encaisse)
      acc.mt_restant += Number(row.mt_restant)
      return acc
    }, { mt_a_payer: 0, mt_encaisse: 0, mt_restant: 0 })

    const tableBody = [
      [
        { text: '#', style: 'tableHeader', alignment: 'center' },
        { text: 'Date Facture', style: 'tableHeader' },
        { text: 'Code', style: 'tableHeader' },
        { text: 'Date Reglement', style: 'tableHeader' },
        { text: 'Client', style: 'tableHeader' },
        { text: 'Montant TTC', style: 'tableHeader' },
        { text: 'Montant Encaisse', style: 'tableHeader' },
        { text: 'Montant Restant', style: 'tableHeader' },
        { text: 'Statut', style: 'tableHeader' }
      ],
      ...data.map((row,index) => [
        { text: (index + 1).toString(), alignment: 'center' },
        { text: row.createdAt?.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
        { text: row.code, alignment: 'center' },
        { text: row.createdAtReg?.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
        { text: row.client, color: 'red', alignment: 'center' },
        { text: row.mt_a_payer.toString(), alignment: 'center' },
        { text: row.mt_encaisse.toString(), alignment: 'center' },
        { text: row.mt_restant.toString(), alignment: 'center' },
        { text: row.statut.toString(), alignment: 'center', color: 'red' }
      ]),
      [
        { text: 'Total', style: 'tableTotal', colSpan: 5, alignment: 'center' },
        {},
        {},
        {},
        {},
        { text: totals.mt_a_payer.toFixed(0).toLocaleString(), alignment: 'center' },
        { text: totals.mt_encaisse.toFixed(0).toLocaleString(), alignment: 'center' },
        { text: totals.mt_restant.toFixed(0).toLocaleString(), alignment: 'center' },
        {}
      ]
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 50, 40, 60],
      header: {
        text: `STATISTIQUE DES VENTES`,
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
            widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', '*'],
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

export default TemplateFactureReglement
