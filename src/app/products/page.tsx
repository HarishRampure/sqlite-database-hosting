"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const formSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  sku: z.string().min(1, "SKU is required."),
  price: z.number().positive("Price must be a positive number."),
})

type Product = z.infer<typeof formSchema>

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { name: "Basic Detergent", sku: "DET001", price: 5.99 },
    { name: "Premium Detergent", sku: "DET002", price: 8.99 },
    { name: "Eco-Friendly Detergent", sku: "DET003", price: 7.99 },
  ])

  const form = useForm<Product>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
    },
  })

  function onSubmit(values: Product) {
    setProducts([...products, values])
    toast({
      title: "Product added",
      description: `${values.name} has been added to the product list.`,
    })
    form.reset()
  }

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Product</Button>
              </form>
            </Form>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Product List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.sku}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

