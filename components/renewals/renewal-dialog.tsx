// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { useCRM } from "@/contexts/crm-context"

// interface RenewalDialogProps {
//   isOpen: boolean
//   onClose: () => void
//   renewal?: any
//   onSave: (renewalData: any) => void
// }

// // month-safe addMonths: used for “next month” etc.
// const addMonths = (date: Date, months: number) => {
//   const d = new Date(date)
//   const day = d.getDate()
//   d.setMonth(d.getMonth() + months)
//   if (d.getDate() < day) {
//     d.setDate(0)
//   }
//   return d
// }

// export function RenewalDialog({
//   isOpen,
//   onClose,
//   renewal,
//   onSave,
// }: RenewalDialogProps) {
//   const { customers } = useCRM()

//   const [formData, setFormData] = useState({
//     customerId: "",
//     service: "",
//     amount: "",
//     // expiryDate is derived from baseDate + intervalMonths but still editable
//     expiryDate: "",
//     status: "active",
//     reminderDays: "30",
//     notes: "",
//     // recurring controls
//     intervalMonths: "1", // 1 = monthly, 3 = quarterly, 12 = yearly, etc.
//     baseDate: "", // created/start date from which to calculate next expiry
//   })

//   useEffect(() => {
//     const today = new Date()
//     const todayStr = today.toISOString().split("T")[0]

//     if (renewal) {
//       const base =
//         renewal.baseDate ??
//         renewal.createdAt ??
//         renewal.startDate ??
//         renewal.expiryDate ??
//         todayStr

//       const interval =
//         renewal.intervalMonths?.toString() ??
//         renewal.interval_months?.toString() ??
//         "1"

//       setFormData({
//         customerId: renewal.customerId,
//         service: renewal.service,
//         amount: renewal.amount?.toString() ?? "",
//         expiryDate:
//           renewal.expiryDate instanceof Date
//             ? renewal.expiryDate.toISOString().split("T")[0]
//             : renewal.expiryDate ?? "",
//         status: renewal.status,
//         reminderDays: renewal.reminderDays?.toString() || "30",
//         notes: renewal.notes || "",
//         intervalMonths: interval,
//         baseDate:
//           base instanceof Date ? base.toISOString().split("T")[0] : String(base),
//       })
//     } else {
//       const defaultInterval = "1"
//       const baseDate = todayStr
//       const expiry = addMonths(today, Number(defaultInterval || "1"))
//         .toISOString()
//         .split("T")[0]

//       setFormData({
//         customerId: "",
//         service: "",
//         amount: "",
//         expiryDate: expiry,
//         status: "active",
//         reminderDays: "30",
//         notes: "",
//         intervalMonths: defaultInterval,
//         baseDate,
//       })
//     }
//   }, [renewal])

//   const recalcExpiryFromRecurring = (
//     baseDateStr: string,
//     intervalStr: string,
//   ) => {
//     if (!baseDateStr || !intervalStr) return
//     const base = new Date(baseDateStr)
//     if (Number.isNaN(base.getTime())) return
//     const months = Number(intervalStr) || 0
//     if (months <= 0) return
//     const next = addMonths(base, months)
//     setFormData((prev) => ({
//       ...prev,
//       expiryDate: next.toISOString().split("T")[0],
//     }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     const amountNumber = Number.parseFloat(formData.amount)
//     const reminderDaysNumber = Number.parseInt(formData.reminderDays, 10) || 0
//     const intervalMonthsNumber = Number.parseInt(formData.intervalMonths, 10) || 0

//     const payload = {
//       customerId: formData.customerId,
//       service: formData.service.trim(),
//       amount: Number.isNaN(amountNumber) ? 0 : amountNumber,
//       expiryDate: formData.expiryDate,
//       status: formData.status,
//       reminderDays: reminderDaysNumber > 0 ? reminderDaysNumber : 30,
//       notes: formData.notes.trim(),
//       intervalMonths: intervalMonthsNumber || 1,
//       baseDate: formData.baseDate || formData.expiryDate,
//     }

//     onSave(payload)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>{renewal ? "Edit Renewal" : "Add New Renewal"}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Customer */}
//           <div>
//             <Label htmlFor="customerId">Customer</Label>
//             <Select
//               value={formData.customerId}
//               onValueChange={(value) =>
//                 setFormData((prev) => ({ ...prev, customerId: value }))
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select customer" />
//               </SelectTrigger>
//               <SelectContent>
//                 {customers.map((customer) => (
//                   <SelectItem key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Service */}
//           <div>
//             <Label htmlFor="service">Service</Label>
//             <Input
//               id="service"
//               value={formData.service}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, service: e.target.value }))
//               }
//               placeholder="e.g., WhatsApp Reseller Panel"
//               required
//             />
//           </div>

//           {/* Amount + Expiry */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="amount">Amount (₹)</Label>
//               <Input
//                 id="amount"
//                 type="number"
//                 step="0.01"
//                 value={formData.amount}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, amount: e.target.value }))
//                 }
//                 placeholder="0.00"
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="expiryDate">Expiry Date</Label>
//               <Input
//                 id="expiryDate"
//                 type="date"
//                 value={formData.expiryDate}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
//                 }
//                 required
//               />
//             </div>
//           </div>

//           {/* Recurring parameters */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="baseDate">Start / Created Date</Label>
//               <Input
//                 id="baseDate"
//                 type="date"
//                 value={formData.baseDate}
//                 onChange={(e) => {
//                   const value = e.target.value
//                   setFormData((prev) => ({ ...prev, baseDate: value }))
//                   recalcExpiryFromRecurring(value, formData.intervalMonths)
//                 }}
//               />
//             </div>
//             <div>
//               <Label htmlFor="intervalMonths">Recurring Interval</Label>
//               <Select
//                 value={formData.intervalMonths}
//                 onValueChange={(value) => {
//                   setFormData((prev) => ({ ...prev, intervalMonths: value }))
//                   recalcExpiryFromRecurring(formData.baseDate, value)
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select interval" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="1">Monthly (1 month)</SelectItem>
//                   <SelectItem value="3">Quarterly (3 months)</SelectItem>
//                   <SelectItem value="6">Half-yearly (6 months)</SelectItem>
//                   <SelectItem value="12">Yearly (12 months)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Status + Reminder */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="status">Status</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, status: value }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="expiring">Expiring</SelectItem>
//                   <SelectItem value="expired">Expired</SelectItem>
//                   <SelectItem value="renewed">Renewed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="reminderDays">Reminder Days</Label>
//               <Select
//                 value={formData.reminderDays}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, reminderDays: value }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="7">7 days</SelectItem>
//                   <SelectItem value="15">15 days</SelectItem>
//                   <SelectItem value="30">30 days</SelectItem>
//                   <SelectItem value="60">60 days</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Notes */}
//           <div>
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, notes: e.target.value }))
//               }
//               placeholder="Additional notes..."
//               rows={3}
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//               {renewal ? "Update" : "Create"} Renewal
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
// testing



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCRM } from "@/contexts/crm-context"

interface RenewalDialogProps {
  isOpen: boolean
  onClose: () => void
  renewal?: any
  onSave: (renewalData: any) => void
}

// month-safe addMonths: used for “next month” etc.
const addMonths = (date: Date, months: number) => {
  const d = new Date(date)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  if (d.getDate() < day) {
    d.setDate(0)
  }
  return d
}

export function RenewalDialog({
  isOpen,
  onClose,
  renewal,
  onSave,
}: RenewalDialogProps) {
  const { customers } = useCRM()

  const [formData, setFormData] = useState({
    customerId: "",
    service: "",
    amount: "",
    // expiryDate is derived from baseDate + intervalMonths but still editable
    expiryDate: "",
    status: "active",
    reminderDays: "30",
    notes: "",
    // recurring controls
    intervalMonths: "1", // 1 = monthly, 3 = quarterly, 12 = yearly, etc.
    baseDate: "", // created/start date from which to calculate next expiry
  })

  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    if (renewal) {
      const base =
        renewal.baseDate ??
        renewal.createdAt ??
        renewal.startDate ??
        renewal.expiryDate ??
        todayStr

      const interval =
        renewal.intervalMonths?.toString() ??
        renewal.interval_months?.toString() ??
        "1"

      setFormData({
        customerId: renewal.customerId,
        service: renewal.service,
        amount: renewal.amount?.toString() ?? "",
        expiryDate:
          renewal.expiryDate instanceof Date
            ? renewal.expiryDate.toISOString().split("T")[0]
            : renewal.expiryDate ?? "",
        status: renewal.status,
        reminderDays: renewal.reminderDays?.toString() || "30",
        notes: renewal.notes || "",
        intervalMonths: interval,
        baseDate:
          base instanceof Date ? base.toISOString().split("T")[0] : String(base),
      })
    } else {
      const defaultInterval = "1"
      const baseDate = todayStr
      const expiry = addMonths(today, Number(defaultInterval || "1"))
        .toISOString()
        .split("T")[0]

      setFormData({
        customerId: "",
        service: "",
        amount: "",
        expiryDate: expiry,
        status: "active",
        reminderDays: "30",
        notes: "",
        intervalMonths: defaultInterval,
        baseDate,
      })
    }
  }, [renewal])

  const recalcExpiryFromRecurring = (
    baseDateStr: string,
    intervalStr: string,
  ) => {
    if (!baseDateStr || !intervalStr) return
    const base = new Date(baseDateStr)
    if (Number.isNaN(base.getTime())) return
    const months = Number(intervalStr) || 0
    if (months <= 0) return
    const next = addMonths(base, months)
    setFormData((prev) => ({
      ...prev,
      expiryDate: next.toISOString().split("T")[0],
    }))
  }

  // When customer changes, apply that customer's recurring defaults
  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)

    setFormData((prev) => {
      let nextService = prev.service
      let nextAmount = prev.amount
      let nextInterval = prev.intervalMonths
      let nextStatus = prev.status
      let nextReminderDays = prev.reminderDays
      let nextNotes = prev.notes
      let nextBaseDate = prev.baseDate

      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]

      if (customer?.recurringEnabled) {
        // service from customer
        if (customer.recurringService && !prev.service.trim()) {
          nextService = customer.recurringService
        }

        // amount from customer
        if (
          customer.recurringAmount !== undefined &&
          customer.recurringAmount !== null &&
          !prev.amount
        ) {
          nextAmount = String(customer.recurringAmount)
        }

        // interval: map monthly/yearly to months
        if (customer.recurringInterval === "monthly") {
          nextInterval = "1"
        } else if (customer.recurringInterval === "yearly") {
          nextInterval = "12"
        }

        // base date: use nextRenewalDate or today
        if (customer.nextRenewalDate) {
          const base =
            customer.nextRenewalDate instanceof Date
              ? customer.nextRenewalDate
              : new Date(customer.nextRenewalDate as any)
          if (!Number.isNaN(base.getTime())) {
            nextBaseDate = base.toISOString().split("T")[0]
          } else {
            nextBaseDate = prev.baseDate || todayStr
          }
        } else {
          nextBaseDate = prev.baseDate || todayStr
        }
      }

      // default renewal status
      if (customer?.defaultRenewalStatus && prev.status === "active") {
        nextStatus = customer.defaultRenewalStatus
      }

      // default reminder days
      if (
        customer?.defaultRenewalReminderDays &&
        !prev.reminderDays
      ) {
        nextReminderDays = String(customer.defaultRenewalReminderDays)
      }

      // default renewal notes
      if (customer?.defaultRenewalNotes && !prev.notes.trim()) {
        nextNotes = customer.defaultRenewalNotes
      }

      const updated = {
        ...prev,
        customerId,
        service: nextService,
        amount: nextAmount,
        intervalMonths: nextInterval,
        status: nextStatus,
        reminderDays: nextReminderDays,
        notes: nextNotes,
        baseDate: nextBaseDate,
      }

      // recalc expiry from updated base/interval
      recalcExpiryFromRecurring(updated.baseDate, updated.intervalMonths)

      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amountNumber = Number.parseFloat(formData.amount)
    const reminderDaysNumber = Number.parseInt(formData.reminderDays, 10) || 0
    const intervalMonthsNumber = Number.parseInt(formData.intervalMonths, 10) || 0

    const payload = {
      customerId: formData.customerId,
      service: formData.service.trim(),
      amount: Number.isNaN(amountNumber) ? 0 : amountNumber,
      expiryDate: formData.expiryDate,
      status: formData.status,
      reminderDays: reminderDaysNumber > 0 ? reminderDaysNumber : 30,
      notes: formData.notes.trim(),
      intervalMonths: intervalMonthsNumber || 1,
      baseDate: formData.baseDate || formData.expiryDate,
    }

    onSave(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{renewal ? "Edit Renewal" : "Add New Renewal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer */}
          <div>
            <Label htmlFor="customerId">Customer</Label>
            <Select
              value={formData.customerId}
              onValueChange={handleCustomerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div>
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              value={formData.service}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, service: e.target.value }))
              }
              placeholder="e.g., WhatsApp Reseller Panel"
              required
            />
          </div>

          {/* Amount + Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Recurring parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseDate">Start / Created Date</Label>
              <Input
                id="baseDate"
                type="date"
                value={formData.baseDate}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData((prev) => ({ ...prev, baseDate: value }))
                  recalcExpiryFromRecurring(value, formData.intervalMonths)
                }}
              />
            </div>
            <div>
              <Label htmlFor="intervalMonths">Recurring Interval</Label>
              <Select
                value={formData.intervalMonths}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, intervalMonths: value }))
                  recalcExpiryFromRecurring(formData.baseDate, value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monthly (1 month)</SelectItem>
                  <SelectItem value="3">Quarterly (3 months)</SelectItem>
                  <SelectItem value="6">Half-yearly (6 months)</SelectItem>
                  <SelectItem value="12">Yearly (12 months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status + Reminder */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="renewed">Renewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reminderDays">Reminder Days</Label>
              <Select
                value={formData.reminderDays}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, reminderDays: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {renewal ? "Update" : "Create"} Renewal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
