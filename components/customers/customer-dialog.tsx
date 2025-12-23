// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { X } from "lucide-react"
// import type { Customer } from "@/types/crm"

// interface CustomerDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   customer: Customer | null
//   mode: "add" | "edit"
// }

// type CustomerFormState = {
//   name: string
//   email: string
//   phone: string
//   company: string
//   address: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   status: Customer["status"]
//   source: string
//   notes: string
//   whatsappNumber: string
//   totalValue: string

//   // service & pricing
//   serviceType: "" | "whatsapp_api" | "website_dev" | "ai_agent"
//   onboarding: boolean
//   platformFees: boolean
//   recharge: boolean
//   development: boolean
//   supportMaintenance: boolean
//   hosting: boolean
//   oneTimeCharges: boolean
//   monthlyRecurring: boolean
//   oneTimePrice: string
//   monthlyPrice: string
//   rechargePrice: string   // NEW

//   // invoice defaults
//   defaultTaxRate: string
//   defaultDueDays: string
//   defaultInvoiceNotes: string

//   // recurring
//   recurringEnabled: boolean
//   recurringInterval: "monthly" | "yearly"
//   recurringAmount: string
//   recurringService: string

//   // renewal defaults
//   defaultRenewalStatus: "active" | "expiring" | "expired" | "renewed"
//   defaultRenewalReminderDays: string
//   defaultRenewalNotes: string
//   nextRenewalDate: string
// }

// const DEFAULT_FORM: CustomerFormState = {
//   name: "",
//   email: "",
//   phone: "",
//   company: "",
//   address: "",
//   city: "",
//   state: "",
//   zipCode: "",
//   country: "India",
//   status: "prospect",
//   source: "",
//   notes: "",
//   whatsappNumber: "",
//   totalValue: "0",

//   serviceType: "",
//   onboarding: false,
//   platformFees: false,
//   recharge: false,
//   development: false,
//   supportMaintenance: false,
//   hosting: false,
//   oneTimeCharges: false,
//   monthlyRecurring: false,
//   oneTimePrice: "0",
//   monthlyPrice: "0",
//   rechargePrice: "0",

//   defaultTaxRate: "",
//   defaultDueDays: "",
//   defaultInvoiceNotes: "",

//   recurringEnabled: false,
//   recurringInterval: "monthly",
//   recurringAmount: "",
//   recurringService: "",

//   defaultRenewalStatus: "active",
//   defaultRenewalReminderDays: "",
//   defaultRenewalNotes: "",
//   nextRenewalDate: "",
// }

// export function CustomerDialog({
//   open,
//   onOpenChange,
//   customer,
//   mode,
// }: CustomerDialogProps) {
//   const { addCustomer, updateCustomer } = useCRM()
//   const [formData, setFormData] = useState<CustomerFormState>(DEFAULT_FORM)
//   const [tags, setTags] = useState<string[]>([])
//   const [newTag, setNewTag] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const toNumber = (v: string) => {
//     const n = Number(v || 0)
//     return Number.isNaN(n) ? 0 : n
//   }

//   // auto-calc total value based on pricing inputs
//   useEffect(() => {
//     if (!formData.serviceType) return
//     const oneTime = toNumber(formData.oneTimePrice)
//     const monthly = toNumber(formData.monthlyPrice)
//     const rechargeVal = toNumber(formData.rechargePrice)
//     const total = oneTime + monthly + rechargeVal
//     setFormData((prev) => ({
//       ...prev,
//       totalValue: String(total),
//     }))
//   }, [formData.serviceType, formData.oneTimePrice, formData.monthlyPrice, formData.rechargePrice])

//   // populate form when editing
//   useEffect(() => {
//     if (customer && mode === "edit") {
//       setFormData({
//         ...DEFAULT_FORM,
//         name: customer.name ?? "",
//         email: customer.email ?? "",
//         phone: customer.phone ?? "",
//         company: customer.company ?? "",
//         address: customer.address ?? "",
//         city: customer.city ?? "",
//         state: customer.state ?? "",
//         zipCode: customer.zipCode ?? "",
//         country: customer.country ?? "India",
//         status: customer.status ?? "prospect",
//         source: customer.source ?? "",
//         notes: customer.notes ?? "",
//         whatsappNumber: customer.whatsappNumber ?? "",
//         totalValue:
//           typeof customer.totalValue === "number"
//             ? String(customer.totalValue)
//             : (customer.totalValue as any) ?? "0",

//         // defaults
//         defaultTaxRate:
//           customer.defaultTaxRate != null
//             ? String(customer.defaultTaxRate)
//             : "",
//         defaultDueDays:
//           customer.defaultDueDays != null
//             ? String(customer.defaultDueDays)
//             : "",
//         defaultInvoiceNotes: customer.defaultInvoiceNotes ?? "",

//         recurringEnabled: !!customer.recurringEnabled,
//         recurringInterval: customer.recurringInterval ?? "monthly",
//         recurringAmount:
//           customer.recurringAmount != null
//             ? String(customer.recurringAmount)
//             : "",
//         recurringService: customer.recurringService ?? "",

//         defaultRenewalStatus: customer.defaultRenewalStatus ?? "active",
//         defaultRenewalReminderDays:
//           customer.defaultRenewalReminderDays != null
//             ? String(customer.defaultRenewalReminderDays)
//             : "",
//         defaultRenewalNotes: customer.defaultRenewalNotes ?? "",
//         nextRenewalDate:
//           customer.nextRenewalDate instanceof Date
//             ? customer.nextRenewalDate.toISOString().split("T")[0]
//             : (customer.nextRenewalDate as string) || "",
//       })
//       setTags(Array.isArray(customer.tags) ? customer.tags : [])
//     } else {
//       setFormData(DEFAULT_FORM)
//       setTags([])
//     }
//     setNewTag("")
//     setError(null)
//   }, [customer, mode, open])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!formData.name.trim()) return setError("Name is required.")
//     if (!formData.email.trim()) return setError("Email is required.")
//     if (!formData.phone.trim()) return setError("Phone is required.")

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       return setError("Enter a valid email address.")
//     }

//     const totalValueNumber = Number(formData.totalValue || 0)
//     if (Number.isNaN(totalValueNumber) || totalValueNumber < 0) {
//       return setError("Total value must be a valid non-negative number.")
//     }

//     // Build service details string based on selections
//     let serviceDetails = ""
//     if (formData.serviceType) {
//       const serviceName =
//         formData.serviceType === "whatsapp_api"
//           ? "WhatsApp Business API"
//           : formData.serviceType === "website_dev"
//           ? "Website Development"
//           : "AI Agent"

//       const selectedItems: string[] = []
//       if (formData.serviceType === "whatsapp_api") {
//         if (formData.onboarding) selectedItems.push("Onboarding")
//         if (formData.platformFees) selectedItems.push("Platform Fees")
//         if (formData.recharge) selectedItems.push("Recharge")
//       } else {
//         if (formData.development) selectedItems.push("Development")
//         if (formData.supportMaintenance)
//           selectedItems.push("Support & Maintenance")
//         if (formData.hosting) selectedItems.push("Hosting")
//       }

//       const chargeTypes: string[] = []
//       if (formData.oneTimeCharges) chargeTypes.push("One-time charges")
//       if (formData.monthlyRecurring) chargeTypes.push("Monthly recurring")

//       serviceDetails = `\n\nService: ${serviceName}
// Selected: ${selectedItems.join(", ") || "None"}
// Charge Types: ${chargeTypes.join(", ") || "None"}
// One-time: ₹${formData.oneTimePrice}
// Monthly: ₹${formData.monthlyPrice}
// Recharge: ₹${formData.rechargePrice}`
//     }

//     // parse numeric defaults
//     const defaultTaxRate = formData.defaultTaxRate
//       ? Number(formData.defaultTaxRate)
//       : undefined
//     const defaultDueDays = formData.defaultDueDays
//       ? Number(formData.defaultDueDays)
//       : undefined
//     const recurringAmount = formData.recurringAmount
//       ? Number(formData.recurringAmount)
//       : undefined
//     const defaultRenewalReminderDays = formData.defaultRenewalReminderDays
//       ? Number(formData.defaultRenewalReminderDays)
//       : undefined

//     const customerData: Omit<Customer, "id"> = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       company: formData.company,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       zipCode: formData.zipCode,
//       country: formData.country,
//       status: formData.status,
//       source: formData.source,
//       assignedTo: customer?.assignedTo ?? "",
//       notes: formData.notes + serviceDetails,
//       whatsappNumber: formData.whatsappNumber,
//       totalValue: totalValueNumber,
//       tags,
//       lastContactDate: customer?.lastContactDate,

//       defaultTaxRate,
//       defaultDueDays,
//       defaultInvoiceNotes: formData.defaultInvoiceNotes || undefined,
//       recurringEnabled: formData.recurringEnabled,
//       recurringInterval: formData.recurringInterval,
//       recurringAmount,
//       recurringService: formData.recurringService || undefined,
//       defaultRenewalStatus: formData.defaultRenewalStatus,
//       defaultRenewalReminderDays,
//       defaultRenewalNotes: formData.defaultRenewalNotes || undefined,
//       nextRenewalDate: formData.nextRenewalDate || undefined,

//       createdAt: customer?.createdAt ?? new Date(),
//       updatedAt: new Date(),
//     }

//     setIsSubmitting(true)
//     try {
//       const success =
//         mode === "add"
//           ? await addCustomer(customerData as any)
//           : customer
//           ? await updateCustomer(customer.id, customerData as any)
//           : false

//       if (success) {
//         onOpenChange(false)
//         setFormData(DEFAULT_FORM)
//         setTags([])
//         setNewTag("")
//       } else {
//         setError("Failed to save customer. Try again.")
//       }
//     } catch (err: any) {
//       setError(err?.message ?? "Failed to save customer.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const addTagHandler = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags([...tags, newTag.trim()])
//     }
//     setNewTag("")
//   }

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove))
//   }

//   const handleServiceChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
//     const newValue = e.target.value as "" | "whatsapp_api" | "website_dev" | "ai_agent"

//     // prevent service change in edit mode
//     if (mode === "edit" && formData.serviceType && newValue !== formData.serviceType) {
//       alert("Change the service from lead page")
//       return
//     }

//     // set defaults for checkboxes when selecting service (auto checked)
//     if (newValue === "") {
//       setFormData({
//         ...formData,
//         serviceType: "",
//         onboarding: false,
//         platformFees: false,
//         recharge: false,
//         development: false,
//         supportMaintenance: false,
//         hosting: false,
//         oneTimeCharges: false,
//         monthlyRecurring: false,
//       })
//       return
//     }

//     if (newValue === "whatsapp_api") {
//       setFormData({
//         ...formData,
//         serviceType: newValue,
//         onboarding: true,
//         platformFees: true,
//         recharge: true,
//         development: false,
//         supportMaintenance: false,
//         hosting: false,
//         oneTimeCharges: true,
//         monthlyRecurring: true,
//       })
//     } else {
//       setFormData({
//         ...formData,
//         serviceType: newValue,
//         onboarding: false,
//         platformFees: false,
//         recharge: false,
//         development: true,
//         supportMaintenance: true,
//         hosting: true,
//         oneTimeCharges: true,
//         monthlyRecurring: true,
//       })
//     }
//   }

//   const renderServiceFields = () => {
//     if (!formData.serviceType) return null

//     if (formData.serviceType === "whatsapp_api") {
//       return (
//         <div className="grid grid-cols-3 gap-4 border rounded-md p-3">
//           <div className="space-y-2">
//             <Label className="font-semibold">WhatsApp Business API</Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="onboarding"
//                   checked={formData.onboarding}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, onboarding: checked as boolean })
//                   }
//                 />
//                 <label
//                   htmlFor="onboarding"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Onboarding
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="platformFees"
//                   checked={formData.platformFees}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       platformFees: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="platformFees"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Platform Fees
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="recharge"
//                   checked={formData.recharge}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, recharge: checked as boolean })
//                   }
//                 />
//                 <label
//                   htmlFor="recharge"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Recharge
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Charge Type section removed as per requirement */}

//           <div className="space-y-2">
//             <Label className="font-semibold">Pricing Summary</Label>
//             <div className="space-y-2">
//               <div>
//                 <Label>One-time (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.oneTimePrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       oneTimePrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Monthly (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.monthlyPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monthlyPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Recharge (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.rechargePrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       rechargePrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="border rounded-md p-2 text-sm bg-muted">
//                 <div className="font-semibold">
//                   Total: ₹{toNumber(formData.totalValue)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }

//     // Website Development & AI Agent
//     return (
//       <div className="grid grid-cols-3 gap-4 border rounded-md p-3">
//         <div className="space-y-2">
//           <Label className="font-semibold">
//             {formData.serviceType === "website_dev"
//               ? "Website Development"
//               : "AI Agent"}
//           </Label>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="development"
//                 checked={formData.development}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     development: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="development"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Development
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="supportMaintenance"
//                 checked={formData.supportMaintenance}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     supportMaintenance: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="supportMaintenance"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Support & Maintenance
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="hosting"
//                 checked={formData.hosting}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     hosting: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="hosting"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Hosting
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Charge Type section removed here as well */}

//         <div className="space-y-2">
//           <Label className="font-semibold">Pricing Summary</Label>
//           <div className="space-y-2">
//             <div>
//               <Label>One-time (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.oneTimePrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     oneTimePrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label>Monthly (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.monthlyPrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     monthlyPrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label>Recharge (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.rechargePrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     rechargePrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="border rounded-md p-2 text-sm bg-muted">
//               <div className="font-semibold">
//                 Total: ₹{toNumber(formData.totalValue)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "add" ? "Add New Customer" : "Edit Customer"}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === "add"
//               ? "Add a new customer to your CRM system."
//               : "Update customer information and defaults."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone *</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
//               <Input
//                 id="whatsappNumber"
//                 type="tel"
//                 value={formData.whatsappNumber}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     whatsappNumber: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Company + Total Value */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 value={formData.company}
//                 onChange={(e) =>
//                   setFormData({ ...formData, company: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="totalValue">Total Value (₹)</Label>
//               <Input
//                 id="totalValue"
//                 type="number"
//                 value={formData.totalValue}
//                 onChange={(e) =>
//                   setFormData({ ...formData, totalValue: e.target.value })
//                 }
//                 min="0"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) =>
//                 setFormData({ ...formData, city: e.target.value })
//               }
//               placeholder="City"
//             />
//             <Input
//               id="state"
//               value={formData.state}
//               onChange={(e) =>
//                 setFormData({ ...formData, state: e.target.value })
//               }
//               placeholder="State"
//             />
//             <Input
//               id="zipCode"
//               value={formData.zipCode}
//               onChange={(e) =>
//                 setFormData({ ...formData, zipCode: e.target.value })
//               }
//               placeholder="ZIP"
//             />
//           </div>

//           {/* Status & Source */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <select
//                 className="border rounded px-3 py-2 text-sm w-full"
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     status: e.target.value as Customer["status"],
//                   })
//                 }
//               >
//                 <option value="prospect">Prospect</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="source">Source</Label>
//               <Input
//                 id="source"
//                 value={formData.source}
//                 onChange={(e) =>
//                   setFormData({ ...formData, source: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Invoice Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Invoice Defaults</p>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-1">
//                 <Label>Default Tax Rate (%)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultTaxRate}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultTaxRate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Due Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultDueDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultDueDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Invoice Notes</Label>
//                 <Input
//                   value={formData.defaultInvoiceNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultInvoiceNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recurring / Subscription */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Recurring / Subscription</p>
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="recurringEnabled"
//                 checked={formData.recurringEnabled}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     recurringEnabled: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="recurringEnabled"
//                 className="text-sm font-medium cursor-pointer"
//               >
//                 Enable recurring billing
//               </label>
//             </div>

//             {formData.recurringEnabled && (
//               <div className="grid grid-cols-3 gap-4 mt-2">
//                 <div className="space-y-1">
//                   <Label>Interval</Label>
//                   <select
//                     className="border rounded px-3 py-2 text-sm w-full"
//                     value={formData.recurringInterval}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringInterval: e.target.value as "monthly" | "yearly",
//                       })
//                     }
//                   >
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.recurringAmount}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringAmount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Service Name</Label>
//                   <Input
//                     value={formData.recurringService}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringService: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Renewal Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Renewal Defaults</p>
//             <div className="grid grid-cols-4 gap-4">
//               <div className="space-y-1">
//                 <Label>Status</Label>
//                 <select
//                   className="border rounded px-3 py-2 text-sm w-full"
//                   value={formData.defaultRenewalStatus}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalStatus: e.target
//                         .value as CustomerFormState["defaultRenewalStatus"],
//                     })
//                   }
//                 >
//                   <option value="active">Active</option>
//                   <option value="expiring">Expiring</option>
//                   <option value="expired">Expired</option>
//                   <option value="renewed">Renewed</option>
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <Label>Reminder Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultRenewalReminderDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalReminderDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1 col-span-2">
//                 <Label>Renewal Notes</Label>
//                 <Input
//                   value={formData.defaultRenewalNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             {/* Next Renewal Date input removed as per requirement */}
//           </div>

//           {/* Service selection + dynamic pricing blocks */}
//           <div className="space-y-2">
//             <Label>Service</Label>
//             <select
//               className="border rounded px-3 py-2 text-sm w-full"
//               value={formData.serviceType}
//               onChange={handleServiceChange}
//             >
//               <option value="">Select service</option>
//               <option value="whatsapp_api">WhatsApp Business API</option>
//               <option value="website_dev">Website Development</option>
//               <option value="ai_agent">AI Agent</option>
//             </select>
//           </div>

//           {renderServiceFields()}

//           {/* Tags */}
//           <div className="space-y-2">
//             <Label>Tags</Label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant="secondary"
//                   className="flex items-center gap-1"
//                 >
//                   {tag}
//                   <X
//                     className="h-3 w-3 cursor-pointer"
//                     onClick={() => removeTag(tag)}
//                   />
//                 </Badge>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input
//                 value={newTag}
//                 onChange={(e) => setNewTag(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={addTagHandler}
//               >
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-destructive border border-destructive/30 rounded p-2">
//               {error}
//             </p>
//           )}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? mode === "add"
//                   ? "Adding..."
//                   : "Updating..."
//                 : mode === "add"
//                 ? "Add Customer"
//                 : "Update Customer"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


//testing

// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { X } from "lucide-react"
// import type { Customer } from "@/types/crm"

// interface CustomerDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   customer: Customer | null
//   mode: "add" | "edit"
// }

// type CustomerFormState = {
//   name: string
//   email: string
//   phone: string
//   company: string
//   address: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   status: Customer["status"]
//   source: string
//   notes: string
//   whatsappNumber: string
//   totalValue: string

//   // service & pricing (your existing logic)
//   serviceType: "" | "whatsapp_api" | "website_dev" | "ai_agent"
//   onboarding: boolean
//   platformFees: boolean
//   recharge: boolean
//   development: boolean
//   supportMaintenance: boolean
//   hosting: boolean
//   oneTimeCharges: boolean
//   monthlyRecurring: boolean
//   oneTimePrice: string
//   monthlyPrice: string

//   // NEW: invoice defaults
//   defaultTaxRate: string
//   defaultDueDays: string
//   defaultInvoiceNotes: string

//   // NEW: recurring
//   recurringEnabled: boolean
//   recurringInterval: "monthly" | "yearly"
//   recurringAmount: string
//   recurringService: string

//   // NEW: renewal defaults
//   defaultRenewalStatus: "active" | "expiring" | "expired" | "renewed"
//   defaultRenewalReminderDays: string
//   defaultRenewalNotes: string
//   nextRenewalDate: string
// }

// const DEFAULT_FORM: CustomerFormState = {
//   name: "",
//   email: "",
//   phone: "",
//   company: "",
//   address: "",
//   city: "",
//   state: "",
//   zipCode: "",
//   country: "India",
//   status: "prospect",
//   source: "",
//   notes: "",
//   whatsappNumber: "",
//   totalValue: "0",

//   serviceType: "",
//   onboarding: false,
//   platformFees: false,
//   recharge: false,
//   development: false,
//   supportMaintenance: false,
//   hosting: false,
//   oneTimeCharges: false,
//   monthlyRecurring: false,
//   oneTimePrice: "0",
//   monthlyPrice: "0",

//   defaultTaxRate: "",
//   defaultDueDays: "",
//   defaultInvoiceNotes: "",

//   recurringEnabled: false,
//   recurringInterval: "monthly",
//   recurringAmount: "",
//   recurringService: "",

//   defaultRenewalStatus: "active",
//   defaultRenewalReminderDays: "",
//   defaultRenewalNotes: "",
//   nextRenewalDate: "",
// }

// export function CustomerDialog({
//   open,
//   onOpenChange,
//   customer,
//   mode,
// }: CustomerDialogProps) {
//   const { addCustomer, updateCustomer } = useCRM()
//   const [formData, setFormData] = useState<CustomerFormState>(DEFAULT_FORM)
//   const [tags, setTags] = useState<string[]>([])
//   const [newTag, setNewTag] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const toNumber = (v: string) => {
//     const n = Number(v || 0)
//     return Number.isNaN(n) ? 0 : n
//   }

//   // auto-calc total value based on pricing inputs
//   useEffect(() => {
//     if (!formData.serviceType) return
//     const oneTime = toNumber(formData.oneTimePrice)
//     const monthly = toNumber(formData.monthlyPrice)
//     const total = oneTime + monthly
//     setFormData((prev) => ({
//       ...prev,
//       totalValue: String(total),
//     }))
//   }, [formData.serviceType, formData.oneTimePrice, formData.monthlyPrice])

//   // populate form when editing
//   useEffect(() => {
//     if (customer && mode === "edit") {
//       setFormData({
//         ...DEFAULT_FORM,
//         name: customer.name ?? "",
//         email: customer.email ?? "",
//         phone: customer.phone ?? "",
//         company: customer.company ?? "",
//         address: customer.address ?? "",
//         city: customer.city ?? "",
//         state: customer.state ?? "",
//         zipCode: customer.zipCode ?? "",
//         country: customer.country ?? "India",
//         status: customer.status ?? "prospect",
//         source: customer.source ?? "",
//         notes: customer.notes ?? "",
//         whatsappNumber: customer.whatsappNumber ?? "",
//         totalValue:
//           typeof customer.totalValue === "number"
//             ? String(customer.totalValue)
//             : (customer.totalValue as any) ?? "0",

//         // defaults
//         defaultTaxRate:
//           customer.defaultTaxRate != null
//             ? String(customer.defaultTaxRate)
//             : "",
//         defaultDueDays:
//           customer.defaultDueDays != null
//             ? String(customer.defaultDueDays)
//             : "",
//         defaultInvoiceNotes: customer.defaultInvoiceNotes ?? "",

//         recurringEnabled: !!customer.recurringEnabled,
//         recurringInterval: customer.recurringInterval ?? "monthly",
//         recurringAmount:
//           customer.recurringAmount != null
//             ? String(customer.recurringAmount)
//             : "",
//         recurringService: customer.recurringService ?? "",

//         defaultRenewalStatus: customer.defaultRenewalStatus ?? "active",
//         defaultRenewalReminderDays:
//           customer.defaultRenewalReminderDays != null
//             ? String(customer.defaultRenewalReminderDays)
//             : "",
//         defaultRenewalNotes: customer.defaultRenewalNotes ?? "",
//         nextRenewalDate:
//           customer.nextRenewalDate instanceof Date
//             ? customer.nextRenewalDate.toISOString().split("T")[0]
//             : (customer.nextRenewalDate as string) || "",
//       })
//       setTags(Array.isArray(customer.tags) ? customer.tags : [])
//     } else {
//       setFormData(DEFAULT_FORM)
//       setTags([])
//     }
//     setNewTag("")
//     setError(null)
//   }, [customer, mode, open])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!formData.name.trim()) return setError("Name is required.")
//     if (!formData.email.trim()) return setError("Email is required.")
//     if (!formData.phone.trim()) return setError("Phone is required.")

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       return setError("Enter a valid email address.")
//     }

//     const totalValueNumber = Number(formData.totalValue || 0)
//     if (Number.isNaN(totalValueNumber) || totalValueNumber < 0) {
//       return setError("Total value must be a valid non-negative number.")
//     }

//     // Build service details string based on selections
//     let serviceDetails = ""
//     if (formData.serviceType) {
//       const serviceName =
//         formData.serviceType === "whatsapp_api"
//           ? "WhatsApp Business API"
//           : formData.serviceType === "website_dev"
//           ? "Website Development"
//           : "AI Agent"

//       const selectedItems: string[] = []
//       if (formData.serviceType === "whatsapp_api") {
//         if (formData.onboarding) selectedItems.push("Onboarding")
//         if (formData.platformFees) selectedItems.push("Platform Fees")
//         if (formData.recharge) selectedItems.push("Recharge")
//       } else {
//         if (formData.development) selectedItems.push("Development")
//         if (formData.supportMaintenance)
//           selectedItems.push("Support & Maintenance")
//         if (formData.hosting) selectedItems.push("Hosting")
//       }

//       const chargeTypes: string[] = []
//       if (formData.oneTimeCharges) chargeTypes.push("One-time charges")
//       if (formData.monthlyRecurring) chargeTypes.push("Monthly recurring")

//       serviceDetails = `\n\nService: ${serviceName}
// Selected: ${selectedItems.join(", ") || "None"}
// Charge Types: ${chargeTypes.join(", ") || "None"}
// One-time: ₹${formData.oneTimePrice}
// Monthly: ₹${formData.monthlyPrice}`
//     }

//     // parse numeric defaults
//     const defaultTaxRate = formData.defaultTaxRate
//       ? Number(formData.defaultTaxRate)
//       : undefined
//     const defaultDueDays = formData.defaultDueDays
//       ? Number(formData.defaultDueDays)
//       : undefined
//     const recurringAmount = formData.recurringAmount
//       ? Number(formData.recurringAmount)
//       : undefined
//     const defaultRenewalReminderDays = formData.defaultRenewalReminderDays
//       ? Number(formData.defaultRenewalReminderDays)
//       : undefined

//     const customerData: Omit<Customer, "id"> = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       company: formData.company,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       zipCode: formData.zipCode,
//       country: formData.country,
//       status: formData.status,
//       source: formData.source,
//       assignedTo: customer?.assignedTo ?? "", // keep existing or empty
//       notes: formData.notes + serviceDetails,
//       whatsappNumber: formData.whatsappNumber,
//       totalValue: totalValueNumber,
//       tags,
//       lastContactDate: customer?.lastContactDate,

//       // new default fields
//       defaultTaxRate,
//       defaultDueDays,
//       defaultInvoiceNotes: formData.defaultInvoiceNotes || undefined,
//       recurringEnabled: formData.recurringEnabled,
//       recurringInterval: formData.recurringInterval,
//       recurringAmount,
//       recurringService: formData.recurringService || undefined,
//       defaultRenewalStatus: formData.defaultRenewalStatus,
//       defaultRenewalReminderDays,
//       defaultRenewalNotes: formData.defaultRenewalNotes || undefined,
//       nextRenewalDate: formData.nextRenewalDate || undefined,

//       // createdAt/updatedAt are handled by backend
//       createdAt: customer?.createdAt ?? new Date(),
//       updatedAt: new Date(),
//     }

//     setIsSubmitting(true)
//     try {
//       const success =
//         mode === "add"
//           ? await addCustomer(customerData as any)
//           : customer
//           ? await updateCustomer(customer.id, customerData as any)
//           : false

//       if (success) {
//         onOpenChange(false)
//         setFormData(DEFAULT_FORM)
//         setTags([])
//         setNewTag("")
//       } else {
//         setError("Failed to save customer. Try again.")
//       }
//     } catch (err: any) {
//       setError(err?.message ?? "Failed to save customer.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const addTagHandler = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags([...tags, newTag.trim()])
//     }
//     setNewTag("")
//   }

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove))
//   }

//   const renderServiceFields = () => {
//     if (!formData.serviceType) return null

//     if (formData.serviceType === "whatsapp_api") {
//       return (
//         <div className="grid grid-cols-3 gap-4 border rounded-md p-3">
//           <div className="space-y-2">
//             <Label className="font-semibold">WhatsApp Business API</Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="onboarding"
//                   checked={formData.onboarding}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, onboarding: checked as boolean })
//                   }
//                 />
//                 <label
//                   htmlFor="onboarding"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Onboarding
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="platformFees"
//                   checked={formData.platformFees}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       platformFees: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="platformFees"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Platform Fees
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="recharge"
//                   checked={formData.recharge}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, recharge: checked as boolean })
//                   }
//                 />
//                 <label
//                   htmlFor="recharge"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Recharge
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="font-semibold">Charge Type</Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="oneTimeCharges"
//                   checked={formData.oneTimeCharges}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       oneTimeCharges: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="oneTimeCharges"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   One-time charges
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="monthlyRecurring"
//                   checked={formData.monthlyRecurring}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       monthlyRecurring: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="monthlyRecurring"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Monthly recurring
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="font-semibold">Pricing Summary</Label>
//             <div className="space-y-2">
//               <div>
//                 <Label>One-time (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.oneTimePrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       oneTimePrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Monthly (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.monthlyPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monthlyPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="border rounded-md p-2 text-sm bg-muted">
//                 <div className="font-semibold">
//                   Total: ₹{toNumber(formData.totalValue)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }

//     // Website Development & AI Agent
//     return (
//       <div className="grid grid-cols-3 gap-4 border rounded-md p-3">
//         <div className="space-y-2">
//           <Label className="font-semibold">
//             {formData.serviceType === "website_dev"
//               ? "Website Development"
//               : "AI Agent"}
//           </Label>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="development"
//                 checked={formData.development}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     development: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="development"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Development
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="supportMaintenance"
//                 checked={formData.supportMaintenance}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     supportMaintenance: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="supportMaintenance"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Support & Maintenance
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="hosting"
//                 checked={formData.hosting}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     hosting: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="hosting"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Hosting
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="font-semibold">Charge Type</Label>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="oneTimeCharges"
//                 checked={formData.oneTimeCharges}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     oneTimeCharges: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="oneTimeCharges"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 One-time charges
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="monthlyRecurring"
//                 checked={formData.monthlyRecurring}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     monthlyRecurring: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="monthlyRecurring"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Monthly recurring
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="font-semibold">Pricing Summary</Label>
//           <div className="space-y-2">
//             <div>
//               <Label>One-time (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.oneTimePrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     oneTimePrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label>Monthly (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.monthlyPrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     monthlyPrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="border rounded-md p-2 text-sm bg-muted">
//               <div className="font-semibold">
//                 Total: ₹{toNumber(formData.totalValue)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "add" ? "Add New Customer" : "Edit Customer"}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === "add"
//               ? "Add a new customer to your CRM system."
//               : "Update customer information and defaults."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone *</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
//               <Input
//                 id="whatsappNumber"
//                 type="tel"
//                 value={formData.whatsappNumber}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     whatsappNumber: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Company + Total Value */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 value={formData.company}
//                 onChange={(e) =>
//                   setFormData({ ...formData, company: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="totalValue">Total Value (₹)</Label>
//               <Input
//                 id="totalValue"
//                 type="number"
//                 value={formData.totalValue}
//                 onChange={(e) =>
//                   setFormData({ ...formData, totalValue: e.target.value })
//                 }
//                 min="0"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) =>
//                 setFormData({ ...formData, city: e.target.value })
//               }
//               placeholder="City"
//             />
//             <Input
//               id="state"
//               value={formData.state}
//               onChange={(e) =>
//                 setFormData({ ...formData, state: e.target.value })
//               }
//               placeholder="State"
//             />
//             <Input
//               id="zipCode"
//               value={formData.zipCode}
//               onChange={(e) =>
//                 setFormData({ ...formData, zipCode: e.target.value })
//               }
//               placeholder="ZIP"
//             />
//           </div>

//           {/* Status & Source */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <select
//                 className="border rounded px-3 py-2 text-sm w-full"
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     status: e.target.value as Customer["status"],
//                   })
//                 }
//               >
//                 <option value="prospect">Prospect</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="source">Source</Label>
//               <Input
//                 id="source"
//                 value={formData.source}
//                 onChange={(e) =>
//                   setFormData({ ...formData, source: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Invoice Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Invoice Defaults</p>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-1">
//                 <Label>Default Tax Rate (%)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultTaxRate}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultTaxRate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Due Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultDueDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultDueDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Invoice Notes</Label>
//                 <Input
//                   value={formData.defaultInvoiceNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultInvoiceNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recurring / Subscription */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Recurring / Subscription</p>
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="recurringEnabled"
//                 checked={formData.recurringEnabled}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     recurringEnabled: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="recurringEnabled"
//                 className="text-sm font-medium cursor-pointer"
//               >
//                 Enable recurring billing
//               </label>
//             </div>

//             {formData.recurringEnabled && (
//               <div className="grid grid-cols-3 gap-4 mt-2">
//                 <div className="space-y-1">
//                   <Label>Interval</Label>
//                   <select
//                     className="border rounded px-3 py-2 text-sm w-full"
//                     value={formData.recurringInterval}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringInterval: e.target.value as "monthly" | "yearly",
//                       })
//                     }
//                   >
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.recurringAmount}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringAmount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Service Name</Label>
//                   <Input
//                     value={formData.recurringService}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringService: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Renewal Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Renewal Defaults</p>
//             <div className="grid grid-cols-4 gap-4">
//               <div className="space-y-1">
//                 <Label>Status</Label>
//                 <select
//                   className="border rounded px-3 py-2 text-sm w-full"
//                   value={formData.defaultRenewalStatus}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalStatus: e.target
//                         .value as CustomerFormState["defaultRenewalStatus"],
//                     })
//                   }
//                 >
//                   <option value="active">Active</option>
//                   <option value="expiring">Expiring</option>
//                   <option value="expired">Expired</option>
//                   <option value="renewed">Renewed</option>
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <Label>Reminder Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultRenewalReminderDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalReminderDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1 col-span-2">
//                 <Label>Renewal Notes</Label>
//                 <Input
//                   value={formData.defaultRenewalNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="space-y-1">
//               <Label>Next Renewal Date</Label>
//               <Input
//                 type="date"
//                 value={formData.nextRenewalDate}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     nextRenewalDate: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Service selection + dynamic pricing blocks */}
//           <div className="space-y-2">
//             <Label>Service</Label>
//             <select
//               className="border rounded px-3 py-2 text-sm w-full"
//               value={formData.serviceType}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   serviceType: e.target.value as
//                     | ""
//                     | "whatsapp_api"
//                     | "website_dev"
//                     | "ai_agent",
//                 })
//               }
//             >
//               <option value="">Select service</option>
//               <option value="whatsapp_api">WhatsApp Business API</option>
//               <option value="website_dev">Website Development</option>
//               <option value="ai_agent">AI Agent</option>
//             </select>
//           </div>

//           {renderServiceFields()}

//           {/* Tags */}
//           <div className="space-y-2">
//             <Label>Tags</Label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant="secondary"
//                   className="flex items-center gap-1"
//                 >
//                   {tag}
//                   <X
//                     className="h-3 w-3 cursor-pointer"
//                     onClick={() => removeTag(tag)}
//                   />
//                 </Badge>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input
//                 value={newTag}
//                 onChange={(e) => setNewTag(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={addTagHandler}
//               >
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-destructive border border-destructive/30 rounded p-2">
//               {error}
//             </p>
//           )}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? mode === "add"
//                   ? "Adding..."
//                   : "Updating..."
//                 : mode === "add"
//                 ? "Add Customer"
//                 : "Update Customer"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


//testing for new changes (16-12-2025)

// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { X } from "lucide-react"
// import type { Customer } from "@/types/crm"

// interface CustomerDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   customer: Customer | null
//   mode: "add" | "edit"
// }

// type CustomerFormState = {
//   name: string
//   email: string
//   phone: string
//   company: string
//   address: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   status: Customer["status"]
//   source: string
//   notes: string
//   whatsappNumber: string
//   totalValue: string

//   // service & pricing
//   serviceType: "" | "whatsapp_api" | "website_dev" | "ai_agent"
//   onboarding: boolean
//   platformFees: boolean
//   recharge: boolean
//   development: boolean
//   supportMaintenance: boolean
//   hosting: boolean
//   oneTimeCharges: boolean
//   monthlyRecurring: boolean
//   oneTimePrice: string
//   monthlyPrice: string
//   manualPrice: string // NEW: manual price input

//   // invoice defaults
//   defaultTaxRate: string
//   defaultDueDays: string
//   defaultInvoiceNotes: string

//   // recurring
//   recurringEnabled: boolean
//   recurringInterval: "monthly" | "yearly"
//   recurringAmount: string
//   recurringService: string

//   // renewal defaults
//   defaultRenewalStatus: "active" | "expiring" | "expired" | "renewed"
//   defaultRenewalReminderDays: string
//   defaultRenewalNotes: string
// }

// const DEFAULT_FORM: CustomerFormState = {
//   name: "",
//   email: "",
//   phone: "",
//   company: "",
//   address: "",
//   city: "",
//   state: "",
//   zipCode: "",
//   country: "India",
//   status: "prospect",
//   source: "",
//   notes: "",
//   whatsappNumber: "",
//   totalValue: "0",

//   serviceType: "",
//   onboarding: false,
//   platformFees: false,
//   recharge: false,
//   development: false,
//   supportMaintenance: false,
//   hosting: false,
//   oneTimeCharges: false,
//   monthlyRecurring: false,
//   oneTimePrice: "0",
//   monthlyPrice: "0",
//   manualPrice: "0",

//   defaultTaxRate: "",
//   defaultDueDays: "",
//   defaultInvoiceNotes: "",

//   recurringEnabled: false,
//   recurringInterval: "monthly",
//   recurringAmount: "",
//   recurringService: "",

//   defaultRenewalStatus: "active",
//   defaultRenewalReminderDays: "",
//   defaultRenewalNotes: "",
// }

// export function CustomerDialog({
//   open,
//   onOpenChange,
//   customer,
//   mode,
// }: CustomerDialogProps) {
//   const { addCustomer, updateCustomer } = useCRM()
//   const [formData, setFormData] = useState<CustomerFormState>(DEFAULT_FORM)
//   const [tags, setTags] = useState<string[]>([])
//   const [newTag, setNewTag] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const toNumber = (v: string) => {
//     const n = Number(v || 0)
//     return Number.isNaN(n) ? 0 : n
//   }

//   // auto-calc total value based on pricing inputs (one-time + monthly + manual price)
//   useEffect(() => {
//     if (!formData.serviceType) return
//     const oneTime = toNumber(formData.oneTimePrice)
//     const monthly = toNumber(formData.monthlyPrice)
//     const manual = toNumber(formData.manualPrice)
//     const total = oneTime + monthly + manual
//     setFormData((prev) => ({
//       ...prev,
//       totalValue: String(total),
//     }))
//   }, [formData.serviceType, formData.oneTimePrice, formData.monthlyPrice, formData.manualPrice])

//   // populate form when editing
//   useEffect(() => {
//     if (customer && mode === "edit") {
//       setFormData({
//         ...DEFAULT_FORM,
//         name: customer.name ?? "",
//         email: customer.email ?? "",
//         phone: customer.phone ?? "",
//         company: customer.company ?? "",
//         address: customer.address ?? "",
//         city: customer.city ?? "",
//         state: customer.state ?? "",
//         zipCode: customer.zipCode ?? "",
//         country: customer.country ?? "India",
//         status: customer.status ?? "prospect",
//         source: customer.source ?? "",
//         notes: customer.notes ?? "",
//         whatsappNumber: customer.whatsappNumber ?? "",
//         totalValue:
//           typeof customer.totalValue === "number"
//             ? String(customer.totalValue)
//             : (customer.totalValue as any) ?? "0",

//         // infer or map existing serviceType if stored on customer
//         serviceType:
//           (customer as any).serviceType ??
//           (customer as any).service ??
//           "",

//         // defaults
//         defaultTaxRate:
//           customer.defaultTaxRate != null
//             ? String(customer.defaultTaxRate)
//             : "",
//         defaultDueDays:
//           customer.defaultDueDays != null
//             ? String(customer.defaultDueDays)
//             : "",
//         defaultInvoiceNotes: customer.defaultInvoiceNotes ?? "",

//         recurringEnabled: !!customer.recurringEnabled,
//         recurringInterval: customer.recurringInterval ?? "monthly",
//         recurringAmount:
//           customer.recurringAmount != null
//             ? String(customer.recurringAmount)
//             : "",
//         recurringService: customer.recurringService ?? "",

//         defaultRenewalStatus: customer.defaultRenewalStatus ?? "active",
//         defaultRenewalReminderDays:
//           customer.defaultRenewalReminderDays != null
//             ? String(customer.defaultRenewalReminderDays)
//             : "",
//         defaultRenewalNotes: customer.defaultRenewalNotes ?? "",
//       })
//       setTags(Array.isArray(customer.tags) ? customer.tags : [])
//     } else {
//       setFormData(DEFAULT_FORM)
//       setTags([])
//     }
//     setNewTag("")
//     setError(null)
//   }, [customer, mode, open])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!formData.name.trim()) return setError("Name is required.")
//     if (!formData.email.trim()) return setError("Email is required.")
//     if (!formData.phone.trim()) return setError("Phone is required.")

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       return setError("Enter a valid email address.")
//     }

//     const totalValueNumber = Number(formData.totalValue || 0)
//     if (Number.isNaN(totalValueNumber) || totalValueNumber < 0) {
//       return setError("Total value must be a valid non-negative number.")
//     }

//     // Build service details string based on selections
//     let serviceDetails = ""
//     if (formData.serviceType) {
//       const serviceName =
//         formData.serviceType === "whatsapp_api"
//           ? "WhatsApp Business API"
//           : formData.serviceType === "website_dev"
//           ? "Website Development"
//           : "AI Agent"

//       const selectedItems: string[] = []
//       if (formData.serviceType === "whatsapp_api") {
//         if (formData.onboarding) selectedItems.push("Onboarding")
//         if (formData.platformFees) selectedItems.push("Platform Fees")
//         if (formData.recharge) selectedItems.push("Recharge")
//       } else {
//         if (formData.development) selectedItems.push("Development")
//         if (formData.supportMaintenance)
//           selectedItems.push("Support & Maintenance")
//         if (formData.hosting) selectedItems.push("Hosting")
//       }

//       const chargeTypes: string[] = []
//       if (formData.oneTimeCharges) chargeTypes.push("One-time charges")
//       if (formData.monthlyRecurring) chargeTypes.push("Monthly recurring")

//       serviceDetails = `\n\nService: ${serviceName}
// Selected: ${selectedItems.join(", ") || "None"}
// Charge Types: ${chargeTypes.join(", ") || "None"}
// One-time: ₹${formData.oneTimePrice}
// Monthly: ₹${formData.monthlyPrice}
// Manual Price: ₹${formData.manualPrice}`
//     }

//     // parse numeric defaults
//     const defaultTaxRate = formData.defaultTaxRate
//       ? Number(formData.defaultTaxRate)
//       : undefined
//     const defaultDueDays = formData.defaultDueDays
//       ? Number(formData.defaultDueDays)
//       : undefined
//     const recurringAmount = formData.recurringAmount
//       ? Number(formData.recurringAmount)
//       : undefined
//     const defaultRenewalReminderDays = formData.defaultRenewalReminderDays
//       ? Number(formData.defaultRenewalReminderDays)
//       : undefined

//     const customerData: Omit<Customer, "id"> = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       company: formData.company,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       zipCode: formData.zipCode,
//       country: formData.country,
//       status: formData.status,
//       source: formData.source,
//       assignedTo: customer?.assignedTo ?? "", // keep existing or empty
//       notes: formData.notes + serviceDetails,
//       whatsappNumber: formData.whatsappNumber,
//       totalValue: totalValueNumber,
//       tags,
//       lastContactDate: customer?.lastContactDate,

//       // new default fields
//       defaultTaxRate,
//       defaultDueDays,
//       defaultInvoiceNotes: formData.defaultInvoiceNotes || undefined,
//       recurringEnabled: formData.recurringEnabled,
//       recurringInterval: formData.recurringInterval,
//       recurringAmount,
//       recurringService: formData.recurringService || undefined,
//       defaultRenewalStatus: formData.defaultRenewalStatus,
//       defaultRenewalReminderDays,
//       defaultRenewalNotes: formData.defaultRenewalNotes || undefined,

//       // createdAt/updatedAt are handled by backend
//       createdAt: customer?.createdAt ?? new Date(),
//       updatedAt: new Date(),
//     }

//     setIsSubmitting(true)
//     try {
//       const success =
//         mode === "add"
//           ? await addCustomer(customerData as any)
//           : customer
//           ? await updateCustomer(customer.id, customerData as any)
//           : false

//       if (success) {
//         onOpenChange(false)
//         setFormData(DEFAULT_FORM)
//         setTags([])
//         setNewTag("")
//       } else {
//         setError("Failed to save customer. Try again.")
//       }
//     } catch (err: any) {
//       setError(err?.message ?? "Failed to save customer.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const addTagHandler = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags([...tags, newTag.trim()])
//     }
//     setNewTag("")
//   }

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove))
//   }

//   // central place for future restriction: service change from lead vs manual
//   const handleServiceChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
//     const newValue = e.target.value as "" | "whatsapp_api" | "website_dev" | "ai_agent"

//     // TODO (after context/backend update):
//     // if (mode === "edit" && (customer as any)?.isFromLead && formData.serviceType && newValue !== formData.serviceType) {
//     //   alert("Change the service from lead page")
//     //   return
//     // }

//     setFormData({
//       ...formData,
//       serviceType: newValue,
//     })
//   }

//   const renderServiceFields = () => {
//     if (!formData.serviceType) return null

//     if (formData.serviceType === "whatsapp_api") {
//       return (
//         <div className="grid grid-cols-3 gap-4 border rounded-md p-3">
//           <div className="space-y-2">
//             <Label className="font-semibold">WhatsApp Business API</Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="onboarding"
//                   checked={formData.onboarding}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, onboarding: checked as boolean })
//                   }
//                 />
//                 <label
//                   htmlFor="onboarding"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Onboarding
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="platformFees"
//                   checked={formData.platformFees}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       platformFees: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="platformFees"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Platform Fees
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="recharge"
//                   checked={formData.recharge}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, recharge: checked as boolean })
//                   }
//                 />
//                 <label
//                   htmlFor="recharge"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Recharge
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="font-semibold">Charge Type</Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="oneTimeCharges"
//                   checked={formData.oneTimeCharges}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       oneTimeCharges: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="oneTimeCharges"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   One-time charges
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="monthlyRecurring"
//                   checked={formData.monthlyRecurring}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       monthlyRecurring: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="monthlyRecurring"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Monthly recurring
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="font-semibold">Pricing Summary</Label>
//             <div className="space-y-2">
//               <div>
//                 <Label>One-time (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.oneTimePrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       oneTimePrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Monthly (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.monthlyPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monthlyPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Manual Price (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.manualPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       manualPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="border rounded-md p-2 text-sm bg-muted">
//                 <div className="font-semibold">
//                   Total: ₹{toNumber(formData.totalValue)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }

//     // Website Development & AI Agent
//     return (
//       <div className="grid grid-cols-3 gap-4 border rounded-md p-3">
//         <div className="space-y-2">
//           <Label className="font-semibold">
//             {formData.serviceType === "website_dev"
//               ? "Website Development"
//               : "AI Agent"}
//           </Label>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="development"
//                 checked={formData.development}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     development: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="development"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Development
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="supportMaintenance"
//                 checked={formData.supportMaintenance}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     supportMaintenance: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="supportMaintenance"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Support & Maintenance
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="hosting"
//                 checked={formData.hosting}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     hosting: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="hosting"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Hosting
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="font-semibold">Charge Type</Label>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="oneTimeCharges"
//                 checked={formData.oneTimeCharges}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     oneTimeCharges: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="oneTimeCharges"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 One-time charges
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="monthlyRecurring"
//                 checked={formData.monthlyRecurring}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     monthlyRecurring: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="monthlyRecurring"
//                 className="text-sm font-medium leading-none cursor-pointer"
//               >
//                 Monthly recurring
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="font-semibold">Pricing Summary</Label>
//           <div className="space-y-2">
//             <div>
//               <Label>One-time (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.oneTimePrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     oneTimePrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label>Monthly (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.monthlyPrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     monthlyPrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label>Manual Price (₹)</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.manualPrice}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     manualPrice: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="border rounded-md p-2 text-sm bg-muted">
//               <div className="font-semibold">
//                 Total: ₹{toNumber(formData.totalValue)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "add" ? "Add New Customer" : "Edit Customer"}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === "add"
//               ? "Add a new customer to your CRM system."
//               : "Update customer information and defaults."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone *</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
//               <Input
//                 id="whatsappNumber"
//                 type="tel"
//                 value={formData.whatsappNumber}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     whatsappNumber: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Company + Total Value */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 value={formData.company}
//                 onChange={(e) =>
//                   setFormData({ ...formData, company: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="totalValue">Total Value (₹)</Label>
//               <Input
//                 id="totalValue"
//                 type="number"
//                 value={formData.totalValue}
//                 onChange={(e) =>
//                   setFormData({ ...formData, totalValue: e.target.value })
//                 }
//                 min="0"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) =>
//                 setFormData({ ...formData, city: e.target.value })
//               }
//               placeholder="City"
//             />
//             <Input
//               id="state"
//               value={formData.state}
//               onChange={(e) =>
//                 setFormData({ ...formData, state: e.target.value })
//               }
//               placeholder="State"
//             />
//             <Input
//               id="zipCode"
//               value={formData.zipCode}
//               onChange={(e) =>
//                 setFormData({ ...formData, zipCode: e.target.value })
//               }
//               placeholder="ZIP"
//             />
//           </div>

//           {/* Status & Source */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <select
//                 className="border rounded px-3 py-2 text-sm w-full"
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     status: e.target.value as Customer["status"],
//                   })
//                 }
//               >
//                 <option value="prospect">Prospect</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="source">Source</Label>
//               <Input
//                 id="source"
//                 value={formData.source}
//                 onChange={(e) =>
//                   setFormData({ ...formData, source: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Invoice Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Invoice Defaults</p>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-1">
//                 <Label>Default Tax Rate (%)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultTaxRate}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultTaxRate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Due Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultDueDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultDueDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Invoice Notes</Label>
//                 <Input
//                   value={formData.defaultInvoiceNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultInvoiceNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recurring / Subscription */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Recurring / Subscription</p>
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="recurringEnabled"
//                 checked={formData.recurringEnabled}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     recurringEnabled: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="recurringEnabled"
//                 className="text-sm font-medium cursor-pointer"
//               >
//                 Enable recurring billing
//               </label>
//             </div>

//             {formData.recurringEnabled && (
//               <div className="grid grid-cols-3 gap-4 mt-2">
//                 <div className="space-y-1">
//                   <Label>Interval</Label>
//                   <select
//                     className="border rounded px-3 py-2 text-sm w-full"
//                     value={formData.recurringInterval}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringInterval: e.target.value as "monthly" | "yearly",
//                       })
//                     }
//                   >
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.recurringAmount}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringAmount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Service Name</Label>
//                   <Input
//                     value={formData.recurringService}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringService: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Renewal Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Renewal Defaults</p>
//             <div className="grid grid-cols-4 gap-4">
//               <div className="space-y-1">
//                 <Label>Status</Label>
//                 <select
//                   className="border rounded px-3 py-2 text-sm w-full"
//                   value={formData.defaultRenewalStatus}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalStatus: e.target
//                         .value as CustomerFormState["defaultRenewalStatus"],
//                     })
//                   }
//                 >
//                   <option value="active">Active</option>
//                   <option value="expiring">Expiring</option>
//                   <option value="expired">Expired</option>
//                   <option value="renewed">Renewed</option>
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <Label>Reminder Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultRenewalReminderDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalReminderDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1 col-span-2">
//                 <Label>Renewal Notes</Label>
//                 <Input
//                   value={formData.defaultRenewalNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             {/* Next Renewal Date removed as requested */}
//           </div>

//           {/* Service selection + dynamic pricing blocks */}
//           <div className="space-y-2">
//             <Label>Service</Label>
//             <select
//               className="border rounded px-3 py-2 text-sm w-full"
//               value={formData.serviceType}
//               onChange={handleServiceChange}
//             >
//               <option value="">Select service</option>
//               <option value="whatsapp_api">WhatsApp Business API</option>
//               <option value="website_dev">Website Development</option>
//               <option value="ai_agent">AI Agent</option>
//             </select>
//           </div>

//           {renderServiceFields()}

//           {/* Tags */}
//           <div className="space-y-2">
//             <Label>Tags</Label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant="secondary"
//                   className="flex items-center gap-1"
//                 >
//                   {tag}
//                   <X
//                     className="h-3 w-3 cursor-pointer"
//                     onClick={() => removeTag(tag)}
//                   />
//                 </Badge>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input
//                 value={newTag}
//                 onChange={(e) => setNewTag(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={addTagHandler}
//               >
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-destructive border border-destructive/30 rounded p-2">
//               {error}
//             </p>
//           )}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? mode === "add"
//                   ? "Adding..."
//                   : "Updating..."
//                 : mode === "add"
//                 ? "Add Customer"
//                 : "Update Customer"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


// testing for new changes 2 (16-12-2025)

// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { X } from "lucide-react"
// import type { Customer } from "@/types/crm"

// interface CustomerDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   customer: Customer | null
//   mode: "add" | "edit"
// }

// type CustomerFormState = {
//   name: string
//   email: string
//   phone: string
//   company: string
//   address: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   status: Customer["status"]
//   source: string
//   notes: string
//   whatsappNumber: string
//   totalValue: string

//   // service & pricing
//   serviceType: "" | "whatsapp_api" | "website_dev" | "ai_agent"
//   onboarding: boolean
//   platformFees: boolean
//   recharge: boolean
//   development: boolean
//   supportMaintenance: boolean
//   hosting: boolean
//   oneTimeCharges: boolean
//   monthlyRecurring: boolean
//   oneTimePrice: string
//   monthlyPrice: string
//   manualPrice: string // manual price input

//   // invoice defaults
//   defaultTaxRate: string
//   defaultDueDays: string
//   defaultInvoiceNotes: string

//   // recurring
//   recurringEnabled: boolean
//   recurringInterval: "monthly" | "yearly"
//   recurringAmount: string
//   recurringService: string

//   // renewal defaults
//   defaultRenewalStatus: "active" | "expiring" | "expired" | "renewed"
//   defaultRenewalReminderDays: string
//   defaultRenewalNotes: string
// }

// const DEFAULT_FORM: CustomerFormState = {
//   name: "",
//   email: "",
//   phone: "",
//   company: "",
//   address: "",
//   city: "",
//   state: "",
//   zipCode: "",
//   country: "India",
//   status: "prospect",
//   source: "",
//   notes: "",
//   whatsappNumber: "",
//   totalValue: "0",

//   serviceType: "",
//   onboarding: false,
//   platformFees: false,
//   recharge: false,
//   development: false,
//   supportMaintenance: false,
//   hosting: false,
//   oneTimeCharges: false,
//   monthlyRecurring: false,
//   oneTimePrice: "0",
//   monthlyPrice: "0",
//   manualPrice: "0",

//   defaultTaxRate: "",
//   defaultDueDays: "",
//   defaultInvoiceNotes: "",

//   recurringEnabled: false,
//   recurringInterval: "monthly",
//   recurringAmount: "",
//   recurringService: "",

//   defaultRenewalStatus: "active",
//   defaultRenewalReminderDays: "",
//   defaultRenewalNotes: "",
// }

// export function CustomerDialog({
//   open,
//   onOpenChange,
//   customer,
//   mode,
// }: CustomerDialogProps) {
//   const { addCustomer, updateCustomer } = useCRM()
//   const [formData, setFormData] = useState<CustomerFormState>(DEFAULT_FORM)
//   const [tags, setTags] = useState<string[]>([])
//   const [newTag, setNewTag] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const toNumber = (v: string) => {
//     const n = Number(v || 0)
//     return Number.isNaN(n) ? 0 : n
//   }

//   // auto-calc total value based on pricing inputs (one-time + monthly + manual price)
//   useEffect(() => {
//     if (!formData.serviceType) return
//     const oneTime = toNumber(formData.oneTimePrice)
//     const monthly = toNumber(formData.monthlyPrice)
//     const manual = toNumber(formData.manualPrice)
//     const total = oneTime + monthly + manual
//     setFormData((prev) => ({
//       ...prev,
//       totalValue: String(total),
//     }))
//   }, [formData.serviceType, formData.oneTimePrice, formData.monthlyPrice, formData.manualPrice])

//   // populate form when editing
//   useEffect(() => {
//     if (customer && mode === "edit") {
//       setFormData({
//         ...DEFAULT_FORM,
//         name: customer.name ?? "",
//         email: customer.email ?? "",
//         phone: customer.phone ?? "",
//         company: customer.company ?? "",
//         address: customer.address ?? "",
//         city: customer.city ?? "",
//         state: customer.state ?? "",
//         zipCode: customer.zipCode ?? "",
//         country: customer.country ?? "India",
//         status: customer.status ?? "prospect",
//         source: customer.source ?? "",
//         notes: customer.notes ?? "",
//         whatsappNumber: customer.whatsappNumber ?? "",
//         totalValue:
//           typeof customer.totalValue === "number"
//             ? String(customer.totalValue)
//             : (customer.totalValue as any) ?? "0",

//         // infer or map existing serviceType if stored on customer
//         serviceType:
//           (customer as any).serviceType ??
//           (customer as any).service ??
//           "",

//         defaultTaxRate:
//           customer.defaultTaxRate != null
//             ? String(customer.defaultTaxRate)
//             : "",
//         defaultDueDays:
//           customer.defaultDueDays != null
//             ? String(customer.defaultDueDays)
//             : "",
//         defaultInvoiceNotes: customer.defaultInvoiceNotes ?? "",

//         recurringEnabled: !!customer.recurringEnabled,
//         recurringInterval: customer.recurringInterval ?? "monthly",
//         recurringAmount:
//           customer.recurringAmount != null
//             ? String(customer.recurringAmount)
//             : "",
//         recurringService: customer.recurringService ?? "",

//         defaultRenewalStatus: customer.defaultRenewalStatus ?? "active",
//         defaultRenewalReminderDays:
//           customer.defaultRenewalReminderDays != null
//             ? String(customer.defaultRenewalReminderDays)
//             : "",
//         defaultRenewalNotes: customer.defaultRenewalNotes ?? "",
//       })
//       setTags(Array.isArray(customer.tags) ? customer.tags : [])
//     } else {
//       setFormData(DEFAULT_FORM)
//       setTags([])
//     }
//     setNewTag("")
//     setError(null)
//   }, [customer, mode, open])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!formData.name.trim()) return setError("Name is required.")
//     if (!formData.email.trim()) return setError("Email is required.")
//     if (!formData.phone.trim()) return setError("Phone is required.")

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       return setError("Enter a valid email address.")
//     }

//     const totalValueNumber = Number(formData.totalValue || 0)
//     if (Number.isNaN(totalValueNumber) || totalValueNumber < 0) {
//       return setError("Total value must be a valid non-negative number.")
//     }

//     // Friendly service name
//     const serviceName =
//       formData.serviceType === "whatsapp_api"
//         ? "WhatsApp Business API"
//         : formData.serviceType === "website_dev"
//         ? "Website Development"
//         : formData.serviceType === "ai_agent"
//         ? "AI Agent"
//         : ""

//     // Build service details string based on selections
//     let serviceDetails = ""
//     if (formData.serviceType) {
//       const selectedItems: string[] = []
//       if (formData.serviceType === "whatsapp_api") {
//         if (formData.onboarding) selectedItems.push("Onboarding")
//         if (formData.platformFees) selectedItems.push("Platform Fees")
//         if (formData.recharge) selectedItems.push("Recharge")
//       } else {
//         if (formData.development) selectedItems.push("Development")
//         if (formData.supportMaintenance)
//           selectedItems.push("Support & Maintenance")
//         if (formData.hosting) selectedItems.push("Hosting")
//       }

//       // chargeTypes kept in data, but UI hidden; still included in summary
//       const chargeTypes: string[] = []
//       if (formData.oneTimeCharges) chargeTypes.push("One-time charges")
//       if (formData.monthlyRecurring) chargeTypes.push("Monthly recurring")

//       serviceDetails = `Service: ${serviceName || "N/A"}
// Selected items: ${selectedItems.join(", ") || "None"}
// Charge types: ${chargeTypes.join(", ") || "None"}
// One-time: ₹${formData.oneTimePrice}
// Monthly: ₹${formData.monthlyPrice}
// Manual price: ₹${formData.manualPrice}`
//     }

//     // parse numeric defaults
//     const defaultTaxRate = formData.defaultTaxRate
//       ? Number(formData.defaultTaxRate)
//       : undefined
//     const defaultDueDays = formData.defaultDueDays
//       ? Number(formData.defaultDueDays)
//       : undefined
//     const recurringAmount = formData.recurringAmount
//       ? Number(formData.recurringAmount)
//       : undefined
//     const defaultRenewalReminderDays = formData.defaultRenewalReminderDays
//       ? Number(formData.defaultRenewalReminderDays)
//       : undefined

//     // Build full summary for notes (customer, service, invoice, recurring, renewal, totals)
//     const summaryLines: string[] = [
//       `Customer name: ${formData.name}`,
//       `Email: ${formData.email}`,
//       `Phone: ${formData.phone}`,
//       `Company: ${formData.company || "N/A"}`,
//       `Status: ${formData.status}`,
//       `Source: ${formData.source || "N/A"}`,
//       `Service: ${serviceName || "N/A"}`,
//       `Invoice defaults: taxRate=${formData.defaultTaxRate || "N/A"}, dueDays=${formData.defaultDueDays || "N/A"}, notes=${formData.defaultInvoiceNotes || "N/A"}`,
//       `Recurring: enabled=${formData.recurringEnabled ? "yes" : "no"}, interval=${formData.recurringInterval}, amount=${formData.recurringAmount || "N/A"}, service=${formData.recurringService || "N/A"}`,
//       `Renewal: status=${formData.defaultRenewalStatus}, reminderDays=${formData.defaultRenewalReminderDays || "N/A"}, notes=${formData.defaultRenewalNotes || "N/A"}`,
//       `Total value: ₹${totalValueNumber}`,
//       `WhatsApp: ${formData.whatsappNumber || "N/A"}`,
//     ]

//     const appendedNotes =
//       (formData.notes ? formData.notes.trim() + "\n\n" : "") +
//       "[Auto summary]\n" +
//       summaryLines.join("\n") +
//       (serviceDetails ? "\n\n" + serviceDetails : "")

//     const customerData: Omit<Customer, "id"> = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       company: formData.company,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       zipCode: formData.zipCode,
//       country: formData.country,
//       status: formData.status,
//       source: formData.source,
//       assignedTo: customer?.assignedTo ?? "",
//       notes: appendedNotes,
//       whatsappNumber: formData.whatsappNumber,
//       totalValue: totalValueNumber,
//       tags,
//       lastContactDate: customer?.lastContactDate,

//       defaultTaxRate,
//       defaultDueDays,
//       defaultInvoiceNotes: formData.defaultInvoiceNotes || undefined,
//       recurringEnabled: formData.recurringEnabled,
//       recurringInterval: formData.recurringInterval,
//       recurringAmount,
//       recurringService: formData.recurringService || undefined,
//       defaultRenewalStatus: formData.defaultRenewalStatus,
//       defaultRenewalReminderDays,
//       defaultRenewalNotes: formData.defaultRenewalNotes || undefined,

//       createdAt: customer?.createdAt ?? new Date(),
//       updatedAt: new Date(),
//     }

//     setIsSubmitting(true)
//     try {
//       const success =
//         mode === "add"
//           ? await addCustomer(customerData as any)
//           : customer
//           ? await updateCustomer(customer.id, customerData as any)
//           : false

//       if (success) {
//         onOpenChange(false)
//         setFormData(DEFAULT_FORM)
//         setTags([])
//         setNewTag("")
//       } else {
//         setError("Failed to save customer. Try again.")
//       }
//     } catch (err: any) {
//       setError(err?.message ?? "Failed to save customer.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const addTagHandler = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags([...tags, newTag.trim()])
//     }
//     setNewTag("")
//   }

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove))
//   }

//   const handleServiceChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
//     const newValue = e.target.value as "" | "whatsapp_api" | "website_dev" | "ai_agent"
//     setFormData({
//       ...formData,
//       serviceType: newValue,
//     })
//   }

//   const renderServiceFields = () => {
//     if (!formData.serviceType) return null

//     const serviceSelectedCheckbox = (
//       <div className="flex items-center space-x-2 mb-3">
//         <Checkbox
//           checked={true}
//           className="pointer-events-none opacity-80"
//           aria-readonly="true"
//         />
//         <span className="text-sm text-muted-foreground">
//           Service selected
//         </span>
//       </div>
//     )

//     if (formData.serviceType === "whatsapp_api") {
//       return (
//         <div className="border rounded-md p-3 space-y-3">
//           {serviceSelectedCheckbox}
//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label className="font-semibold">WhatsApp Business API</Label>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="onboarding"
//                     checked={formData.onboarding}
//                     onCheckedChange={(checked) =>
//                       setFormData({ ...formData, onboarding: checked as boolean })
//                     }
//                   />
//                   <label
//                     htmlFor="onboarding"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Onboarding
//                   </label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="platformFees"
//                     checked={formData.platformFees}
//                     onCheckedChange={(checked) =>
//                       setFormData({
//                         ...formData,
//                         platformFees: checked as boolean,
//                       })
//                     }
//                   />
//                   <label
//                     htmlFor="platformFees"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Platform Fees
//                   </label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="recharge"
//                     checked={formData.recharge}
//                     onCheckedChange={(checked) =>
//                       setFormData({ ...formData, recharge: checked as boolean })
//                     }
//                   />
//                   <label
//                     htmlFor="recharge"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Recharge
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Charge Type section commented out */}
//             {/*
//             <div className="space-y-2">
//               <Label className="font-semibold">Charge Type</Label>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="oneTimeCharges"
//                     checked={formData.oneTimeCharges}
//                     onCheckedChange={(checked) =>
//                       setFormData({
//                         ...formData,
//                         oneTimeCharges: checked as boolean,
//                       })
//                     }
//                   />
//                   <label
//                     htmlFor="oneTimeCharges"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     One-time charges
//                   </label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="monthlyRecurring"
//                     checked={formData.monthlyRecurring}
//                     onCheckedChange={(checked) =>
//                       setFormData({
//                         ...formData,
//                         monthlyRecurring: checked as boolean,
//                       })
//                     }
//                   />
//                   <label
//                     htmlFor="monthlyRecurring"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Monthly recurring
//                   </label>
//                 </div>
//               </div>
//             </div>
//             */}

//             <div className="space-y-2">
//               <Label className="font-semibold">Pricing Summary</Label>
//               <div className="space-y-2">
//                 <div>
//                   <Label>One-time (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.oneTimePrice}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         oneTimePrice: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <Label>Monthly (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.monthlyPrice}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         monthlyPrice: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <Label>Manual Price (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.manualPrice}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         manualPrice: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="border rounded-md p-2 text-sm bg-muted">
//                   <div className="font-semibold">
//                     Total: ₹{toNumber(formData.totalValue)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }

//     // Website Development & AI Agent
//     return (
//       <div className="border rounded-md p-3 space-y-3">
//         {serviceSelectedCheckbox}
//         <div className="grid grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label className="font-semibold">
//               {formData.serviceType === "website_dev"
//                 ? "Website Development"
//                 : "AI Agent"}
//             </Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="development"
//                   checked={formData.development}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       development: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="development"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Development
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="supportMaintenance"
//                   checked={formData.supportMaintenance}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       supportMaintenance: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="supportMaintenance"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Support & Maintenance
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="hosting"
//                   checked={formData.hosting}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       hosting: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="hosting"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Hosting
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Charge Type section commented out */}
//           {/*
//           <div className="space-y-2">
//             <Label className="font-semibold">Charge Type</Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="oneTimeCharges"
//                   checked={formData.oneTimeCharges}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       oneTimeCharges: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="oneTimeCharges"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   One-time charges
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="monthlyRecurring"
//                   checked={formData.monthlyRecurring}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       monthlyRecurring: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="monthlyRecurring"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Monthly recurring
//                 </label>
//               </div>
//             </div>
//           </div>
//           */}

//           <div className="space-y-2">
//             <Label className="font-semibold">Pricing Summary</Label>
//             <div className="space-y-2">
//               <div>
//                 <Label>One-time (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.oneTimePrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       oneTimePrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Monthly (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.monthlyPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monthlyPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Manual Price (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.manualPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       manualPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="border rounded-md p-2 text-sm bg-muted">
//                 <div className="font-semibold">
//                   Total: ₹{toNumber(formData.totalValue)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "add" ? "Add New Customer" : "Edit Customer"}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === "add"
//               ? "Add a new customer to your CRM system."
//               : "Update customer information and defaults."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone *</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
//               <Input
//                 id="whatsappNumber"
//                 type="tel"
//                 value={formData.whatsappNumber}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     whatsappNumber: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Company + Total Value */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 value={formData.company}
//                 onChange={(e) =>
//                   setFormData({ ...formData, company: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="totalValue">Total Value (₹)</Label>
//               <Input
//                 id="totalValue"
//                 type="number"
//                 value={formData.totalValue}
//                 onChange={(e) =>
//                   setFormData({ ...formData, totalValue: e.target.value })
//                 }
//                 min="0"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) =>
//                 setFormData({ ...formData, city: e.target.value })
//               }
//               placeholder="City"
//             />
//             <Input
//               id="state"
//               value={formData.state}
//               onChange={(e) =>
//                 setFormData({ ...formData, state: e.target.value })
//               }
//               placeholder="State"
//             />
//             <Input
//               id="zipCode"
//               value={formData.zipCode}
//               onChange={(e) =>
//                 setFormData({ ...formData, zipCode: e.target.value })
//               }
//               placeholder="ZIP"
//             />
//           </div>

//           {/* Status & Source */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <select
//                 className="border rounded px-3 py-2 text-sm w-full"
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     status: e.target.value as Customer["status"],
//                   })
//                 }
//               >
//                 <option value="prospect">Prospect</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="source">Source</Label>
//               <Input
//                 id="source"
//                 value={formData.source}
//                 onChange={(e) =>
//                   setFormData({ ...formData, source: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* ORDER 1: Service selection + dynamic pricing block */}
//           <div className="space-y-2">
//             <Label>Service</Label>
//             <select
//               className="border rounded px-3 py-2 text-sm w-full"
//               value={formData.serviceType}
//               onChange={handleServiceChange}
//             >
//               <option value="">Select service</option>
//               <option value="whatsapp_api">WhatsApp Business API</option>
//               <option value="website_dev">Website Development</option>
//               <option value="ai_agent">AI Agent</option>
//             </select>
//           </div>

//           {renderServiceFields()}

//           {/* ORDER 2: Invoice Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Invoice Defaults</p>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-1">
//                 <Label>Default Tax Rate (%)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultTaxRate}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultTaxRate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Due Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultDueDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultDueDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Invoice Notes</Label>
//                 <Input
//                   value={formData.defaultInvoiceNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultInvoiceNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ORDER 3: Recurring / Subscription */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Recurring / Subscription</p>
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="recurringEnabled"
//                 checked={formData.recurringEnabled}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     recurringEnabled: checked as boolean,
//                   })
//                 }
//               />
//             <label
//               htmlFor="recurringEnabled"
//               className="text-sm font-medium cursor-pointer"
//             >
//               Enable recurring billing
//             </label>
//             </div>

//             {formData.recurringEnabled && (
//               <div className="grid grid-cols-3 gap-4 mt-2">
//                 <div className="space-y-1">
//                   <Label>Interval</Label>
//                   <select
//                     className="border rounded px-3 py-2 text-sm w-full"
//                     value={formData.recurringInterval}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringInterval: e.target.value as "monthly" | "yearly",
//                       })
//                     }
//                   >
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.recurringAmount}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringAmount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Service Name</Label>
//                   <Input
//                     value={formData.recurringService}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringService: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ORDER 4: Renewal Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Renewal Defaults</p>
//             <div className="grid grid-cols-4 gap-4">
//               <div className="space-y-1">
//                 <Label>Status</Label>
//                 <select
//                   className="border rounded px-3 py-2 text-sm w-full"
//                   value={formData.defaultRenewalStatus}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalStatus: e.target
//                         .value as CustomerFormState["defaultRenewalStatus"],
//                     })
//                   }
//                 >
//                   <option value="active">Active</option>
//                   <option value="expiring">Expiring</option>
//                   <option value="expired">Expired</option>
//                   <option value="renewed">Renewed</option>
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <Label>Reminder Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultRenewalReminderDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalReminderDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1 col-span-2">
//                 <Label>Renewal Notes</Label>
//                 <Input
//                   value={formData.defaultRenewalNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             {/* Next Renewal Date intentionally omitted */}
//           </div>

//           {/* Tags */}
//           <div className="space-y-2">
//             <Label>Tags</Label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant="secondary"
//                   className="flex items-center gap-1"
//                 >
//                   {tag}
//                   <X
//                     className="h-3 w-3 cursor-pointer"
//                     onClick={() => removeTag(tag)}
//                   />
//                 </Badge>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input
//                 value={newTag}
//                 onChange={(e) => setNewTag(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={addTagHandler}
//               >
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Notes (user free text, summary is appended on submit) */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-destructive border border-destructive/30 rounded p-2">
//               {error}
//             </p>
//           )}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? mode === "add"
//                   ? "Adding..."
//                   : "Updating..."
//                 : mode === "add"
//                 ? "Add Customer"
//                 : "Update Customer"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


//testing for newc changes(19-12-2025)


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { X } from "lucide-react"
// import type { Customer } from "@/types/crm"

// interface CustomerDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   customer: Customer | null
//   mode: "add" | "edit"
// }

// type CustomerFormState = {
//   name: string
//   email: string
//   phone: string
//   company: string
//   address: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   status: Customer["status"]
//   source: string
//   notes: string
//   whatsappNumber: string
//   totalValue: string

//   // service & pricing
//   serviceType: "" | "whatsapp_api" | "website_dev" | "ai_agent"
//   onboarding: boolean
//   platformFees: boolean
//   recharge: boolean
//   development: boolean
//   supportMaintenance: boolean
//   hosting: boolean
//   oneTimeCharges: boolean
//   monthlyRecurring: boolean
//   oneTimePrice: string
//   monthlyPrice: string
//   manualPrice: string

//   // invoice defaults
//   defaultTaxRate: string
//   defaultDueDays: string
//   defaultInvoiceNotes: string

//   // recurring
//   recurringEnabled: boolean
//   recurringInterval: "monthly" | "yearly"
//   recurringAmount: string
//   recurringService: string

//   // renewal defaults
//   defaultRenewalStatus: "active" | "expiring" | "expired" | "renewed"
//   defaultRenewalReminderDays: string
//   defaultRenewalNotes: string
// }

// const DEFAULT_FORM: CustomerFormState = {
//   name: "",
//   email: "",
//   phone: "",
//   company: "",
//   address: "",
//   city: "",
//   state: "",
//   zipCode: "",
//   country: "India",
//   status: "prospect",
//   source: "",
//   notes: "",
//   whatsappNumber: "",
//   totalValue: "0",

//   serviceType: "",
//   onboarding: false,
//   platformFees: false,
//   recharge: false,
//   development: false,
//   supportMaintenance: false,
//   hosting: false,
//   oneTimeCharges: true, // treated as selected when service is chosen
//   monthlyRecurring: true, // treated as selected when service is chosen
//   oneTimePrice: "0",
//   monthlyPrice: "0",
//   manualPrice: "0",

//   defaultTaxRate: "",
//   defaultDueDays: "",
//   defaultInvoiceNotes: "",

//   recurringEnabled: false,
//   recurringInterval: "monthly",
//   recurringAmount: "",
//   recurringService: "",

//   defaultRenewalStatus: "active",
//   defaultRenewalReminderDays: "",
//   defaultRenewalNotes: "",
// }

// export function CustomerDialog({
//   open,
//   onOpenChange,
//   customer,
//   mode,
// }: CustomerDialogProps) {
//   const { addCustomer, updateCustomer } = useCRM()
//   const [formData, setFormData] = useState<CustomerFormState>(DEFAULT_FORM)
//   const [tags, setTags] = useState<string[]>([])
//   const [newTag, setNewTag] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const toNumber = (v: string) => {
//     const n = Number(v || 0)
//     return Number.isNaN(n) ? 0 : n
//   }

//   // auto-calc total value based on pricing inputs
//   useEffect(() => {
//     if (!formData.serviceType) return
//     const oneTime = toNumber(formData.oneTimePrice)
//     const monthly = toNumber(formData.monthlyPrice)
//     const manual = toNumber(formData.manualPrice)
//     const total = oneTime + monthly + manual
//     setFormData((prev) => ({
//       ...prev,
//       totalValue: String(total),
//     }))
//   }, [formData.serviceType, formData.oneTimePrice, formData.monthlyPrice, formData.manualPrice])

//   // populate form when editing
//   useEffect(() => {
//     if (customer && mode === "edit") {
//       setFormData({
//         ...DEFAULT_FORM,
//         name: customer.name ?? "",
//         email: customer.email ?? "",
//         phone: customer.phone ?? "",
//         company: customer.company ?? "",
//         address: customer.address ?? "",
//         city: customer.city ?? "",
//         state: customer.state ?? "",
//         zipCode: customer.zipCode ?? "",
//         country: customer.country ?? "India",
//         status: customer.status ?? "prospect",
//         source: customer.source ?? "",
//         notes: customer.notes ?? "",
//         whatsappNumber: customer.whatsappNumber ?? "",
//         totalValue:
//           typeof customer.totalValue === "number"
//             ? String(customer.totalValue)
//             : (customer.totalValue as any) ?? "0",

//         // if you later add customer.serviceType in type, this will still work
//         serviceType:
//           (customer as any).serviceType ??
//           (customer as any).service ??
//           "",

//         defaultTaxRate:
//           customer.defaultTaxRate != null
//             ? String(customer.defaultTaxRate)
//             : "",
//         defaultDueDays:
//           customer.defaultDueDays != null
//             ? String(customer.defaultDueDays)
//             : "",
//         defaultInvoiceNotes: customer.defaultInvoiceNotes ?? "",

//         recurringEnabled: !!customer.recurringEnabled,
//         recurringInterval: customer.recurringInterval ?? "monthly",
//         recurringAmount:
//           customer.recurringAmount != null
//             ? String(customer.recurringAmount)
//             : "",
//         recurringService: customer.recurringService ?? "",

//         defaultRenewalStatus: customer.defaultRenewalStatus ?? "active",
//         defaultRenewalReminderDays:
//           customer.defaultRenewalReminderDays != null
//             ? String(customer.defaultRenewalReminderDays)
//             : "",
//         defaultRenewalNotes: customer.defaultRenewalNotes ?? "",
//       })
//       setTags(Array.isArray(customer.tags) ? customer.tags : [])
//     } else {
//       setFormData(DEFAULT_FORM)
//       setTags([])
//     }
//     setNewTag("")
//     setError(null)
//   }, [customer, mode, open])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!formData.name.trim()) return setError("Name is required.")
//     if (!formData.email.trim()) return setError("Email is required.")
//     if (!formData.phone.trim()) return setError("Phone is required.")

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       return setError("Enter a valid email address.")
//     }

//     const totalValueNumber = Number(formData.totalValue || 0)
//     if (Number.isNaN(totalValueNumber) || totalValueNumber < 0) {
//       return setError("Total value must be a valid non-negative number.")
//     }

//     const serviceName =
//       formData.serviceType === "whatsapp_api"
//         ? "WhatsApp Business API"
//         : formData.serviceType === "website_dev"
//         ? "Website Development"
//         : formData.serviceType === "ai_agent"
//         ? "AI Agent"
//         : ""

//     // Build service details string; pricing model (one-time + monthly) treated as default
//     let serviceDetails = ""
//     if (formData.serviceType) {
//       const selectedItems: string[] = []
//       if (formData.serviceType === "whatsapp_api") {
//         if (formData.onboarding) selectedItems.push("Onboarding")
//         if (formData.platformFees) selectedItems.push("Platform Fees")
//         if (formData.recharge) selectedItems.push("Recharge")
//       } else {
//         if (formData.development) selectedItems.push("Development")
//         if (formData.supportMaintenance)
//           selectedItems.push("Support & Maintenance")
//         if (formData.hosting) selectedItems.push("Hosting")
//       }

//       // pricing model is implicitly both one-time and monthly
//       const chargeTypes: string[] = []
//       if (formData.oneTimeCharges) chargeTypes.push("One-time charges")
//       if (formData.monthlyRecurring) chargeTypes.push("Monthly recurring")

//       serviceDetails = `Service: ${serviceName || "N/A"}
// Selected items: ${selectedItems.join(", ") || "None"}
// Charge types: ${chargeTypes.join(", ") || "None"}
// One-time: ₹${formData.oneTimePrice}
// Monthly: ₹${formData.monthlyPrice}
// Manual price: ₹${formData.manualPrice}`
//     }

//     const defaultTaxRate = formData.defaultTaxRate
//       ? Number(formData.defaultTaxRate)
//       : undefined
//     const defaultDueDays = formData.defaultDueDays
//       ? Number(formData.defaultDueDays)
//       : undefined
//     const recurringAmount = formData.recurringAmount
//       ? Number(formData.recurringAmount)
//       : undefined
//     const defaultRenewalReminderDays = formData.defaultRenewalReminderDays
//       ? Number(formData.defaultRenewalReminderDays)
//       : undefined

//     const summaryLines: string[] = [
//       `Customer name: ${formData.name}`,
//       `Email: ${formData.email}`,
//       `Phone: ${formData.phone}`,
//       `Company: ${formData.company || "N/A"}`,
//       `Status: ${formData.status}`,
//       `Source: ${formData.source || "N/A"}`,
//       `Service: ${serviceName || "N/A"}`,
//       `Invoice defaults: taxRate=${formData.defaultTaxRate || "N/A"}, dueDays=${formData.defaultDueDays || "N/A"}, notes=${formData.defaultInvoiceNotes || "N/A"}`,
//       `Recurring: enabled=${formData.recurringEnabled ? "yes" : "no"}, interval=${formData.recurringInterval}, amount=${formData.recurringAmount || "N/A"}, service=${formData.recurringService || "N/A"}`,
//       `Renewal: status=${formData.defaultRenewalStatus}, reminderDays=${formData.defaultRenewalReminderDays || "N/A"}, notes=${formData.defaultRenewalNotes || "N/A"}`,
//       `Total value: ₹${totalValueNumber}`,
//       `WhatsApp: ${formData.whatsappNumber || "N/A"}`,
//     ]

//     const appendedNotes =
//       (formData.notes ? formData.notes.trim() + "\n\n" : "") +
//       "[Auto summary]\n" +
//       summaryLines.join("\n") +
//       (serviceDetails ? "\n\n" + serviceDetails : "")

//     // IMPORTANT: now include both serviceType and service
//     const customerData: Omit<Customer, "id"> = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       company: formData.company,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       zipCode: formData.zipCode,
//       country: formData.country,
//       status: formData.status,
//       source: formData.source,
//       assignedTo: customer?.assignedTo ?? "",
//       notes: appendedNotes,
//       whatsappNumber: formData.whatsappNumber,
//       totalValue: totalValueNumber,
//       tags,
//       lastContactDate: customer?.lastContactDate,

//       // new fields so DB and UI get them:
//       serviceType: formData.serviceType || undefined,
//       // backend customers table has a `service` column and normalizeCustomer maps raw.service
//       service: serviceName || undefined as any,

//       // you can also persist raw pricing if you add columns later
//       // oneTimePrice, monthlyPrice, manualPrice: not in Customer type yet

//       defaultTaxRate,
//       defaultDueDays,
//       defaultInvoiceNotes: formData.defaultInvoiceNotes || undefined,
//       recurringEnabled: formData.recurringEnabled,
//       recurringInterval: formData.recurringInterval,
//       recurringAmount,
//       recurringService: formData.recurringService || undefined,
//       defaultRenewalStatus: formData.defaultRenewalStatus,
//       defaultRenewalReminderDays,
//       defaultRenewalNotes: formData.defaultRenewalNotes || undefined,

//       createdAt: customer?.createdAt ?? new Date(),
//       updatedAt: new Date(),
//     }

//     setIsSubmitting(true)
//     try {
//       const success =
//         mode === "add"
//           ? await addCustomer(customerData as any)
//           : customer
//           ? await updateCustomer(customer.id, customerData as any)
//           : false

//       if (success) {
//         onOpenChange(false)
//         setFormData(DEFAULT_FORM)
//         setTags([])
//         setNewTag("")
//       } else {
//         setError("Failed to save customer. Try again.")
//       }
//     } catch (err: any) {
//       setError(err?.message ?? "Failed to save customer.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const addTagHandler = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags([...tags, newTag.trim()])
//     }
//     setNewTag("")
//   }

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove))
//   }

//   // when service changes, keep pricing model implicitly enabled
//   const handleServiceChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
//     const newValue = e.target.value as "" | "whatsapp_api" | "website_dev" | "ai_agent"
//     setFormData((prev) => ({
//       ...prev,
//       serviceType: newValue,
//       oneTimeCharges: newValue ? true : prev.oneTimeCharges,
//       monthlyRecurring: newValue ? true : prev.monthlyRecurring,
//     }))
//   }

//   const renderServiceFields = () => {
//     if (!formData.serviceType) return null

//     const serviceSelectedCheckbox = (
//       <div className="flex items-center space-x-2 mb-3">
//         <Checkbox
//           checked={true}
//           className="pointer-events-none opacity-80"
//           aria-readonly="true"
//         />
//         <span className="text-sm text-muted-foreground">
//           Service selected (pricing model applied by default)
//         </span>
//       </div>
//     )

//     if (formData.serviceType === "whatsapp_api") {
//       return (
//         <div className="border rounded-md p-3 space-y-3">
//           {serviceSelectedCheckbox}
//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label className="font-semibold">WhatsApp Business API</Label>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="onboarding"
//                     checked={formData.onboarding}
//                     onCheckedChange={(checked) =>
//                       setFormData({ ...formData, onboarding: checked as boolean })
//                     }
//                   />
//                   <label
//                     htmlFor="onboarding"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Onboarding
//                   </label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="platformFees"
//                     checked={formData.platformFees}
//                     onCheckedChange={(checked) =>
//                       setFormData({
//                         ...formData,
//                         platformFees: checked as boolean,
//                       })
//                     }
//                   />
//                   <label
//                     htmlFor="platformFees"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Platform Fees
//                   </label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="recharge"
//                     checked={formData.recharge}
//                     onCheckedChange={(checked) =>
//                       setFormData({ ...formData, recharge: checked as boolean })
//                     }
//                   />
//                   <label
//                     htmlFor="recharge"
//                     className="text-sm font-medium leading-none cursor-pointer"
//                   >
//                     Recharge
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* pricing model is implicit, so only show numeric fields */}
//             <div className="space-y-2">
//               <Label className="font-semibold">Pricing Summary</Label>
//               <div className="space-y-2">
//                 <div>
//                   <Label>One-time (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.oneTimePrice}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         oneTimePrice: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <Label>Monthly (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.monthlyPrice}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         monthlyPrice: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <Label>Manual Price (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.manualPrice}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         manualPrice: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="border rounded-md p-2 text-sm bg-muted">
//                   <div className="font-semibold">
//                     Total: ₹{toNumber(formData.totalValue)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }

//     // Website Development & AI Agent
//     return (
//       <div className="border rounded-md p-3 space-y-3">
//         {serviceSelectedCheckbox}
//         <div className="grid grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label className="font-semibold">
//               {formData.serviceType === "website_dev"
//                 ? "Website Development"
//                 : "AI Agent"}
//             </Label>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="development"
//                   checked={formData.development}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       development: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="development"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Development
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="supportMaintenance"
//                   checked={formData.supportMaintenance}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       supportMaintenance: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="supportMaintenance"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Support & Maintenance
//                 </label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="hosting"
//                   checked={formData.hosting}
//                   onCheckedChange={(checked) =>
//                     setFormData({
//                       ...formData,
//                       hosting: checked as boolean,
//                     })
//                   }
//                 />
//                 <label
//                   htmlFor="hosting"
//                   className="text-sm font-medium leading-none cursor-pointer"
//                 >
//                   Hosting
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="font-semibold">Pricing Summary</Label>
//             <div className="space-y-2">
//               <div>
//                 <Label>One-time (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.oneTimePrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       oneTimePrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Monthly (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.monthlyPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monthlyPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Manual Price (₹)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.manualPrice}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       manualPrice: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="border rounded-md p-2 text-sm bg-muted">
//                 <div className="font-semibold">
//                   Total: ₹{toNumber(formData.totalValue)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "add" ? "Add New Customer" : "Edit Customer"}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === "add"
//               ? "Add a new customer to your CRM system."
//               : "Update customer information and defaults."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone *</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
//               <Input
//                 id="whatsappNumber"
//                 type="tel"
//                 value={formData.whatsappNumber}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     whatsappNumber: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Company + Total Value */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 value={formData.company}
//                 onChange={(e) =>
//                   setFormData({ ...formData, company: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="totalValue">Total Value (₹)</Label>
//               <Input
//                 id="totalValue"
//                 type="number"
//                 value={formData.totalValue}
//                 onChange={(e) =>
//                   setFormData({ ...formData, totalValue: e.target.value })
//                 }
//                 min="0"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) =>
//                 setFormData({ ...formData, city: e.target.value })
//               }
//               placeholder="City"
//             />
//             <Input
//               id="state"
//               value={formData.state}
//               onChange={(e) =>
//                 setFormData({ ...formData, state: e.target.value })
//               }
//               placeholder="State"
//             />
//             <Input
//               id="zipCode"
//               value={formData.zipCode}
//               onChange={(e) =>
//                 setFormData({ ...formData, zipCode: e.target.value })
//               }
//               placeholder="ZIP"
//             />
//           </div>

//           {/* Status & Source */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <select
//                 className="border rounded px-3 py-2 text-sm w-full"
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     status: e.target.value as Customer["status"],
//                   })
//                 }
//               >
//                 <option value="prospect">Prospect</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="source">Source</Label>
//               <Input
//                 id="source"
//                 value={formData.source}
//                 onChange={(e) =>
//                   setFormData({ ...formData, source: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* ORDER 1: Service selection + dynamic pricing block */}
//           <div className="space-y-2">
//             <Label>Service</Label>
//             <select
//               className="border rounded px-3 py-2 text-sm w-full"
//               value={formData.serviceType}
//               onChange={handleServiceChange}
//             >
//               <option value="">Select service</option>
//               <option value="whatsapp_api">WhatsApp Business API</option>
//               <option value="website_dev">Website Development</option>
//               <option value="ai_agent">AI Agent</option>
//             </select>
//           </div>

//           {renderServiceFields()}

//           {/* ORDER 2: Invoice Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Invoice Defaults</p>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-1">
//                 <Label>Default Tax Rate (%)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultTaxRate}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultTaxRate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Due Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultDueDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultDueDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label>Default Invoice Notes</Label>
//                 <Input
//                   value={formData.defaultInvoiceNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultInvoiceNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ORDER 3: Recurring / Subscription */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Recurring / Subscription</p>
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="recurringEnabled"
//                 checked={formData.recurringEnabled}
//                 onCheckedChange={(checked) =>
//                   setFormData({
//                     ...formData,
//                     recurringEnabled: checked as boolean,
//                   })
//                 }
//               />
//               <label
//                 htmlFor="recurringEnabled"
//                 className="text-sm font-medium cursor-pointer"
//               >
//                 Enable recurring billing
//               </label>
//             </div>

//             {formData.recurringEnabled && (
//               <div className="grid grid-cols-3 gap-4 mt-2">
//                 <div className="space-y-1">
//                   <Label>Interval</Label>
//                   <select
//                     className="border rounded px-3 py-2 text-sm w-full"
//                     value={formData.recurringInterval}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringInterval: e.target.value as "monthly" | "yearly",
//                       })
//                     }
//                   >
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={formData.recurringAmount}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringAmount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Service Name</Label>
//                   <Input
//                     value={formData.recurringService}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         recurringService: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ORDER 4: Renewal Defaults */}
//           <div className="border rounded-md p-3 space-y-3">
//             <p className="text-sm font-semibold">Renewal Defaults</p>
//             <div className="grid grid-cols-4 gap-4">
//               <div className="space-y-1">
//                 <Label>Status</Label>
//                 <select
//                   className="border rounded px-3 py-2 text-sm w-full"
//                   value={formData.defaultRenewalStatus}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalStatus: e.target
//                         .value as CustomerFormState["defaultRenewalStatus"],
//                     })
//                   }
//                 >
//                   <option value="active">Active</option>
//                   <option value="expiring">Expiring</option>
//                   <option value="expired">Expired</option>
//                   <option value="renewed">Renewed</option>
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <Label>Reminder Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.defaultRenewalReminderDays}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalReminderDays: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="space-y-1 col-span-2">
//                 <Label>Renewal Notes</Label>
//                 <Input
//                   value={formData.defaultRenewalNotes}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       defaultRenewalNotes: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             {/* Next Renewal Date intentionally omitted */}
//           </div>

//           {/* Tags */}
//           <div className="space-y-2">
//             <Label>Tags</Label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant="secondary"
//                   className="flex items-center gap-1"
//                 >
//                   {tag}
//                   <X
//                     className="h-3 w-3 cursor-pointer"
//                     onClick={() => removeTag(tag)}
//                   />
//                 </Badge>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input
//                 value={newTag}
//                 onChange={(e) => setNewTag(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={addTagHandler}
//               >
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Notes (user free text, summary is appended on submit) */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-destructive border border-destructive/30 rounded p-2">
//               {error}
//             </p>
//           )}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? mode === "add"
//                   ? "Adding..."
//                   : "Updating..."
//                 : mode === "add"
//                 ? "Add Customer"
//                 : "Update Customer"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

//testing (20-12-2025)
//service checkbox correction
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCRM } from "@/contexts/crm-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import type { Customer } from "@/types/crm"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  mode: "add" | "edit"
}

type CustomerFormState = {
  name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  status: Customer["status"]
  source: string
  notes: string
  whatsappNumber: string
  totalValue: string
  serviceType: "" | "whatsapp_api" | "website_dev" | "ai_agent"
  onboarding: boolean
  platformFees: boolean
  recharge: boolean
  development: boolean
  supportMaintenance: boolean
  hosting: boolean
  oneTimeCharges: boolean
  monthlyRecurring: boolean
  oneTimePrice: string
  monthlyPrice: string
  manualPrice: string
  defaultTaxRate: string
  defaultDueDays: string
  defaultInvoiceNotes: string
  recurringEnabled: boolean
  recurringInterval: "monthly" | "yearly"
  recurringAmount: string
  recurringService: string
  defaultRenewalStatus: "active" | "expiring" | "expired" | "renewed"
  defaultRenewalReminderDays: string
  defaultRenewalNotes: string
}

const DEFAULT_FORM: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  status: "prospect",
  source: "",
  notes: "",
  whatsappNumber: "",
  totalValue: "0",
  serviceType: "",
  onboarding: false,
  platformFees: false,
  recharge: false,
  development: false,
  supportMaintenance: false,
  hosting: false,
  oneTimeCharges: true,
  monthlyRecurring: true,
  oneTimePrice: "0",
  monthlyPrice: "0",
  manualPrice: "0",
  defaultTaxRate: "",
  defaultDueDays: "",
  defaultInvoiceNotes: "",
  recurringEnabled: false,
  recurringInterval: "monthly",
  recurringAmount: "",
  recurringService: "",
  defaultRenewalStatus: "active",
  defaultRenewalReminderDays: "",
  defaultRenewalNotes: "",
}

export function CustomerDialog({ open, onOpenChange, customer, mode }: CustomerDialogProps) {
  const { addCustomer, updateCustomer } = useCRM()
  const [formData, setFormData] = useState<CustomerFormState>(DEFAULT_FORM)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toNumber = (v: string) => {
    const n = Number(v || 0)
    return Number.isNaN(n) ? 0 : n
  }

  useEffect(() => {
    if (!formData.serviceType) return
    const total = toNumber(formData.oneTimePrice) + toNumber(formData.monthlyPrice) + toNumber(formData.manualPrice)
    setFormData((prev) => ({ ...prev, totalValue: String(total) }))
  }, [formData.serviceType, formData.oneTimePrice, formData.monthlyPrice, formData.manualPrice])

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        ...DEFAULT_FORM,
        name: customer.name ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        company: customer.company ?? "",
        address: customer.address ?? "",
        city: customer.city ?? "",
        state: customer.state ?? "",
        zipCode: customer.zipCode ?? "",
        country: customer.country ?? "India",
        status: customer.status ?? "prospect",
        source: customer.source ?? "",
        notes: customer.notes ?? "",
        whatsappNumber: customer.whatsappNumber ?? "",
        totalValue: typeof customer.totalValue === "number" ? String(customer.totalValue) : (customer.totalValue as any) ?? "0",
        serviceType: (customer as any).serviceType ?? (customer as any).service ?? "",
        defaultTaxRate: customer.defaultTaxRate != null ? String(customer.defaultTaxRate) : "",
        defaultDueDays: customer.defaultDueDays != null ? String(customer.defaultDueDays) : "",
        defaultInvoiceNotes: customer.defaultInvoiceNotes ?? "",
        recurringEnabled: !!customer.recurringEnabled,
        recurringInterval: customer.recurringInterval ?? "monthly",
        recurringAmount: customer.recurringAmount != null ? String(customer.recurringAmount) : "",
        recurringService: customer.recurringService ?? "",
        defaultRenewalStatus: customer.defaultRenewalStatus ?? "active",
        defaultRenewalReminderDays: customer.defaultRenewalReminderDays != null ? String(customer.defaultRenewalReminderDays) : "",
        defaultRenewalNotes: customer.defaultRenewalNotes ?? "",
      })
      setTags(Array.isArray(customer.tags) ? customer.tags : [])
    } else {
      setFormData(DEFAULT_FORM)
      setTags([])
    }
    setNewTag("")
    setError(null)
  }, [customer, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!formData.name.trim()) return setError("Name is required.")
    if (!formData.email.trim()) return setError("Email is required.")
    if (!formData.phone.trim()) return setError("Phone is required.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError("Enter a valid email address.")

    const totalValueNumber = Number(formData.totalValue || 0)
    if (Number.isNaN(totalValueNumber) || totalValueNumber < 0) return setError("Total value must be valid.")

    const serviceName =
      formData.serviceType === "whatsapp_api" ? "WhatsApp Business API" :
      formData.serviceType === "website_dev" ? "Website Development" :
      formData.serviceType === "ai_agent" ? "AI Agent" : ""

    let serviceDetails = ""
    if (formData.serviceType) {
      const selectedItems: string[] = []
      if (formData.serviceType === "whatsapp_api") {
        if (formData.onboarding) selectedItems.push("Onboarding")
        if (formData.platformFees) selectedItems.push("Platform Fees")
        if (formData.recharge) selectedItems.push("Recharge")
      } else {
        if (formData.development) selectedItems.push("Development")
        if (formData.supportMaintenance) selectedItems.push("Support & Maintenance")
        if (formData.hosting) selectedItems.push("Hosting")
      }

      serviceDetails = `Service: ${serviceName}
Selected items: ${selectedItems.join(", ") || "None"}
One-time: ₹${formData.oneTimePrice}
Monthly: ₹${formData.monthlyPrice}
Manual: ₹${formData.manualPrice}`
    }

    const appendedNotes = (formData.notes ? formData.notes.trim() + "\n\n" : "") +
      `[Auto summary]
Customer: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || "N/A"}
Status: ${formData.status}
Source: ${formData.source || "N/A"}
Total value: ₹${totalValueNumber}` + (serviceDetails ? "\n\n" + serviceDetails : "")

    const customerData: Omit<Customer, "id"> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      status: formData.status,
      source: formData.source,
      assignedTo: customer?.assignedTo ?? "",
      notes: appendedNotes,
      whatsappNumber: formData.whatsappNumber,
      totalValue: totalValueNumber,
      tags,
      lastContactDate: customer?.lastContactDate,
      serviceType: formData.serviceType || undefined,
      service: serviceName || undefined as any,
      defaultTaxRate: formData.defaultTaxRate ? Number(formData.defaultTaxRate) : undefined,
      defaultDueDays: formData.defaultDueDays ? Number(formData.defaultDueDays) : undefined,
      defaultInvoiceNotes: formData.defaultInvoiceNotes || undefined,
      recurringEnabled: formData.recurringEnabled,
      recurringInterval: formData.recurringInterval,
      recurringAmount: formData.recurringAmount ? Number(formData.recurringAmount) : undefined,
      recurringService: formData.recurringService || undefined,
      defaultRenewalStatus: formData.defaultRenewalStatus,
      defaultRenewalReminderDays: formData.defaultRenewalReminderDays ? Number(formData.defaultRenewalReminderDays) : undefined,
      defaultRenewalNotes: formData.defaultRenewalNotes || undefined,
      createdAt: customer?.createdAt ?? new Date(),
      updatedAt: new Date(),
    }

    setIsSubmitting(true)
    try {
      const success = mode === "add" ? await addCustomer(customerData as any) : customer ? await updateCustomer(customer.id, customerData as any) : false
      if (success) {
        onOpenChange(false)
        setFormData(DEFAULT_FORM)
        setTags([])
        setNewTag("")
      } else {
        setError("Failed to save customer.")
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to save customer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTagHandler = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
    }
    setNewTag("")
  }

  const handleServiceChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const newValue = e.target.value as "" | "whatsapp_api" | "website_dev" | "ai_agent"
    setFormData((prev) => ({
      ...prev,
      serviceType: newValue,
      oneTimeCharges: newValue ? true : prev.oneTimeCharges,
      monthlyRecurring: newValue ? true : prev.monthlyRecurring,
    }))
  }

  const renderServiceFields = () => {
    if (!formData.serviceType) return null

    if (formData.serviceType === "whatsapp_api") {
      return (
        <div className="border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="flex justify-between items-center pb-3 border-b-2 mb-4">
            <h3 className="font-semibold">WhatsApp Business API</h3>
            <span className="text-sm text-muted-foreground">Pricing</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Setup & Platform</p>
              <div className="space-y-2">
                {[
                  { label: "Onboarding" },
                  { label: "Platform Fees" },
                  { label: "Recharge" }
                ].map(({ label }) => (
                  <div key={label} className="bg-white rounded p-2.5 border border-gray-200 text-sm">
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Charges</p>
              <div className="space-y-2">
                {[
                  { label: "One-time (₹)", key: "oneTimePrice" as const, color: "blue" },
                  { label: "Monthly (₹)", key: "monthlyPrice" as const, color: "green" },
                  { label: "Manual (₹)", key: "manualPrice" as const, color: "purple" }
                ].map(({ label, key, color }) => (
                  <div key={key} className={`bg-white rounded p-3 border-l-4 border-${color}-500`}>
                    <Label className="text-xs text-gray-600">{label}</Label>
                    <Input type="number" min="0" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="font-semibold" />
                  </div>
                ))}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded p-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total Value</span>
                    <span className="text-xl font-bold">₹{toNumber(formData.totalValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="flex justify-between items-center pb-3 border-b-2 mb-4">
          <h3 className="font-semibold">{formData.serviceType === "website_dev" ? "Website Development" : "AI Agent"}</h3>
          <span className="text-sm text-muted-foreground">Pricing</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Service Components</p>
            <div className="space-y-2">
              {[
                { label: "Development" },
                { label: "Support & Maintenance" },
                { label: "Hosting" }
              ].map(({ label }) => (
                <div key={label} className="bg-white rounded p-2.5 border border-gray-200 text-sm">
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Charges</p>
            <div className="space-y-2">
              {[
                { label: "One-time (₹)", key: "oneTimePrice" as const, color: "blue" },
                { label: "Monthly (₹)", key: "monthlyPrice" as const, color: "green" },
                { label: "Manual (₹)", key: "manualPrice" as const, color: "purple" }
              ].map(({ label, key, color }) => (
                <div key={key} className={`bg-white rounded p-3 border-l-4 border-${color}-500`}>
                  <Label className="text-xs text-gray-600">{label}</Label>
                  <Input type="number" min="0" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="font-semibold" />
                </div>
              ))}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded p-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Value</span>
                  <span className="text-xl font-bold">₹{toNumber(formData.totalValue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Customer" : "Edit Customer"}</DialogTitle>
          <DialogDescription>{mode === "add" ? "Add a new customer to your CRM system." : "Update customer information."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input id="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalValue">Total Value (₹)</Label>
              <Input id="totalValue" type="number" value={formData.totalValue} onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })} min="0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
            <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State" />
            <Input id="zipCode" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} placeholder="ZIP" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Customer["status"] })}>
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <select className="border rounded px-3 py-2 text-sm w-full" value={formData.serviceType} onChange={handleServiceChange}>
              <option value="">Select service</option>
              <option value="whatsapp_api">WhatsApp Business API</option>
              <option value="website_dev">Website Development</option>
              <option value="ai_agent">AI Agent</option>
            </select>
          </div>
          {renderServiceFields()}
          <div className="border rounded-md p-3 space-y-3">
            <p className="text-sm font-semibold">Invoice Defaults</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Tax Rate (%)</Label>
                <Input type="number" min="0" value={formData.defaultTaxRate} onChange={(e) => setFormData({ ...formData, defaultTaxRate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Due Days</Label>
                <Input type="number" min="0" value={formData.defaultDueDays} onChange={(e) => setFormData({ ...formData, defaultDueDays: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Invoice Notes</Label>
                <Input value={formData.defaultInvoiceNotes} onChange={(e) => setFormData({ ...formData, defaultInvoiceNotes: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="border rounded-md p-3 space-y-3">
            <p className="text-sm font-semibold">Recurring / Subscription</p>
            <div className="flex items-center gap-2">
              <Checkbox id="recurringEnabled" checked={formData.recurringEnabled} onCheckedChange={(checked) => setFormData({ ...formData, recurringEnabled: checked as boolean })} />
              <label htmlFor="recurringEnabled" className="text-sm font-medium cursor-pointer">Enable recurring billing</label>
            </div>
            {formData.recurringEnabled && (
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="space-y-1">
                  <Label>Interval</Label>
                  <select className="border rounded px-3 py-2 text-sm w-full" value={formData.recurringInterval} onChange={(e) => setFormData({ ...formData, recurringInterval: e.target.value as "monthly" | "yearly" })}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Amount (₹)</Label>
                  <Input type="number" min="0" value={formData.recurringAmount} onChange={(e) => setFormData({ ...formData, recurringAmount: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Service Name</Label>
                  <Input value={formData.recurringService} onChange={(e) => setFormData({ ...formData, recurringService: e.target.value })} />
                </div>
              </div>
            )}
          </div>
          <div className="border rounded-md p-3 space-y-3">
            <p className="text-sm font-semibold">Renewal Defaults</p>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label>Status</Label>
                <select className="border rounded px-3 py-2 text-sm w-full" value={formData.defaultRenewalStatus} onChange={(e) => setFormData({ ...formData, defaultRenewalStatus: e.target.value as CustomerFormState["defaultRenewalStatus"] })}>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring</option>
                  <option value="expired">Expired</option>
                  <option value="renewed">Renewed</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Reminder Days</Label>
                <Input type="number" min="0" value={formData.defaultRenewalReminderDays} onChange={(e) => setFormData({ ...formData, defaultRenewalReminderDays: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Renewal Notes</Label>
                <Input value={formData.defaultRenewalNotes} onChange={(e) => setFormData({ ...formData, defaultRenewalNotes: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setTags(tags.filter((t) => t !== tag))} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} />
              <Button type="button" variant="outline" onClick={addTagHandler}>Add</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          {error && <p className="text-sm text-destructive border border-destructive/30 rounded p-2">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (mode === "add" ? "Adding..." : "Updating...") : (mode === "add" ? "Add Customer" : "Update Customer")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}