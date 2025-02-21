"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([
    { id: 1, date: "2023-06-01", supplier: "Supplier A", product: "Raw Material X", quantity: 1000, total: 5000 },
    { id: 2, date: "2023-06-02", supplier: "Supplier B", product: "Raw Material Y", quantity: 500, total: 2500 },
    { id: 3, date: "2023-06-03", supplier: "Supplier C", product: "Packaging Material", quantity: 10000, total: 1000 },
    { id: 4, date: "2023-06-04", supplier: "Supplier A", product: "Raw Material Z", quantity: 750, total: 3750 },
    { id: 5, date: "2023-06-05", supplier: "Supplier D", product: "Chemical Additive", quantity: 100, total: 1000 },
  ])

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0)
  const totalItems = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0)

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Purchases Dashboard</h2>
          <Button>New Purchase Order</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPurchases.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Purchase Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalPurchases / purchases.length).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(purchases.map((p) => p.supplier)).size}</div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.product}</TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>${purchase.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

