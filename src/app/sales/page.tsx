"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

// Hooks & utils
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Import the PDF export component
import { PDFExport } from "@/components/pdf-export"

// ----------- Zod Schemas -----------
const formSchema = z.object({
  customer: z.string().min(1, "Customer is required."),
  dateOfPurchase: z.date({
    required_error: "Date of purchase is required.",
  }),
  product: z.string().min(1, "Product is required."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
  amount: z.number().min(0, "Amount must be a non-negative number."),
  dateOfPayment: z.date().optional(),
  paymentAmount: z
    .number()
    .min(0, "Payment amount must be a non-negative number.")
    .optional(),
})

const paymentFormSchema = z.object({
  saleId: z.number(),
  dateOfPayment: z.date({
    required_error: "Date of payment is required.",
  }),
  paymentAmount: z.number().min(0, "Payment amount must be a non-negative number."),
})

// ----------- Type for Full Sales Record -----------
type Sale = z.infer<typeof formSchema> & {
  id: number
  payments: Array<{ date: Date; amount: number }>
  balance: number
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      customer: "Customer 1",
      dateOfPurchase: new Date("2023-06-01"),
      product: "Product A",
      quantity: 10,
      amount: 1000,
      payments: [{ date: new Date("2023-06-01"), amount: 500 }],
      balance: 500,
    },
    {
      id: 2,
      customer: "Customer 2",
      dateOfPurchase: new Date("2023-06-15"),
      product: "Product B",
      quantity: 5,
      amount: 750,
      payments: [{ date: new Date("2023-06-15"), amount: 750 }],
      balance: 0,
    },
    {
      id: 3,
      customer: "Customer 3",
      dateOfPurchase: new Date("2023-07-01"),
      product: "Product C",
      quantity: 8,
      amount: 1200,
      payments: [{ date: new Date("2023-07-01"), amount: 600 }],
      balance: 600,
    },
  ])

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [customerFilter, setCustomerFilter] = useState("")

  // ----- Main "Record Sale" Form -----
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      dateOfPurchase: new Date(),
      product: "",
      quantity: 1,
      amount: 0,
      paymentAmount: 0,
    },
  })

  // ----- "Additional Payment" Form -----
  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      saleId: 0,
      dateOfPayment: new Date(),
      paymentAmount: 0,
    },
  })

  // ----- Submit New Sale -----
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSale: Sale = {
      id: sales.length + 1,
      ...values,
      payments: [
        // Only add payment if user specified
        { date: values.dateOfPayment || new Date(), amount: values.paymentAmount || 0 },
      ].filter((payment) => payment.date && payment.amount),
      balance: values.amount - (values.paymentAmount || 0),
    }
    setSales((prev) => [...prev, newSale])
    toast({
      title: "Sale recorded",
      description: "New sale has been recorded successfully.",
    })
    form.reset()
  }

  // ----- Submit Additional Payment -----
  function onPaymentSubmit(values: z.infer<typeof paymentFormSchema>) {
    setSales(
      sales.map((sale) => {
        if (sale.id === values.saleId) {
          const newPayments = [
            ...sale.payments,
            { date: values.dateOfPayment, amount: values.paymentAmount },
          ]
          const totalPaid = newPayments.reduce((sum, payment) => sum + payment.amount, 0)
          return {
            ...sale,
            payments: newPayments,
            balance: sale.amount - totalPaid,
          }
        }
        return sale
      })
    )
    toast({
      title: "Payment recorded",
      description: "New payment has been recorded successfully.",
    })
    paymentForm.reset()
  }

  // ----- Filtered Sales for Table -----
  const filteredSales = sales.filter((sale) => {
    const dateInRange =
      (!dateRange?.from || sale.dateOfPurchase >= dateRange.from) &&
      (!dateRange?.to || sale.dateOfPurchase <= dateRange.to)
    const customerMatch =
      !customerFilter ||
      sale.customer.toLowerCase().includes(customerFilter.toLowerCase())
    return dateInRange && customerMatch
  })

  // ------------------ RENDER ------------------
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Sales & Collection</h2>

      {/* ----- Card: Record Sale ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Record Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Customer Field */}
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Customer 1">Customer 1</SelectItem>
                        <SelectItem value="Customer 2">Customer 2</SelectItem>
                        <SelectItem value="Customer 3">Customer 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Purchase */}
              <FormField
                control={form.control}
                name="dateOfPurchase"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Purchase</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Field */}
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
                        <SelectItem value="Product A">Product A</SelectItem>
                        <SelectItem value="Product B">Product B</SelectItem>
                        <SelectItem value="Product C">Product C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Payment Date */}
              <FormField
                control={form.control}
                name="dateOfPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Payment (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Payment Amount */}
              <FormField
                control={form.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Sale */}
              <Button type="submit">Record Sale</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ----- Card: Sales History ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {/* Filter by Date Range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Filter by Date Range</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filter by Customer */}
            <div>
              <h4 className="text-sm font-medium mb-2">Filter by Customer</h4>
              <Input
                placeholder="Enter customer name"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              />
            </div>

            {/* Export (two PDF buttons: Agent & User) */}
            <div>
              <h4 className="text-sm font-medium mb-2">Export Customer Data</h4>
              {/* Pass in the current customerName filter and filtered sales */}
              <PDFExport customerName={customerFilter} sales={filteredSales} />
            </div>
          </div>

          {/* Sales Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date of Purchase</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payments</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{format(sale.dateOfPurchase, "PPP")}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>₹{sale.amount}</TableCell>
                  <TableCell>
                    {sale.payments.map((payment, index) => (
                      <div key={index}>
                        {format(payment.date, "PPP")}: ₹{payment.amount}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>₹{sale.balance}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        paymentForm.setValue("saleId", sale.id)
                        paymentForm.setValue("paymentAmount", sale.balance)
                      }}
                    >
                      Add Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ----- Card: Record Additional Payment ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Record Additional Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...paymentForm}>
            <form
              onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
              className="space-y-4"
            >
              <FormField
                control={paymentForm.control}
                name="saleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale ID</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="dateOfPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Payment</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Record Payment</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
