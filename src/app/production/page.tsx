"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DateRange } from "react-day-picker"
import * as XLSX from "xlsx"

// ----- Zod Schema -----
const formSchema = z.object({
  dateOfManufacturing: z.date({
    required_error: "A date of manufacturing is required.",
  }),
  batchNo: z.string().min(1, "Batch number is required."),
  rawMaterials: z.array(
    z.object({
      name: z.string().min(1, "Material name is required."),
      quantity: z.number().min(0, "Quantity must be a non-negative number."),
      pricePerUnit: z.number().min(0, "Price must be a non-negative number."),
    })
  ),
})

export default function ProductionFlowPage() {
  const [productions, setProductions] = useState<
    Array<
      z.infer<typeof formSchema> & {
        id: number
        totalQuantity: number
        totalRawMaterialCost: number
        pricePerUnit: number
      }
    >
  >([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // ----- React Hook Form Setup -----
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfManufacturing: new Date(),
      batchNo: "",
      rawMaterials: [{ name: "", quantity: 0, pricePerUnit: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "rawMaterials",
    control: form.control,
  })

  // ----- Submission Handler -----
  function onSubmit(values: z.infer<typeof formSchema>) {
    const totalQuantity = values.rawMaterials.reduce(
      (sum, material) => sum + material.quantity,
      0
    )
    const totalRawMaterialCost = values.rawMaterials.reduce(
      (sum, material) => sum + material.quantity * material.pricePerUnit,
      0
    )
    const pricePerUnit = totalQuantity > 0 ? totalRawMaterialCost / totalQuantity : 0

    const newProduction = {
      id: productions.length + 1,
      ...values,
      totalQuantity,
      totalRawMaterialCost,
      pricePerUnit,
    }

    setProductions((prev) => [...prev, newProduction])
    toast({
      title: "Production recorded",
      description: "New production flow has been recorded successfully.",
    })
    form.reset()
  }

  // ----- Filtered Productions by Date Range -----
  const filteredProductions = productions.filter((production) => {
    // If there's no 'from' date selected, show everything
    if (!dateRange?.from) {
      return true
    }
    // If only 'from' is set (no 'to'), filter from that date forward
    if (dateRange.from && !dateRange.to) {
      return production.dateOfManufacturing >= dateRange.from
    }
    // If both 'from' and 'to' are set, filter within that range
    return (
      production.dateOfManufacturing >= dateRange.from &&
      production.dateOfManufacturing <= (dateRange.to || dateRange.from)
    )
  })

  // ----- Export to Excel -----
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProductions.map((p) => ({
        Date: format(p.dateOfManufacturing, "PPP"),
        "Batch No": p.batchNo,
        "Raw Materials": p.rawMaterials
          .map((m) => `${m.name} (${m.quantity} kg/L)`)
          .join(", "),
        "Total Quantity (kg/L)": p.totalQuantity,
        "Total Raw Material Cost (₹)": p.totalRawMaterialCost,
        "Price Per Unit (₹/kg or ₹/L)": p.pricePerUnit,
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production Data")
    XLSX.writeFile(workbook, "production_data.xlsx")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Production Flow</h2>

      {/* ----- Record Production ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Record Production</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Date of Manufacturing */}
              <FormField
                control={form.control}
                name="dateOfManufacturing"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Manufacturing</FormLabel>
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
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
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

              {/* Batch No */}
              <FormField
                control={form.control}
                name="batchNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch No</FormLabel>
                    <FormControl>
                      <Input placeholder="B001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Raw Materials */}
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`rawMaterials.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Raw Material A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rawMaterials.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (Kgs/Ltrs)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name={`rawMaterials.${index}.pricePerUnit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per unit (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove Material
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ name: "", quantity: 0, pricePerUnit: 0 })
                }
              >
                Add Material
              </Button>

              <Button type="submit">Record Production</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ----- Production Records ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Production Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            {/* Date Range Filter */}
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

            <div>
              <Button onClick={exportToExcel}>Export to Excel</Button>
            </div>
          </div>

          {/* Records Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Batch No</TableHead>
                <TableHead>Raw Materials</TableHead>
                <TableHead>Total Quantity</TableHead>
                <TableHead>Total Raw Material Cost</TableHead>
                <TableHead>Price Per Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductions.map((production) => (
                <TableRow key={production.id}>
                  <TableCell>
                    {format(production.dateOfManufacturing, "PPP")}
                  </TableCell>
                  <TableCell>{production.batchNo}</TableCell>
                  <TableCell>
                    {production.rawMaterials.map((material, index) => (
                      <div key={index}>
                        {material.name}: {material.quantity} kg/L @ ₹
                        {material.pricePerUnit}/unit
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {production.totalQuantity.toFixed(2)} Kgs/Ltrs
                  </TableCell>
                  <TableCell>
                    ₹{production.totalRawMaterialCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ₹{production.pricePerUnit.toFixed(2)}/kg or L
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
