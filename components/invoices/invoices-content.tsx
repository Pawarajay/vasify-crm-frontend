"use client"

import { useMemo, useState } from "react"
import { useCRM } from "@/contexts/crm-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  IndianRupee,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react"
import { InvoiceDialog } from "./invoice-dialog"
import { InvoiceDetailDialog } from "./invoice-detail-dialog"
import type { Invoice } from "@/types/crm"

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatDate = (value: unknown) => {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(value as string)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "overdue":
      return <Clock className="h-4 w-4 text-red-500" />
    case "draft":
    case "sent":
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200"
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "sent":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const BACKEND_URL =
  // process.env.NEXT_PUBLIC_BACKEND_URL || "https://vasify-crm-backend-2.onrender.com"
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

// Helper function to convert logo URL to base64
const getLogoBase64 = async (): Promise<string> => {
  try {
    const response = await fetch("/vasify-logo.jpeg")
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error loading logo:", error)
    return ""
  }
}

export function InvoicesContent() {
  const { invoices, deleteInvoice } = useCRM()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const invoiceNumber = invoice.invoiceNumber?.toLowerCase?.() ?? ""
        const customerName = (invoice as any).customerName?.toLowerCase?.() ?? ""

        const matchesSearch =
          !normalizedSearch ||
          invoiceNumber.includes(normalizedSearch) ||
          customerName.includes(normalizedSearch)

        const matchesStatus =
          statusFilter === "all" || invoice.status === statusFilter

        return matchesSearch && matchesStatus
      }),
    [invoices, normalizedSearch, statusFilter],
  )

  const totals = useMemo(() => {
    const base = { total: 0, paid: 0, pending: 0, overdue: 0 }
    return filteredInvoices.reduce((acc, invoice) => {
      const amount =
        typeof invoice.amount === "number"
          ? invoice.amount
          : Number(invoice.amount ?? 0) || 0

      acc.total += amount
      if (invoice.status === "paid") acc.paid += amount
      if (invoice.status === "pending") acc.pending += amount
      if (invoice.status === "overdue") acc.overdue += amount
      return acc
    }, base)
  }, [filteredInvoices])

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDialogOpen(true)
  }

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      void deleteInvoice(id)
    }
  }

  const handleDownload = async (invoice: Invoice) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

      // Get logo as base64
      const logoBase64 = await getLogoBase64()

      // Send the logo data with the download request
      const res = await fetch(
        `${BACKEND_URL}/api/invoices/${invoice.id}/download`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logoBase64: logoBase64,
          }),
        },
      )

      if (!res.ok) {
        const text = await res.text()
        console.error("Failed to download invoice:", res.status, text)
        alert("Failed to download invoice. Please check console/server logs.")
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading invoice:", err)
      alert("Error downloading invoice. Please check console/server logs.")
    }
  }

  const handleSend = (invoice: Invoice) => {
    console.log("Send invoice", invoice.id)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">
            Manage your invoices and billing
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedInvoice(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totals.total)}
            </div>
            <p className="text-xs text-muted-foreground">All invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totals.paid)}
            </div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totals.pending)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totals.overdue)}
            </div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount (before tax)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const amount =
                  typeof invoice.amount === "number"
                    ? invoice.amount
                    : Number(invoice.amount ?? 0) || 0

                const customerName =
                  (invoice as any).customerName ?? "Unknown customer"

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(invoice.status)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(invoice)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(invoice)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSend(invoice)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send to Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <InvoiceDialog
        invoice={selectedInvoice}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onEditInvoice={handleEdit}
        onDownloadInvoice={handleDownload}
        onSendInvoice={handleSend}
      />
    </div>
  )
}

//31-12-2025
//testing 



// "use client"

// import { useMemo, useState } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Plus,
//   Search,
//   MoreHorizontal,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   Send,
//   IndianRupee,
//   CheckCircle,
//   Clock,
//   FileText,
//   ArrowUpRight,
//   Sparkles,
//   ReceiptIndianRupee,
// } from "lucide-react"
// import { InvoiceDialog } from "./invoice-dialog"
// import { InvoiceDetailDialog } from "./invoice-detail-dialog"
// import type { Invoice } from "@/types/crm"

// const formatCurrency = (value: number) =>
//   `₹${value.toLocaleString("en-IN", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   })}`

// const formatDate = (value: unknown) => {
//   if (!value) return "—"
//   const date = value instanceof Date ? value : new Date(value as string)
//   if (Number.isNaN(date.getTime())) return "—"
//   return date.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   })
// }

// const getStatusConfig = (status: string) => {
//   switch (status) {
//     case "paid":
//       return {
//         icon: <CheckCircle className="h-4 w-4" />,
//         color: "text-emerald-600 dark:text-emerald-400",
//         bg: "bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10",
//         glow: "group-hover:shadow-emerald-500/20",
//         badgeBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50",
//       }
//     case "pending":
//       return {
//         icon: <Clock className="h-4 w-4" />,
//         color: "text-amber-600 dark:text-amber-400",
//         bg: "bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10",
//         glow: "group-hover:shadow-amber-500/20",
//         badgeBg: "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50",
//       }
//     case "overdue":
//       return {
//         icon: <Clock className="h-4 w-4" />,
//         color: "text-rose-600 dark:text-rose-400",
//         bg: "bg-gradient-to-br from-rose-500/10 via-rose-400/5 to-pink-500/10",
//         glow: "group-hover:shadow-rose-500/20",
//         badgeBg: "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/50 dark:to-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50",
//       }
//     default:
//       return {
//         icon: <FileText className="h-4 w-4" />,
//         color: "text-slate-600 dark:text-slate-400",
//         bg: "bg-gradient-to-br from-slate-500/10 via-slate-400/5 to-gray-500/10",
//         glow: "group-hover:shadow-slate-500/20",
//         badgeBg: "bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50",
//       }
//   }
// }

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

// const getLogoBase64 = async (): Promise<string> => {
//   try {
//     const response = await fetch("/vasify-logo.jpeg")
//     const blob = await response.blob()
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result as string)
//       reader.onerror = reject
//       reader.readAsDataURL(blob)
//     })
//   } catch (error) {
//     console.error("Error loading logo:", error)
//     return ""
//   }
// }

// export function InvoicesContent() {
//   const { invoices, deleteInvoice } = useCRM()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

//   const normalizedSearch = searchTerm.trim().toLowerCase()

//   const filteredInvoices = useMemo(
//     () =>
//       invoices.filter((invoice) => {
//         const invoiceNumber = invoice.invoiceNumber?.toLowerCase?.() ?? ""
//         const customerName = (invoice as any).customerName?.toLowerCase?.() ?? ""

//         const matchesSearch =
//           !normalizedSearch ||
//           invoiceNumber.includes(normalizedSearch) ||
//           customerName.includes(normalizedSearch)

//         const matchesStatus =
//           statusFilter === "all" || invoice.status === statusFilter

//         return matchesSearch && matchesStatus
//       }),
//     [invoices, normalizedSearch, statusFilter],
//   )

//   const totals = useMemo(() => {
//     const base = { total: 0, paid: 0, pending: 0, overdue: 0 }
//     return filteredInvoices.reduce((acc, invoice) => {
//       const amount =
//         typeof invoice.total === "number"
//           ? invoice.total
//           : Number(invoice.total ?? 0) || 0

//       acc.total += amount
//       if (invoice.status === "paid") acc.paid += amount
//       if (invoice.status === "pending") acc.pending += amount
//       if (invoice.status === "overdue") acc.overdue += amount
//       return acc
//     }, base)
//   }, [filteredInvoices])

//   const handleEdit = (invoice: Invoice) => {
//     setSelectedInvoice(invoice)
//     setIsDialogOpen(true)
//   }

//   const handleView = (invoice: Invoice) => {
//     setSelectedInvoice(invoice)
//     setIsDetailDialogOpen(true)
//   }

//   const handleDelete = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this invoice?")) {
//       void deleteInvoice(id)
//     }
//   }

//   const handleDownload = async (invoice: Invoice) => {
//     try {
//       const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
//       const logoBase64 = await getLogoBase64()

//       const res = await fetch(`${BACKEND_URL}/api/invoices/${invoice.id}/download`, {
//         method: "POST",
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ logoBase64 }),
//       })

//       if (!res.ok) {
//         const text = await res.text()
//         console.error("Failed to download invoice:", res.status, text)
//         alert("Failed to download invoice.")
//         return
//       }

//       const blob = await res.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error("Error downloading invoice:", err)
//       alert("Error downloading invoice.")
//     }
//   }

//   const handleSend = (invoice: Invoice) => {
//     console.log("Send invoice", invoice.id)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       {/* Ambient background effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
//       </div>

//       <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-[1600px]">
//         {/* Premium Header */}
//         <div className="mb-8 sm:mb-10">
//           <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
//             <div className="space-y-3">
//               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50">
//                 <div className="relative">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                   <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
//                 </div>
//                 <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
//                   Invoice Billing
//                 </span>
//               </div>
//               <div>
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
//                   Invoices
//                 </h1>
//                 {/* <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
//                   Manage billing, track payments, and generate professional invoices
//                 </p> */}
//               </div>
//             </div>
//             <Button
//               onClick={() => {
//                 setSelectedInvoice(null)
//                 setIsDialogOpen(true)
//               }}
//               className="h-11 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create Invoice
//             </Button>
//           </div>
//         </div>

//         {/* Premium Stats Cards */}
//         <div className="flex items-center gap-2 mb-6">
//           <Sparkles className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             Billing Overview
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-10 sm:mb-12">
//           {/* Total Amount */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/50 dark:to-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <ReceiptIndianRupee className="h-7 w-7 text-amber-600 dark:text-amber-400" />
//                 </div>
//                 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
//                   <ArrowUpRight className="h-3.5 w-3.5" />
//                   <span>+8.2%</span>
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Total Amount
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
//                 {formatCurrency(totals.total)}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">All invoices</p>
//             </CardContent>
//           </Card>

//           {/* Paid */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-50/50 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Paid
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
//                 {formatCurrency(totals.paid)}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Completed payments</p>
//             </CardContent>
//           </Card>

//           {/* Pending */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/50 dark:to-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <Clock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Pending
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
//                 {formatCurrency(totals.pending)}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Awaiting payment</p>
//             </CardContent>
//           </Card>

//           {/* Overdue */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-rose-50/50 dark:to-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-400/5 to-pink-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <Clock className="h-7 w-7 text-rose-600 dark:text-rose-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Overdue
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
//                 {formatCurrency(totals.overdue)}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Past due date</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <div className="flex items-center gap-2 mb-6">
//           <Search className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             Search & Filter
//           </h2>
//         </div>

//         <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
//           <CardContent className="pt-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   placeholder="Search by invoice number or customer..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 bg-white dark:bg-slate-900"
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full sm:w-48">
//                   <SelectValue placeholder="All Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="draft">Draft</SelectItem>
//                   <SelectItem value="sent">Sent</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="paid">Paid</SelectItem>
//                   <SelectItem value="overdue">Overdue</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Invoices Table */}
//         <div className="flex items-center gap-2 mb-6 mt-8">
//           <FileText className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             All Invoices ({filteredInvoices.length})
//           </h2>
//         </div>

//         <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-b border-slate-200 dark:border-slate-800">
//                     <TableHead>Invoice #</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Issue Date</TableHead>
//                     <TableHead>Due Date</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredInvoices.map((invoice) => {
//                     const amount = typeof invoice.total === "number" ? invoice.total : Number(invoice.total ?? 0) || 0
//                     const customerName = (invoice as any).customerName ?? "Unknown customer"
//                     const statusConfig = getStatusConfig(invoice.status)

//                     return (
//                       <TableRow
//                         key={invoice.id}
//                         className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
//                       >
//                         <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
//                         <TableCell>{customerName}</TableCell>
//                         <TableCell className="font-semibold">{formatCurrency(amount)}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className={`flex items-center gap-1.5 w-fit ${statusConfig.badgeBg}`}>
//                             {statusConfig.icon}
//                             {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{formatDate(invoice.issueDate)}</TableCell>
//                         <TableCell>{formatDate(invoice.dueDate)}</TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="sm">
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem onClick={() => handleView(invoice)}>
//                                 <Eye className="h-4 w-4 mr-2" /> View
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleEdit(invoice)}>
//                                 <Edit className="h-4 w-4 mr-2" /> Edit
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleDownload(invoice)}>
//                                 <Download className="h-4 w-4 mr-2" /> Download PDF
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleSend(invoice)}>
//                                 <Send className="h-4 w-4 mr-2" /> Send
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="text-red-600">
//                                 <Trash2 className="h-4 w-4 mr-2" /> Delete
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Dialogs */}
//         <InvoiceDialog
//           invoice={selectedInvoice}
//           open={isDialogOpen}
//           onOpenChange={setIsDialogOpen}
//         />
//         <InvoiceDetailDialog
//           invoice={selectedInvoice}
//           open={isDetailDialogOpen}
//           onOpenChange={setIsDetailDialogOpen}
//           onEditInvoice={handleEdit}
//           onDownloadInvoice={handleDownload}
//           onSendInvoice={handleSend}
//         />
//       </div>
//     </div>
//   )
// }