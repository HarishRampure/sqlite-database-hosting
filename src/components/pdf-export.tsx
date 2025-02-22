"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
// Import the default export from "jspdf-autotable" for proper TS typing:
import autoTable from "jspdf-autotable"

type Sale = {
  id: number
  customer: string
  dateOfPurchase: Date
  product: string
  quantity: number
  amount: number
  payments: { date: Date; amount: number }[]
  balance: number
}

type PDFExportProps = {
  customerName: string
  sales: Sale[]
}

export function PDFExport({ customerName, sales }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPDF = () => {
    setIsExporting(true)

    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text(`Sales Report for ${customerName}`, 14, 22)

    doc.setFontSize(11)
    doc.setTextColor(100)

    const tableColumn = [
      "Date",
      "Product",
      "Quantity",
      "Amount",
      "Payments",
      "Balance",
    ]

    // Prepare rows
    const tableRows = sales.map((sale) => [
      // Ensure the date is displayed as a string
      sale.dateOfPurchase.toLocaleDateString(),
      sale.product,
      sale.quantity,
      `₹${sale.amount.toFixed(2)}`,
      sale.payments.map((p) => `₹${p.amount.toFixed(2)}`).join(", "),
      `₹${sale.balance.toFixed(2)}`,
    ])

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    })

    // Save the PDF
    doc.save(`${customerName}_sales_report.pdf`)

    setIsExporting(false)
  }

  return (
    <Button onClick={exportToPDF} disabled={isExporting}>
      {isExporting ? "Exporting..." : "Export to PDF"}
    </Button>
  )
}
