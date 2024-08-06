import React, { useEffect } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import StatInventaireStockVente from 'src/gestion-depot/logic/models/StatInventaireStockVente'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface PdfDocumentProps {
  data: StatInventaireStockVente[]
  fileName: string
  date_debut: string
  date_fin: string
}

const TemplateInventaireStockVente: React.FC<PdfDocumentProps> = ({ data, fileName, date_debut, date_fin }) => {
  const generatePdf = () => {
    const tableBody = [
      [
        { text: '#', style: 'tableHeader', alignment: 'center' },
        { text: 'Produit', style: 'tableHeader' },
        { text: 'Model', style: 'tableHeader' },
        { text: 'Fournisseur', style: 'tableHeader' },
        { text: 'Qte Avant Per', style: 'tableHeader' },
        { text: 'Qte Entree Per', style: 'tableHeader' },
        { text: 'Qte Sortie Per', style: 'tableHeader' },
        { text: 'Qte Rest Ap. Per', style: 'tableHeader' },
        { text: 'Stock Minimal', style: 'tableHeader' }
      ],
      ...data.map(row => [
        { text: row.id, alignment: 'center' },
        row.produit,
        row.model,
        { text: row.fournisseur, color: 'red', alignment: 'center' },
        { text: parseFloat(row.qte_stock.toFixed(2)), alignment: 'center' },
        { text: parseFloat(row.qte_stock_entree.toFixed(2)), alignment: 'center' },
        { text: parseFloat(row.qte_stock_vendu.toFixed(2)), alignment: 'center' },
        { text: row.qte_stock_restant.toFixed(2).toString(), alignment: 'center', color: 'red' },
        { text: row.seuil.toString(), alignment: 'center', color: 'red' }
      ])
    ]

    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: `INVENTAIRE DU STOCK`,
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
            widths: ['auto', '*', 'auto', 'auto', '*', '*', '*', 'auto', '*'],
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

export default TemplateInventaireStockVente
