"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InventoryPage() {
  const [inventory, setInventory] = useState([
    { id: 1, product: "Basic Detergent", sku: "DET001", quantity: 500, reorderLevel: 100 },
    { id: 2, product: "Premium Detergent", sku: "DET002", quantity: 300, reorderLevel: 75 },
    { id: 3, product: "Eco-Friendly Detergent", sku: "DET003", quantity: 200, reorderLevel: 50 },
  ])

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <Button>Add Stock</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter((item) => item.quantity <= item.reorderLevel).length}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>
                    {item.quantity <= item.reorderLevel ? (
                      <span className="text-red-500 font-semibold">Low Stock</span>
                    ) : (
                      <span className="text-green-500 font-semibold">In Stock</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

