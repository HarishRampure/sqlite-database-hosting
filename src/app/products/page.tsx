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
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  inStock: z.number().min(0, {
    message: "In stock must be a non-negative number.",
  }),
})

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", inStock: 100 },
    { id: 2, name: "Product B", inStock: 50 },
    { id: 3, name: "Product C", inStock: 10 },
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      inStock: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setProducts([...products, { id: products.length + 1, ...values }])
    toast({
      title: "Product added",
      description: "New product has been added successfully.",
    })
    form.reset()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium mb-4">Add New Product</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>In Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
        <div>
          <h3 className="text-lg font-medium mb-4">Product List</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.inStock}</TableCell>
                  <TableCell>
                    {product.inStock > 20 ? <Badge>In Stock</Badge> : <Badge variant="destructive">Low Stock</Badge>}
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

