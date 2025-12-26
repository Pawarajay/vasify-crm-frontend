// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
//   import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useCRM } from "@/contexts/crm-context";

// interface RenewalDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   // full renewal when editing
//   renewal?: any | null;
//   // optional customerId when adding from a customer row
//   customerId?: string | null;
//   onSave: (renewalData: any) => void;
// }

// // month-safe addMonths: used for “next month” etc.
// const addMonths = (date: Date, months: number) => {
//   const d = new Date(date);
//   const day = d.getDate();
//   d.setMonth(d.getMonth() + months);
//   if (d.getDate() < day) {
//     d.setDate(0);
//   }
//   return d;
// };

// export function RenewalDialog({
//   isOpen,
//   onClose,
//   renewal,
//   customerId,
//   onSave,
// }: RenewalDialogProps) {
//   const { customers } = useCRM();

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
//   });

//   useEffect(() => {
//     const today = new Date();
//     const todayStr = today.toISOString().split("T")[0];

//     if (renewal) {
//       const base =
//         renewal.baseDate ??
//         renewal.createdAt ??
//         renewal.startDate ??
//         renewal.expiryDate ??
//         todayStr;

//       const interval =
//         renewal.intervalMonths?.toString() ??
//         renewal.interval_months?.toString() ??
//         "1";

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
//       });
//     } else {
//       // NEW: if opened for a specific customer, preselect and apply defaults
//       const targetCustomer = customerId
//         ? customers.find((c) => c.id === customerId)
//         : undefined;

//       const defaultInterval = "1";
//       const baseDate = todayStr;
//       const expiry = addMonths(today, Number(defaultInterval || "1"))
//         .toISOString()
//         .split("T")[0];

//       let initial = {
//         customerId: customerId ?? "",
//         service: "",
//         amount: "",
//         expiryDate: expiry,
//         status: "active",
//         reminderDays: "30",
//         notes: "",
//         intervalMonths: defaultInterval,
//         baseDate,
//       };

//       if (targetCustomer) {
//         // mimic handleCustomerChange logic for initial state
//         const tmp = { ...initial };
//         const c: any = targetCustomer;

//         if (c.recurringEnabled) {
//           if (c.recurringService) tmp.service = c.recurringService;
//           if (c.recurringAmount != null)
//             tmp.amount = String(c.recurringAmount);
//           if (c.recurringInterval === "monthly") tmp.intervalMonths = "1";
//           else if (c.recurringInterval === "yearly") tmp.intervalMonths = "12";

//           if (c.nextRenewalDate) {
//             const baseDateVal =
//               c.nextRenewalDate instanceof Date
//                 ? c.nextRenewalDate
//                 : new Date(c.nextRenewalDate as any);
//             if (!Number.isNaN(baseDateVal.getTime())) {
//               tmp.baseDate = baseDateVal.toISOString().split("T")[0];
//             }
//           }
//         }

//         if (c.defaultRenewalStatus) tmp.status = c.defaultRenewalStatus;
//         if (c.defaultRenewalReminderDays != null)
//           tmp.reminderDays = String(c.defaultRenewalReminderDays);
//         if (c.defaultRenewalNotes) tmp.notes = c.defaultRenewalNotes;

//         const baseD = new Date(tmp.baseDate || todayStr);
//         if (!Number.isNaN(baseD.getTime())) {
//           const next = addMonths(baseD, Number(tmp.intervalMonths || "1"));
//           tmp.expiryDate = next.toISOString().split("T")[0];
//         }

//         initial = tmp;
//       }

//       setFormData(initial);
//     }
//   }, [renewal, customerId, customers]);

//   const recalcExpiryFromRecurring = (
//     baseDateStr: string,
//     intervalStr: string,
//   ) => {
//     if (!baseDateStr || !intervalStr) return;
//     const base = new Date(baseDateStr);
//     if (Number.isNaN(base.getTime())) return;
//     const months = Number(intervalStr) || 0;
//     if (months <= 0) return;
//     const next = addMonths(base, months);
//     setFormData((prev) => ({
//       ...prev,
//       expiryDate: next.toISOString().split("T")[0],
//     }));
//   };

//   // When customer changes, apply that customer's recurring defaults
//   // const handleCustomerChange = (id: string) => {
//   //   const customer = customers.find((c) => c.id === id);

//   //   setFormData((prev) => {
//   //     let nextService = prev.service;
//   //     let nextAmount = prev.amount;
//   //     let nextInterval = prev.intervalMonths;
//   //     let nextStatus = prev.status;
//   //     let nextReminderDays = prev.reminderDays;
//   //     let nextNotes = prev.notes;
//   //     let nextBaseDate = prev.baseDate;

//   //     const today = new Date();
//   //     const todayStr = today.toISOString().split("T")[0];

//   //     if (customer && (customer as any).recurringEnabled) {
//   //       const c: any = customer;

//   //       if (c.recurringService && !prev.service.trim()) {
//   //         nextService = c.recurringService;
//   //       }

//   //       if (
//   //         c.recurringAmount !== undefined &&
//   //         c.recurringAmount !== null &&
//   //         !prev.amount
//   //       ) {
//   //         nextAmount = String(c.recurringAmount);
//   //       }

//   //       if (c.recurringInterval === "monthly") {
//   //         nextInterval = "1";
//   //       } else if (c.recurringInterval === "yearly") {
//   //         nextInterval = "12";
//   //       }

//   //       if (c.nextRenewalDate) {
//   //         const base =
//   //           c.nextRenewalDate instanceof Date
//   //             ? c.nextRenewalDate
//   //             : new Date(c.nextRenewalDate as any);
//   //         if (!Number.isNaN(base.getTime())) {
//   //           nextBaseDate = base.toISOString().split("T")[0];
//   //         } else {
//   //           nextBaseDate = prev.baseDate || todayStr;
//   //         }
//   //       } else {
//   //         nextBaseDate = prev.baseDate || todayStr;
//   //       }
//   //     }

//   //     if (customer && (customer as any).defaultRenewalStatus && prev.status === "active") {
//   //       nextStatus = (customer as any).defaultRenewalStatus;
//   //     }

//   //     if (
//   //       customer &&
//   //       (customer as any).defaultRenewalReminderDays &&
//   //       !prev.reminderDays
//   //     ) {
//   //       nextReminderDays = String(
//   //         (customer as any).defaultRenewalReminderDays,
//   //       );
//   //     }

//   //     if (customer && (customer as any).defaultRenewalNotes && !prev.notes.trim()) {
//   //       nextNotes = (customer as any).defaultRenewalNotes;
//   //     }

   
//   //     const updated = {
//   //       ...prev,
//   //       customerId: id,
//   //       service: nextService,
//   //       amount: nextAmount,
//   //       intervalMonths: nextInterval,
//   //       status: nextStatus,
//   //       reminderDays: nextReminderDays,
//   //       notes: nextNotes,
//   //       baseDate: nextBaseDate,
//   //     };

//   //     recalcExpiryFromRecurring(updated.baseDate, updated.intervalMonths);

//   //     return updated;
//   //   });
//   // };


//    const handleCustomerChange = (id: string) => {
//     const customer = customers.find((c) => c.id === id);

//     setFormData((prev) => {
//       let nextService = prev.service;
//       let nextAmount = prev.amount;
//       let nextInterval = prev.intervalMonths;
//       let nextStatus = prev.status;
//       let nextReminderDays = prev.reminderDays;
//       let nextNotes = prev.notes;
//       let nextBaseDate = prev.baseDate;

//       const today = new Date();
//       const todayStr = today.toISOString().split("T")[0];

//       if (customer) {
//         const c: any = customer;

//         // NEW: Use customer's createdAt as baseDate for expiry calculation
//         if (c.createdAt) {
//           const createdDate =
//             c.createdAt instanceof Date
//               ? c.createdAt
//               : new Date(c.createdAt);
//           if (!Number.isNaN(createdDate.getTime())) {
//             nextBaseDate = createdDate.toISOString().split("T")[0];
//           }
//         } else {
//           nextBaseDate = todayStr;
//         }

//         if (c.recurringEnabled) {
//           if (c.recurringService && !prev.service.trim()) {
//             nextService = c.recurringService;
//           }

//           if (
//             c.recurringAmount !== undefined &&
//             c.recurringAmount !== null &&
//             !prev.amount
//           ) {
//             nextAmount = String(c.recurringAmount);
//           }

//           if (c.recurringInterval === "monthly") {
//             nextInterval = "1";
//           } else if (c.recurringInterval === "quarterly") {
//             nextInterval = "3";
//           } else if (c.recurringInterval === "half-yearly") {
//             nextInterval = "6";
//           } else if (c.recurringInterval === "yearly") {
//             nextInterval = "12";
//           }
//         }

//         if (c.defaultRenewalStatus && prev.status === "active") {
//           nextStatus = c.defaultRenewalStatus;
//         }

//         if (c.defaultRenewalReminderDays && !prev.reminderDays) {
//           nextReminderDays = String(c.defaultRenewalReminderDays);
//         }

//         if (c.defaultRenewalNotes && !prev.notes.trim()) {
//           nextNotes = c.defaultRenewalNotes;
//         }
//       }

//       const updated = {
//         ...prev,
//         customerId: id,
//         service: nextService,
//         amount: nextAmount,
//         intervalMonths: nextInterval,
//         status: nextStatus,
//         reminderDays: nextReminderDays,
//         notes: nextNotes,
//         baseDate: nextBaseDate,
//       };

//       recalcExpiryFromRecurring(updated.baseDate, updated.intervalMonths);

//       return updated;
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const amountNumber = Number.parseFloat(formData.amount);
//     const reminderDaysNumber =
//       Number.parseInt(formData.reminderDays, 10) || 0;
//     const intervalMonthsNumber =
//       Number.parseInt(formData.intervalMonths, 10) || 0;

//     const payload = {
//       customerId: formData.customerId || customerId,
//       service: formData.service.trim(),
//       amount: Number.isNaN(amountNumber) ? 0 : amountNumber,
//       expiryDate: formData.expiryDate,
//       status: formData.status,
//       reminderDays: reminderDaysNumber > 0 ? reminderDaysNumber : 30,
//       notes: formData.notes.trim(),
//       intervalMonths: intervalMonthsNumber || 1,
//       baseDate: formData.baseDate || formData.expiryDate,
//     };

//     onSave(payload);
//   };

//   const customerSelectDisabled = Boolean(customerId) && !renewal;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {renewal ? "Edit Renewal" : "Add New Renewal"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Customer */}
//           <div>
//             <Label htmlFor="customerId">Customer</Label>
//             <Select
//               value={formData.customerId}
//               onValueChange={handleCustomerChange}
//               disabled={customerSelectDisabled}
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
//                 setFormData((prev) => ({
//                   ...prev,
//                   service: e.target.value,
//                 }))
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
//                   setFormData((prev) => ({
//                     ...prev,
//                     amount: e.target.value,
//                   }))
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
//                   setFormData((prev) => ({
//                     ...prev,
//                     expiryDate: e.target.value,
//                   }))
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
//                   const value = e.target.value;
//                   setFormData((prev) => ({ ...prev, baseDate: value }));
//                   recalcExpiryFromRecurring(value, formData.intervalMonths);
//                 }}
//               />
//             </div>
//             <div>
//               <Label htmlFor="intervalMonths">Recurring Interval</Label>
//               <Select
//                 value={formData.intervalMonths}
//                 onValueChange={(value) => {
//                   setFormData((prev) => ({
//                     ...prev,
//                     intervalMonths: value,
//                   }));
//                   recalcExpiryFromRecurring(formData.baseDate, value);
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
//                   setFormData((prev) => ({
//                     ...prev,
//                     reminderDays: value,
//                   }))
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
//                 setFormData((prev) => ({
//                   ...prev,
//                   notes: e.target.value,
//                 }))
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
//             <Button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {renewal ? "Update" : "Create"} Renewal
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }




//testing (23-12-2025)

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCRM } from "@/contexts/crm-context";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";

interface RenewalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  renewal?: any | null;
  customerId?: string | null;
  onSave: (renewalData: any) => void;
}

// Add months utility (handles month-end dates properly)
const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) {
    d.setDate(0);
  }
  return d;
};

// Calculate status based on expiry date
const calculateStatus = (expiryDateStr: string): string => {
  if (!expiryDateStr) return "active";
  
  const expiry = new Date(expiryDateStr);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return "expired";
  } else if (daysUntilExpiry <= 30) {
    return "expiring";
  } else {
    return "active";
  }
};

export function RenewalDialog({
  isOpen,
  onClose,
  renewal,
  customerId,
  onSave,
}: RenewalDialogProps) {
  const { customers } = useCRM();

  const [formData, setFormData] = useState({
    customerId: "",
    service: "",
    amount: "",
    expiryDate: "",
    status: "active",
    reminderDays: "30",
    notes: "",
    intervalMonths: "1",
    baseDate: "",
  });

  const [autoCalculatedStatus, setAutoCalculatedStatus] = useState("");

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (renewal) {
      // EDITING existing renewal
      const base =
        renewal.baseDate ??
        renewal.createdAt ??
        renewal.startDate ??
        todayStr;

      const interval =
        renewal.intervalMonths?.toString() ??
        renewal.interval_months?.toString() ??
        "1";

      const expiryStr = 
        renewal.expiryDate instanceof Date
          ? renewal.expiryDate.toISOString().split("T")[0]
          : renewal.expiryDate ?? "";

      setFormData({
        customerId: renewal.customerId,
        service: renewal.service,
        amount: renewal.amount?.toString() ?? "",
        expiryDate: expiryStr,
        status: renewal.status,
        reminderDays: renewal.reminderDays?.toString() || "30",
        notes: renewal.notes || "",
        intervalMonths: interval,
        baseDate:
          base instanceof Date ? base.toISOString().split("T")[0] : String(base),
      });

      // Calculate auto status
      if (expiryStr) {
        setAutoCalculatedStatus(calculateStatus(expiryStr));
      }
    } else {
      // NEW renewal
      const targetCustomer = customerId
        ? customers.find((c) => c.id === customerId)
        : undefined;

      const defaultInterval = "1";
      let baseDate = todayStr;
      
      // Use customer's creation date as base date
      if (targetCustomer?.createdAt) {
        const createdDate = targetCustomer.createdAt instanceof Date
          ? targetCustomer.createdAt
          : new Date(targetCustomer.createdAt as any);
        
        if (!Number.isNaN(createdDate.getTime())) {
          baseDate = createdDate.toISOString().split("T")[0];
        }
      }

      // Calculate expiry: baseDate + intervalMonths
      const expiry = addMonths(new Date(baseDate), Number(defaultInterval || "1"))
        .toISOString()
        .split("T")[0];

      let initial = {
        customerId: customerId ?? "",
        service: "",
        amount: "",
        expiryDate: expiry,
        status: "active",
        reminderDays: "30",
        notes: "",
        intervalMonths: defaultInterval,
        baseDate,
      };

      if (targetCustomer) {
        const c: any = targetCustomer;

        // Get service and amount from customer's recurring settings
        if (c.recurringEnabled) {
          if (c.recurringService) initial.service = c.recurringService;
          if (c.recurringAmount != null) initial.amount = String(c.recurringAmount);
          
          // Map recurring interval to months
          if (c.recurringInterval === "monthly") initial.intervalMonths = "1";
          else if (c.recurringInterval === "quarterly") initial.intervalMonths = "3";
          else if (c.recurringInterval === "half-yearly") initial.intervalMonths = "6";
          else if (c.recurringInterval === "yearly") initial.intervalMonths = "12";
        }

        // Apply customer's renewal defaults
        if (c.defaultRenewalReminderDays != null) {
          initial.reminderDays = String(c.defaultRenewalReminderDays);
        }
        if (c.defaultRenewalNotes) initial.notes = c.defaultRenewalNotes;

        // Recalculate expiry based on customer's base date and interval
        const baseD = new Date(initial.baseDate);
        if (!Number.isNaN(baseD.getTime())) {
          const next = addMonths(baseD, Number(initial.intervalMonths || "1"));
          initial.expiryDate = next.toISOString().split("T")[0];
        }
      }

      setFormData(initial);

      // Calculate auto status
      if (initial.expiryDate) {
        setAutoCalculatedStatus(calculateStatus(initial.expiryDate));
      }
    }
  }, [renewal, customerId, customers, isOpen]);

  // Recalculate expiry when base date or interval changes
  const recalcExpiryFromRecurring = (baseDateStr: string, intervalStr: string) => {
    if (!baseDateStr || !intervalStr) return;
    const base = new Date(baseDateStr);
    if (Number.isNaN(base.getTime())) return;
    const months = Number(intervalStr) || 0;
    if (months <= 0) return;
    const next = addMonths(base, months);
    const newExpiry = next.toISOString().split("T")[0];
    
    setFormData((prev) => ({
      ...prev,
      expiryDate: newExpiry,
    }));

    // Auto-calculate status
    setAutoCalculatedStatus(calculateStatus(newExpiry));
  };

  const handleCustomerChange = (id: string) => {
    const customer = customers.find((c) => c.id === id);

    setFormData((prev) => {
      let nextService = prev.service;
      let nextAmount = prev.amount;
      let nextInterval = prev.intervalMonths;
      let nextReminderDays = prev.reminderDays;
      let nextNotes = prev.notes;
      let nextBaseDate = prev.baseDate;

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      if (customer) {
        const c: any = customer;

        // Use customer's createdAt as baseDate for expiry calculation
        if (c.createdAt) {
          const createdDate =
            c.createdAt instanceof Date
              ? c.createdAt
              : new Date(c.createdAt);
          if (!Number.isNaN(createdDate.getTime())) {
            nextBaseDate = createdDate.toISOString().split("T")[0];
          }
        } else {
          nextBaseDate = todayStr;
        }

        if (c.recurringEnabled) {
          if (c.recurringService && !prev.service.trim()) {
            nextService = c.recurringService;
          }

          if (
            c.recurringAmount !== undefined &&
            c.recurringAmount !== null &&
            !prev.amount
          ) {
            nextAmount = String(c.recurringAmount);
          }

          if (c.recurringInterval === "monthly") {
            nextInterval = "1";
          } else if (c.recurringInterval === "quarterly") {
            nextInterval = "3";
          } else if (c.recurringInterval === "half-yearly") {
            nextInterval = "6";
          } else if (c.recurringInterval === "yearly") {
            nextInterval = "12";
          }
        }

        if (c.defaultRenewalReminderDays && !prev.reminderDays) {
          nextReminderDays = String(c.defaultRenewalReminderDays);
        }

        if (c.defaultRenewalNotes && !prev.notes.trim()) {
          nextNotes = c.defaultRenewalNotes;
        }
      }

      const updated = {
        ...prev,
        customerId: id,
        service: nextService,
        amount: nextAmount,
        intervalMonths: nextInterval,
        reminderDays: nextReminderDays,
        notes: nextNotes,
        baseDate: nextBaseDate,
      };

      // Recalculate expiry
      setTimeout(() => {
        recalcExpiryFromRecurring(updated.baseDate, updated.intervalMonths);
      }, 0);

      return updated;
    });
  };

  // Update status when expiry date changes manually
  const handleExpiryDateChange = (newExpiry: string) => {
    setFormData((prev) => ({ ...prev, expiryDate: newExpiry }));
    setAutoCalculatedStatus(calculateStatus(newExpiry));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNumber = Number.parseFloat(formData.amount);
    const reminderDaysNumber = Number.parseInt(formData.reminderDays, 10) || 0;
    const intervalMonthsNumber = Number.parseInt(formData.intervalMonths, 10) || 0;

    // Use auto-calculated status if user hasn't changed it manually
    const finalStatus = formData.status === "active" && autoCalculatedStatus 
      ? autoCalculatedStatus 
      : formData.status;

    const payload = {
      customerId: formData.customerId || customerId,
      service: formData.service.trim(),
      amount: Number.isNaN(amountNumber) ? 0 : amountNumber,
      expiryDate: formData.expiryDate,
      status: finalStatus,
      reminderDays: reminderDaysNumber > 0 ? reminderDaysNumber : 30,
      notes: formData.notes.trim(),
      intervalMonths: intervalMonthsNumber || 1,
      baseDate: formData.baseDate || formData.expiryDate,
    };

    onSave(payload);
  };

  const customerSelectDisabled = Boolean(customerId) && !renewal;

  // Get days until expiry for display
  const getDaysUntilExpiry = () => {
    if (!formData.expiryDate) return null;
    const expiry = new Date(formData.expiryDate);
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {renewal ? "Edit Renewal" : "Add New Renewal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer */}
          <div>
            <Label htmlFor="customerId">Customer *</Label>
            <Select
              value={formData.customerId}
              onValueChange={handleCustomerChange}
              disabled={customerSelectDisabled}
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
            <Label htmlFor="service">Service *</Label>
            <Input
              id="service"
              value={formData.service}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  service: e.target.value,
                }))
              }
              placeholder="e.g., WhatsApp Business API - Monthly Plan"
              required
            />
          </div>

          {/* Amount + Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleExpiryDateChange(e.target.value)}
                required
              />
              {daysUntilExpiry !== null && (
                <p className="text-xs mt-1 text-muted-foreground">
                  {daysUntilExpiry > 0 ? (
                    <span className={daysUntilExpiry <= 30 ? "text-yellow-600" : "text-green-600"}>
                      {daysUntilExpiry} days remaining
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Expired {Math.abs(daysUntilExpiry)} days ago
                    </span>
                  )}
                </p>
              )}
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
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, baseDate: value }));
                  recalcExpiryFromRecurring(value, formData.intervalMonths);
                }}
              />
              <p className="text-xs mt-1 text-muted-foreground">
                Auto-filled from customer creation date
              </p>
            </div>
            <div>
              <Label htmlFor="intervalMonths">Recurring Interval</Label>
              <Select
                value={formData.intervalMonths}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    intervalMonths: value,
                  }));
                  recalcExpiryFromRecurring(formData.baseDate, value);
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

          {/* Status + Auto-calculated indicator */}
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
              {autoCalculatedStatus && autoCalculatedStatus !== formData.status && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-blue-500" />
                  <p className="text-xs text-blue-600">
                    Auto-suggested: <Badge variant="outline" className="text-xs">{autoCalculatedStatus}</Badge>
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="reminderDays">Reminder Days</Label>
              <Select
                value={formData.reminderDays}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    reminderDays: value,
                  }))
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

          {/* Info Card */}
          {formData.baseDate && formData.expiryDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Renewal Timeline:</strong></p>
                  <p>Started: {new Date(formData.baseDate).toLocaleDateString()}</p>
                  <p>Expires: {new Date(formData.expiryDate).toLocaleDateString()}</p>
                  <p>Interval: {formData.intervalMonths} month(s)</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
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
  );
}