"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
// Import the default export from "jspdf-autotable" for proper TS typing:
import autoTable from "jspdf-autotable"

type Payment = {
  date: Date
  amount: number
}

type Sale = {
  id: number
  customer: string
  dateOfPurchase: Date
  product: string
  quantity: number
  amount: number
  payments: Payment[]
  balance: number
}

type PDFExportProps = {
  customerName: string
  sales: Sale[]
}

export function PDFExport({ customerName, sales }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  // -------------------------------
  // 1) EXPORT AGENT PDF
  // -------------------------------
  const exportAgentPDF = () => {
    setIsExporting(true)

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(`Agent Sales Report for ${customerName}`, 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)

    // For Agent: Only "Customer" and "Balance"
    const tableColumn = ["Customer", "Balance"]
    const tableRows = sales.map((sale) => [
      sale.customer,
      `Rs. ${sale.balance.toFixed(2)}`,
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    })

    doc.save(`agent_sales_report_${customerName}.pdf`)
    setIsExporting(false)
  }

  // -------------------------------
  // 2) EXPORT USER PDF
  // -------------------------------
  const exportUserPDF = () => {
    setIsExporting(true)

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(`User Sales Report for ${customerName}`, 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)

    // For User: Include all details, now with "Customer" as well
    const tableColumn = [
      "Customer",
      "Date",
      "Product",
      "Quantity",
      "Amount",
      "Payments",
      "Balance",
    ]

    // Prepare rows
    const tableRows = sales.map((sale) => [
      sale.customer,
      sale.dateOfPurchase.toLocaleDateString(),
      sale.product,
      sale.quantity,
      `Rs. ${sale.amount.toFixed(2)}`,
      sale.payments.map((p) => `Rs. ${p.amount.toFixed(2)}`).join(", "),
      `Rs. ${sale.balance.toFixed(2)}`,
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    })

    doc.save(`user_sales_report_${customerName}.pdf`)
    setIsExporting(false)
  }

  return (
    <div className="flex gap-2">
      {/* Button for AGENT PDF */}
      <Button onClick={exportAgentPDF} disabled={isExporting}>
        {isExporting ? "Exporting..." : "Export Agent PDF"}
      </Button>

      {/* Button for USER PDF */}
      <Button onClick={exportUserPDF} disabled={isExporting}>
        {isExporting ? "Exporting..." : "Export User PDF"}
      </Button>
    </div>
  )
}
