"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  date: z.date({
    required_error: "A date of sale is required.",
  }),
  product: z.string({
    required_error: "Please select a product.",
  }),
  quantity: z.number().positive("Quantity must be a positive number."),
  customerName: z.string().min(1, "Customer name is required."),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits."),
})

export default function SalesPage() {
  const [sales, setSales] = useState([
    {
      id: 1,
      date: "2023-06-01",
      product: "Basic Detergent",
      quantity: 100,
      total: 599,
      customerName: "John Doe",
      contactNumber: "1234567890",
      lastPurchaseDate: "2023-05-15",
    },
    {
      id: 2,
      date: "2023-06-02",
      product: "Premium Detergent",
      quantity: 50,
      total: 449.5,
      customerName: "Jane Smith",
      contactNumber: "9876543210",
      lastPurchaseDate: "2023-05-20",
    },
    {
      id: 3,
      date: "2023-06-03",
      product: "Eco-Friendly Detergent",
      quantity: 75,
      total: 599.25,
      customerName: "Alice Johnson",
      contactNumber: "5555555555",
      lastPurchaseDate: "2023-05-25",
    },
    {
      id: 4,
      date: "2023-06-04",
      product: "Basic Detergent",
      quantity: 120,
      total: 718.8,
      customerName: "Bob Brown",
      contactNumber: "1112223333",
      lastPurchaseDate: "2023-05-30",
    },
    {
      id: 5,
      date: "2023-06-05",
      product: "Premium Detergent",
      quantity: 60,
      total: 539.4,
      customerName: "Charlie Davis",
      contactNumber: "4444444444",
      lastPurchaseDate: "2023-06-01",
    },
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      customerName: "",
      contactNumber: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, you would calculate the total based on the product price
    const total = values.quantity * 5.99 // Assuming a fixed price for simplicity
    const newSale = {
      id: sales.length + 1,
      date: format(values.date, "yyyy-MM-dd"),
      product: values.product,
      quantity: values.quantity,
      total: total,
      customerName: values.customerName,
      contactNumber: values.contactNumber,
      lastPurchaseDate: format(new Date(), "yyyy-MM-dd"), // Set to today's date for a new sale
    }
    setSales([...sales, newSale])
    toast({
      title: "Sale recorded",
      description: "The new sale has been successfully added.",
    })
    form.reset()
  }

  const chartData = [
    { name: "Basic Detergent", sales: 1317.8 },
    { name: "Premium Detergent", sales: 988.9 },
    { name: "Eco-Friendly Detergent", sales: 599.25 },
  ]

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalUnits = sales.reduce((sum, sale) => sum + sale.quantity, 0)

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
          <Button>Generate Report</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnits}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Sale Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalSales / sales.length).toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enter New Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic Detergent">Basic Detergent</SelectItem>
                            <SelectItem value="Premium Detergent">Premium Detergent</SelectItem>
                            <SelectItem value="Eco-Friendly Detergent">Eco-Friendly Detergent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Record Sale</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.total.toFixed(2)}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.contactNumber}</TableCell>
                    <TableCell>{sale.lastPurchaseDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

