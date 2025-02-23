"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// -------------- Zod schema --------------
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contactNo: z.string().optional(),
  address: z.string().optional(),
})

// 1) Type for the form fields
type CustomerFormValues = z.infer<typeof formSchema>

// 2) Extend with `id` which isn't in the form
type Customer = CustomerFormValues & {
  id: number
}

export default function CustomersPage() {
  // 3) Type the state as Customer[]
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "John Doe", contactNo: "1234567890", address: "123 Main St" },
    { id: 2, name: "Jane Smith", contactNo: "9876543210", address: "456 Elm St" },
  ])

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactNo: "",
      address: "",
    },
  })

  function onSubmit(values: CustomerFormValues) {
    // Check for duplicate entries based on the name (case-insensitive)
    const isDuplicate = customers.some(
      (customer) => customer.name.trim().toLowerCase() === values.name.trim().toLowerCase()
    )

    if (isDuplicate) {
      toast({
        title: "Duplicate entry",
        description: "A customer with this name already exists.",
        variant: "destructive",
      })
      return
    }

    setCustomers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...values,
      },
    ])

    toast({
      title: "Customer added",
      description: "New customer has been added successfully.",
    })

    form.reset()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Customers</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div>
          <h3 className="text-lg font-medium mb-4">Add New Customer</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact No (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Customer</Button>
            </form>
          </Form>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-lg font-medium mb-4">Customer List</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact No</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.contactNo || "—"}</TableCell>
                  <TableCell>{customer.address || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
