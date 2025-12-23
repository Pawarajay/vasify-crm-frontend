// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type {
//   Customer,
//   Lead,
//   Deal,
//   Task,
//   Invoice,
//   RenewalReminder,
//   Renewal,
// } from "@/types/crm"
// import {
//   customersApi,
//   leadsApi,
//   dealsApi,
//   tasksApi,
//   invoicesApi,
//   renewalsApi,
// } from "@/lib/api"

// // Add User type
// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// // Only show the part you customized (addInvoice/updateInvoice shape)
// interface CRMContextType {
//   customers: Customer[]
//   leads: Lead[]
//   deals: Deal[]
//   tasks: Task[]
//   invoices: Invoice[]
//   renewalReminders: RenewalReminder[]
//   renewals: Renewal[]
//   users: User[]

//   isLoading: boolean
//   error: string | null

//   addCustomer: (
//     customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
//   deleteCustomer: (id: string) => Promise<boolean>
//   moveCustomerToLead: (id: string) => Promise<boolean>

//   addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>
//   deleteLead: (id: string) => Promise<boolean>
//   convertLead: (id: string, customerData?: any) => Promise<boolean>

//   addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>
//   deleteDeal: (id: string) => Promise<boolean>

//   addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateTask: (id: string, task: Partial<Task>) => Promise<boolean>
//   deleteTask: (id: string) => Promise<boolean>

//   addInvoice: (
//     invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   updateInvoice: (
//     id: string,
//     invoice: Partial<Invoice>,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   deleteInvoice: (id: string) => Promise<boolean>

//   addRenewalReminder: (
//     reminder: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewalReminder: (
//     id: string,
//     reminder: Partial<RenewalReminder>,
//   ) => Promise<boolean>
//   deleteRenewalReminder: (id: string) => Promise<boolean>

//   addRenewal: (
//     renewal: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewal: (id: string, renewal: Partial<Renewal>) => Promise<boolean>
//   deleteRenewal: (id: string) => Promise<boolean>

//   refreshData: () => Promise<void>
//   refreshCustomers: () => Promise<void>
//   refreshLeads: () => Promise<void>
//   refreshDeals: () => Promise<void>
//   refreshTasks: () => Promise<void>
//   refreshInvoices: () => Promise<void>
//   refreshRenewals: () => Promise<void>
//   refreshUsers: () => Promise<void>
// }

// const CRMContext = createContext<CRMContextType | undefined>(undefined)

// // Helpers
// const toDate = (value: unknown): Date | null => {
//   if (!value) return null
//   if (value instanceof Date) return value
//   const d = new Date(value as string)
//   return Number.isNaN(d.getTime()) ? null : d
// }

// // Normalize a raw customer from API/DB into app Customer type
// const normalizeCustomer = (raw: any): Customer => ({
//   id: String(raw.id),
//   name: raw.name,
//   email: raw.email,
//   phone: raw.phone,
//   company: raw.company,
//   address: raw.address,
//   city: raw.city,
//   state: raw.state,
//   zipCode: raw.zip_code ?? raw.zipCode,
//   country: raw.country,
//   status: raw.status,
//   source: raw.source,
//   tags: Array.isArray(raw.tags)
//     ? raw.tags
//     : (() => {
//         try {
//           return raw.tags ? JSON.parse(raw.tags) : []
//         } catch {
//           return []
//         }
//       })(),
//   notes: raw.notes,
//   totalValue:
//     typeof raw.totalValue === "number"
//       ? raw.totalValue
//       : typeof raw.total_value === "number"
//       ? raw.total_value
//       : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
//   lastContactDate:
//     toDate(raw.lastContactDate ?? raw.last_contact_date) ??
//     (raw.lastContactDate ?? raw.last_contact_date),
//   createdAt:
//     toDate(raw.createdAt ?? raw.created_at) ??
//     (raw.createdAt ?? raw.created_at),
//   updatedAt:
//     toDate(raw.updatedAt ?? raw.updated_at) ??
//     (raw.updatedAt ?? raw.updated_at),

//   // NEW: invoice defaults
//   defaultTaxRate:
//     typeof raw.default_tax_rate === "number"
//       ? raw.default_tax_rate
//       : typeof raw.defaultTaxRate === "number"
//       ? raw.defaultTaxRate
//       : raw.default_tax_rate != null || raw.defaultTaxRate != null
//       ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
//       : undefined,
//   defaultDueDays:
//     typeof raw.default_due_days === "number"
//       ? raw.default_due_days
//       : typeof raw.defaultDueDays === "number"
//       ? raw.defaultDueDays
//       : raw.default_due_days != null || raw.defaultDueDays != null
//       ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
//       : undefined,
//   defaultInvoiceNotes:
//     raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

//   // NEW: recurring / subscription info
//   recurringEnabled:
//     raw.recurring_enabled ?? raw.recurringEnabled ?? false,
//   recurringInterval:
//     raw.recurring_interval ?? raw.recurringInterval ?? null,
//   recurringAmount:
//     typeof raw.recurring_amount === "number"
//       ? raw.recurring_amount
//       : typeof raw.recurringAmount === "number"
//       ? raw.recurringAmount
//       : raw.recurring_amount != null || raw.recurringAmount != null
//       ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
//       : undefined,
//   recurringService:
//     raw.recurring_service ?? raw.recurringService ?? null,

//   // NEW: renewal defaults
//   defaultRenewalStatus:
//     raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
//   defaultRenewalReminderDays:
//     typeof raw.default_renewal_reminder_days === "number"
//       ? raw.default_renewal_reminder_days
//       : typeof raw.defaultRenewalReminderDays === "number"
//       ? raw.defaultRenewalReminderDays
//       : raw.default_renewal_reminder_days != null ||
//         raw.defaultRenewalReminderDays != null
//       ? Number(
//           raw.default_renewal_reminder_days ??
//             raw.defaultRenewalReminderDays ??
//             0,
//         )
//       : undefined,
//   defaultRenewalNotes:
//     raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
//   nextRenewalDate:
//     toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
//     (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
// })

// export function CRMProvider({ children }: { children: React.ReactNode }) {
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [leads, setLeads] = useState<Lead[]>([])
//   const [deals, setDeals] = useState<Deal[]>([])
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>(
//     [],
//   )
//   const [renewals, setRenewals] = useState<Renewal[]>([])
//   const [users, setUsers] = useState<User[]>([])

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     void refreshData()
//   }, [])

//   const refreshData = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       await Promise.all([
//         refreshCustomers(),
//         refreshLeads(),
//         refreshDeals(),
//         refreshTasks(),
//         refreshInvoices(),
//         refreshRenewals(),
//         refreshUsers(),
//       ])
//     } catch (err) {
//       console.error("Failed to load CRM data:", err)
//       setError(
//         err instanceof Error ? err.message : "Failed to load CRM data",
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshUsers = async () => {
//     try {
//       const response = await fetch(
//         `${
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
//         }/api/users`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       )

//       if (response.ok) {
//         const data = await response.json()
//         setUsers(data.users || [])
//       }
//     } catch (err) {
//       console.error("Failed to fetch users:", err)
//       setUsers([
//         {
//           id: "user1",
//           name: "Default User",
//           email: "user@example.com",
//           role: "admin",
//         },
//       ])
//     }
//   }

//   const refreshCustomers = async () => {
//     try {
//       const response = await customersApi.getAll({ limit: 100 })
//       const list = (response.customers || []) as any[]
//       setCustomers(list.map((c) => normalizeCustomer(c)))
//     } catch (err) {
//       console.error("Failed to fetch customers:", err)
//       throw err
//     }
//   }

//   const refreshLeads = async () => {
//     try {
//       const response = await leadsApi.getAll({ limit: 100 })
//       const list = (response.leads || []) as Lead[]
//       setLeads(
//         list.map((l) => ({
//           ...l,
//           createdAt: toDate(l.createdAt) ?? l.createdAt,
//           updatedAt: toDate(l.updatedAt) ?? l.updatedAt,
//           lastContactDate: toDate(l.lastContactDate) ?? l.lastContactDate,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch leads:", err)
//       throw err
//     }
//   }

//   const refreshDeals = async () => {
//     try {
//       const response = await dealsApi.getAll({ limit: 100 })
//       const list = (response.deals || []) as Deal[]
//       setDeals(
//         list.map((d) => ({
//           ...d,
//           createdAt: toDate(d.createdAt) ?? d.createdAt,
//           updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//           expectedCloseDate:
//             toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           value:
//             typeof d.value === "number" ? d.value : Number(d.value ?? 0) || 0,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch deals:", err)
//       throw err
//     }
//   }

//   const refreshTasks = async () => {
//     try {
//       const response = await tasksApi.getAll({ limit: 100 })
//       const list = (response.tasks || []) as Task[]
//       setTasks(
//         list.map((t) => ({
//           ...t,
//           createdAt: toDate(t.createdAt) ?? t.createdAt,
//           updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           dueDate: toDate(t.dueDate) ?? t.dueDate,
//           completedAt: toDate(t.completedAt) ?? t.completedAt,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err)
//       throw err
//     }
//   }

//   const refreshInvoices = async () => {
//     try {
//       const response = await invoicesApi.getAll({ limit: 100 })
//       const list = (response.invoices || []) as any[]

//       setInvoices(
//         list.map((inv) => ({
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? inv.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? inv.issueDate) ??
//             (inv.created_at ?? inv.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? inv.dueDate) ??
//             (inv.due_date ?? inv.dueDate),
//           status: inv.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : Number(inv.amount ?? 0) || 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : Number(inv.tax ?? 0) || 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : Number(inv.discount ?? 0) || 0,
//           notes: inv.notes ?? "",
//           items: Array.isArray(inv.items) ? inv.items : [],
//           createdAt:
//             toDate(inv.created_at ?? inv.createdAt) ??
//             (inv.created_at ?? inv.createdAt),
//           updatedAt:
//             toDate(inv.updated_at ?? inv.updatedAt) ??
//             (inv.updated_at ?? inv.updatedAt),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch invoices:", err)
//       throw err
//     }
//   }

//   const refreshRenewals = async () => {
//     try {
//       const [renewalsResponse, remindersResponse] = await Promise.all([
//         renewalsApi.getAll({ limit: 100 }),
//         renewalsApi.getReminders(),
//       ])

//       const renewalsList = (renewalsResponse.renewals || []) as Renewal[]
//       const remindersList = (remindersResponse.reminders || []) as RenewalReminder[]

//       setRenewals(
//         renewalsList.map((r) => ({
//           ...r,
//           createdAt: toDate(r.createdAt) ?? r.createdAt,
//           updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           startDate: toDate(r.startDate) ?? r.startDate,
//           endDate: toDate(r.endDate) ?? r.endDate,
//           amount:
//             typeof r.amount === "number"
//               ? r.amount
//               : Number(r.amount ?? 0) || 0,
//         })),
//       )

//       setRenewalReminders(
//         remindersList.map((rr) => ({
//           ...rr,
//           createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//           updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           expiryDate: toDate(rr.expiryDate) ?? rr.expiryDate,
//           lastReminderSent:
//             toDate(rr.lastReminderSent) ?? rr.lastReminderSent,
//           reminderDays: Array.isArray(rr.reminderDays)
//             ? rr.reminderDays
//             : (() => {
//                 try {
//                   return JSON.parse(
//                     (rr.reminderDays as unknown as string) || "[]",
//                   ) as number[]
//                 } catch {
//                   return []
//                 }
//               })(),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch renewals:", err)
//       throw err
//     }
//   }

//   // Customer CRUD
//   const addCustomer = async (
//     customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const payload = {
//         ...customerData,
//         totalValue:
//           customerData.totalValue !== undefined &&
//           customerData.totalValue !== null &&
//           customerData.totalValue !== ""
//             ? Number(customerData.totalValue)
//             : 0,
//       }

//       const response = await customersApi.create(payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) => [c, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add customer:", err)
//       throw err
//     }
//   }

//   const updateCustomer = async (
//     id: string,
//     customerData: Partial<Customer>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...customerData }
//       if ("totalValue" in payload) {
//         const v = payload.totalValue
//         payload.totalValue =
//           v !== undefined && v !== null && v !== "" ? Number(v) : 0
//       }

//       const response = await customersApi.update(id, payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) =>
//           prev.map((customer) => (customer.id === id ? c : customer)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update customer:", err)
//       throw err
//     }
//   }

//   const deleteCustomer = async (id: string): Promise<boolean> => {
//     try {
//       await customersApi.delete(id)
//       setCustomers((prev) => prev.filter((customer) => customer.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete customer:", err)
//       return false
//     }
//   }

//   // NEW: Move customer back to lead
//   const moveCustomerToLead = async (id: string): Promise<boolean> => {
//     try {
//       // Find the customer
//       const customer = customers.find((c) => c.id === id)
//       if (!customer) {
//         console.error("Customer not found")
//         return false
//       }

//       // Create lead data from customer
//       const leadData: Omit<Lead, "id" | "createdAt" | "updatedAt"> = {
//         name: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         company: customer.company || "",
//         status: "new",
//         source: customer.source || "",
//         assignedTo: "",
//         notes: customer.notes || "",
//         tags: customer.tags || [],
//         lastContactDate: customer.lastContactDate,
//       }

//       // Add as a new lead
//       const leadResponse = await leadsApi.create(leadData)
      
//       if (leadResponse.lead) {
//         // Delete the customer
//         await customersApi.delete(id)
        
//         // Update local state
//         const newLead = leadResponse.lead as Lead
//         setLeads((prev) => [
//           {
//             ...newLead,
//             createdAt: toDate(newLead.createdAt) ?? newLead.createdAt,
//             updatedAt: toDate(newLead.updatedAt) ?? newLead.updatedAt,
//           },
//           ...prev,
//         ])
//         setCustomers((prev) => prev.filter((customer) => customer.id !== id))
        
//         return true
//       }
      
//       return false
//     } catch (err) {
//       console.error("Failed to move customer to lead:", err)
//       return false
//     }
//   }

//   // Lead CRUD (unchanged)
//   const addLead = async (
//     leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.create(leadData)
//       if (response.lead) {
//         const l = response.lead as Lead
//         setLeads((prev) => [
//           ...prev,
//           { ...l, createdAt: toDate(l.createdAt) ?? l.createdAt },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add lead:", err)
//       return false
//     }
//   }

//   const updateLead = async (
//     id: string,
//     leadData: Partial<Lead>,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.update(id, leadData)
//       if (response.lead) {
//         const l = response.lead as Lead
//         setLeads((prev) =>
//           prev.map((lead) =>
//             lead.id === id
//               ? {
//                   ...l,
//                   createdAt: toDate(l.createdAt) ?? l.createdAt,
//                   updatedAt: toDate(l.updatedAt) ?? l.updatedAt,
//                 }
//               : lead,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update lead:", err)
//       return false
//     }
//   }

//   const deleteLead = async (id: string): Promise<boolean> => {
//     try {
//       await leadsApi.delete(id)
//       setLeads((prev) => prev.filter((lead) => lead.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete lead:", err)
//       return false
//     }
//   }

//   const convertLead = async (
//     id: string,
//     customerData?: any,
//   ): Promise<boolean> => {
//     try {
//       // Mark customer as coming from lead
//       const dataWithFlag = {
//         ...customerData,
//         fromLead: true,
//       }
      
//       const response = await leadsApi.convertToCustomer(id, dataWithFlag)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         // Add fromLead flag to customer
//         const customerWithFlag = { ...c, fromLead: true } as any
        
//         setLeads((prev) => prev.filter((lead) => lead.id !== id))
//         setCustomers((prev) => [...prev, customerWithFlag])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to convert lead:", err)
//       return false
//     }
//   }

//   // Deal CRUD (unchanged)
//   const addDeal = async (
//     dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData = {
//         ...dealData,
//         expectedCloseDate: dealData.expectedCloseDate
//           ? dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//           : null,
//         ...(dealData.actualCloseDate && {
//           actualCloseDate:
//             dealData.actualCloseDate instanceof Date
//               ? dealData.actualCloseDate.toISOString()
//               : dealData.actualCloseDate,
//         }),
//         products: Array.isArray(dealData.products)
//           ? dealData.products
//           : [],
//       }

//       const response = await dealsApi.create(formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) => [
//           ...prev,
//           {
//             ...d,
//             createdAt: toDate(d.createdAt) ?? d.createdAt,
//             updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//             expectedCloseDate:
//               toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add deal:", err)
//       return false
//     }
//   }

//   const updateDeal = async (
//     id: string,
//     dealData: Partial<Deal>,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData: any = { ...dealData }

//       if (dealData.expectedCloseDate) {
//         formattedDealData.expectedCloseDate =
//           dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//       }

//       if (dealData.actualCloseDate) {
//         formattedDealData.actualCloseDate =
//           dealData.actualCloseDate instanceof Date
//             ? dealData.actualCloseDate.toISOString()
//             : dealData.actualCloseDate
//       }

//       const response = await dealsApi.update(id, formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) =>
//           prev.map((deal) =>
//             deal.id === id
//               ? {
//                   ...d,
//                   createdAt: toDate(d.createdAt) ?? d.createdAt,
//                   updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//                   expectedCloseDate:
//                     toDate(d.expectedCloseDate) ??
//                     d.expectedCloseDate,
//                 }
//               : deal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update deal:", err)
//       return false
//     }
//   }

//   const deleteDeal = async (id: string): Promise<boolean> => {
//     try {
//       await dealsApi.delete(id)
//       setDeals((prev) => prev.filter((deal) => deal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete deal:", err)
//       return false
//     }
//   }

//   // Task CRUD (unchanged)
//   const addTask = async (
//     taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.create(taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) => [
//           ...prev,
//           {
//             ...t,
//             createdAt: toDate(t.createdAt) ?? t.createdAt,
//             updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add task:", err)
//       return false
//     }
//   }

//   const updateTask = async (
//     id: string,
//     taskData: Partial<Task>,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.update(id, taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.id === id
//               ? {
//                   ...t,
//                   createdAt: toDate(t.createdAt) ?? t.createdAt,
//                   updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//                 }
//               : task,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update task:", err)
//       return false
//     }
//   }

//   const deleteTask = async (id: string): Promise<boolean> => {
//     try {
//       await tasksApi.delete(id)
//       setTasks((prev) => prev.filter((task) => task.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete task:", err)
//       return false
//     }
//   }

//   // Invoice CRUD (existing, with apiPayload support)
//   const addInvoice = async (
//     invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           return {
//             customerId: invoiceData.customerId,
//             amount: subtotal,
//             tax: taxNumber,
//             total,
//             status: invoiceData.status,
//             dueDate: invoiceData.dueDate,
//             items:
//               invoiceData.items?.map((it) => ({
//                 description: it.description,
//                 quantity: it.quantity,
//                 rate: it.rate,
//                 amount: it.amount,
//               })) ?? [],
//             notes: invoiceData.notes,
//           }
//         })()

//       const response = await invoicesApi.create(payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? invoiceData.invoiceNumber,
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at ?? new Date()) ?? new Date(),
//           updatedAt:
//             toDate(inv.updated_at ?? new Date()) ?? new Date(),
//         }

//         setInvoices((prev) => [normalized, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add invoice:", err)
//       return false
//     }
//   }

//   const updateInvoice = async (
//     id: string,
//     invoiceData: Partial<Invoice>,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           const base: any = {}

//           if (invoiceData.customerId) base.customerId = invoiceData.customerId
//           if (subtotal !== undefined) base.amount = subtotal
//           if (taxNumber !== undefined) base.tax = taxNumber
//           base.total = total
//           if (invoiceData.status) base.status = invoiceData.status
//           if (invoiceData.dueDate) base.dueDate = invoiceData.dueDate
//           if (invoiceData.notes !== undefined) base.notes = invoiceData.notes

//           if (invoiceData.items) {
//             base.items = invoiceData.items.map((it) => ({
//               description: it.description,
//               quantity: it.quantity,
//               rate: it.rate,
//               amount: it.amount,
//             }))
//           }

//           return base
//         })()

//       const response = await invoicesApi.update(id, payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status ?? "draft",
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount ?? 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax ?? 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at) ??
//             invoiceData.createdAt ??
//             new Date(),
//           updatedAt:
//             toDate(inv.updated_at) ?? new Date(),
//         }

//         setInvoices((prev) =>
//           prev.map((invoice) => (invoice.id === id ? normalized : invoice)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update invoice:", err)
//       return false
//     }
//   }

//   const deleteInvoice = async (id: string): Promise<boolean> => {
//     try {
//       await invoicesApi.delete(id)
//       setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete invoice:", err)
//       return false
//     }
//   }

//   // Renewal reminder CRUD (partial)
//   const addRenewalReminder = async (
//     reminderData: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.createReminder(reminderData)
//       if (response.reminder) {
//         const rr = response.reminder as RenewalReminder
//         setRenewalReminders((prev) => [
//           ...prev,
//           {
//             ...rr,
//             createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//             updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal reminder:", err)
//       return false
//     }
//   }

//   const updateRenewalReminder = async (
//     _id: string,
//     _reminderData: Partial<RenewalReminder>,
//   ): Promise<boolean> => {
//     console.warn("Update renewal reminder not implemented in backend yet")
//     return false
//   }

//   const deleteRenewalReminder = async (_id: string): Promise<boolean> => {
//     console.warn("Delete renewal reminder not implemented in backend yet")
//     return false
//   }

//   // Renewal CRUD (unchanged)
//   const addRenewal = async (
//     renewalData: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.create(renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) => [
//           ...prev,
//           {
//             ...r,
//             createdAt: toDate(r.createdAt) ?? r.createdAt,
//             updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal:", err)
//       return false
//     }
//   }

//   const updateRenewal = async (
//     id: string,
//     renewalData: Partial<Renewal>,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.update(id, renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) =>
//           prev.map((renewal) =>
//             renewal.id === id
//               ? {
//                   ...r,
//                   createdAt: toDate(r.createdAt) ?? r.createdAt,
//                   updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//                 }
//               : renewal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update renewal:", err)
//       return false
//     }
//   }

//   const deleteRenewal = async (id: string): Promise<boolean> => {
//     try {
//       await renewalsApi.delete(id)
//       setRenewals((prev) => prev.filter((renewal) => renewal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete renewal:", err)
//       return false
//     }
//   }

//   const value: CRMContextType = {
//     customers,
//     leads,
//     deals,
//     tasks,
//     invoices,
//     renewalReminders,
//     renewals,
//     users,
//     isLoading,
//     error,
//     addCustomer,
//     updateCustomer,
//     deleteCustomer,
//     moveCustomerToLead,
//     addLead,
//     updateLead,
//     deleteLead,
//     convertLead,
//     addDeal,
//     updateDeal,
//     deleteDeal,
//     addTask,
//     updateTask,
//     deleteTask,
//     addInvoice,
//     updateInvoice,
//     deleteInvoice,
//     addRenewalReminder,
//     updateRenewalReminder,
//     deleteRenewalReminder,
//     addRenewal,
//     updateRenewal,
//     deleteRenewal,
//     refreshData,
//     refreshCustomers,
//     refreshLeads,
//     refreshDeals,
//     refreshTasks,
//     refreshInvoices,
//     refreshRenewals,
//     refreshUsers,
//   }

//   return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
// }

// export function useCRM() {
//   const context = useContext(CRMContext)
//   if (context === undefined) {
//     throw new Error("useCRM must be used within a CRMProvider")
//   }
//   return context
// }

//testing for new changs (16-12-2025)

// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type {
//   Customer,
//   Lead,
//   Deal,
//   Task,
//   Invoice,
//   RenewalReminder,
//   Renewal,
// } from "@/types/crm"
// import {
//   customersApi,
//   leadsApi,
//   dealsApi,
//   tasksApi,
//   invoicesApi,
//   renewalsApi,
// } from "@/lib/api"

// // Add User type
// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// // Context type
// interface CRMContextType {
//   customers: Customer[]
//   leads: Lead[]
//   deals: Deal[]
//   tasks: Task[]
//   invoices: Invoice[]
//   renewalReminders: RenewalReminder[]
//   renewals: Renewal[]
//   users: User[]

//   isLoading: boolean
//   error: string | null

//   addCustomer: (
//     customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
//   deleteCustomer: (id: string) => Promise<boolean>
//   moveCustomerToLead: (id: string) => Promise<boolean>

//   addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>
//   deleteLead: (id: string) => Promise<boolean>
//   convertLead: (id: string, customerData?: any) => Promise<boolean>

//   addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>
//   deleteDeal: (id: string) => Promise<boolean>

//   addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateTask: (id: string, task: Partial<Task>) => Promise<boolean>
//   deleteTask: (id: string) => Promise<boolean>

//   addInvoice: (
//     invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   updateInvoice: (
//     id: string,
//     invoice: Partial<Invoice>,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   deleteInvoice: (id: string) => Promise<boolean>

//   addRenewalReminder: (
//     reminder: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewalReminder: (
//     id: string,
//     reminder: Partial<RenewalReminder>,
//   ) => Promise<boolean>
//   deleteRenewalReminder: (id: string) => Promise<boolean>

//   addRenewal: (
//     renewal: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewal: (id: string, renewal: Partial<Renewal>) => Promise<boolean>
//   deleteRenewal: (id: string) => Promise<boolean>

//   refreshData: () => Promise<void>
//   refreshCustomers: () => Promise<void>
//   refreshLeads: () => Promise<void>
//   refreshDeals: () => Promise<void>
//   refreshTasks: () => Promise<void>
//   refreshInvoices: () => Promise<void>
//   refreshRenewals: () => Promise<void>
//   refreshUsers: () => Promise<void>
// }

// const CRMContext = createContext<CRMContextType | undefined>(undefined)

// // Helpers
// const toDate = (value: unknown): Date | null => {
//   if (!value) return null
//   if (value instanceof Date) return value
//   const d = new Date(value as string)
//   return Number.isNaN(d.getTime()) ? null : d
// }

// // Normalize a raw customer from API/DB into app Customer type
// const normalizeCustomer = (raw: any): Customer => ({
//   id: String(raw.id),
//   name: raw.name,
//   email: raw.email,
//   phone: raw.phone,
//   company: raw.company,
//   address: raw.address,
//   city: raw.city,
//   state: raw.state,
//   zipCode: raw.zip_code ?? raw.zipCode,
//   country: raw.country,
//   status: raw.status,
//   source: raw.source,
//   tags: Array.isArray(raw.tags)
//     ? raw.tags
//     : (() => {
//         try {
//           return raw.tags ? JSON.parse(raw.tags) : []
//         } catch {
//           return []
//         }
//       })(),
//   notes: raw.notes,
//   totalValue:
//     typeof raw.totalValue === "number"
//       ? raw.totalValue
//       : typeof raw.total_value === "number"
//       ? raw.total_value
//       : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
//   lastContactDate:
//     toDate(raw.lastContactDate ?? raw.last_contact_date) ??
//     (raw.lastContactDate ?? raw.last_contact_date),
//   createdAt:
//     toDate(raw.createdAt ?? raw.created_at) ??
//     (raw.createdAt ?? raw.created_at),
//   updatedAt:
//     toDate(raw.updatedAt ?? raw.updated_at) ??
//     (raw.updatedAt ?? raw.updated_at),

//   // invoice defaults
//   defaultTaxRate:
//     typeof raw.default_tax_rate === "number"
//       ? raw.default_tax_rate
//       : typeof raw.defaultTaxRate === "number"
//       ? raw.defaultTaxRate
//       : raw.default_tax_rate != null || raw.defaultTaxRate != null
//       ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
//       : undefined,
//   defaultDueDays:
//     typeof raw.default_due_days === "number"
//       ? raw.default_due_days
//       : typeof raw.defaultDueDays === "number"
//       ? raw.defaultDueDays
//       : raw.default_due_days != null || raw.defaultDueDays != null
//       ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
//       : undefined,
//   defaultInvoiceNotes:
//     raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

//   // recurring / subscription info
//   recurringEnabled:
//     raw.recurring_enabled ?? raw.recurringEnabled ?? false,
//   recurringInterval:
//     raw.recurring_interval ?? raw.recurringInterval ?? null,
//   recurringAmount:
//     typeof raw.recurring_amount === "number"
//       ? raw.recurring_amount
//       : typeof raw.recurringAmount === "number"
//       ? raw.recurringAmount
//       : raw.recurring_amount != null || raw.recurringAmount != null
//       ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
//       : undefined,
//   recurringService:
//     raw.recurring_service ?? raw.recurringService ?? null,

//   // renewal defaults
//   defaultRenewalStatus:
//     raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
//   defaultRenewalReminderDays:
//     typeof raw.default_renewal_reminder_days === "number"
//       ? raw.default_renewal_reminder_days
//       : typeof raw.defaultRenewalReminderDays === "number"
//       ? raw.defaultRenewalReminderDays
//       : raw.default_renewal_reminder_days != null ||
//         raw.defaultRenewalReminderDays != null
//       ? Number(
//           raw.default_renewal_reminder_days ??
//             raw.defaultRenewalReminderDays ??
//             0,
//         )
//       : undefined,
//   defaultRenewalNotes:
//     raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
//   nextRenewalDate:
//     toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
//     (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
// })

// export function CRMProvider({ children }: { children: React.ReactNode }) {
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [leads, setLeads] = useState<Lead[]>([])
//   const [deals, setDeals] = useState<Deal[]>([])
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>([])
//   const [renewals, setRenewals] = useState<Renewal[]>([])
//   const [users, setUsers] = useState<User[]>([])

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     void refreshData()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const refreshData = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       await Promise.all([
//         refreshCustomers(),
//         refreshLeads(),
//         refreshDeals(),
//         refreshTasks(),
//         refreshInvoices(),
//         refreshRenewals(),
//         refreshUsers(),
//       ])
//     } catch (err) {
//       console.error("Failed to load CRM data:", err)
//       setError(
//         err instanceof Error ? err.message : "Failed to load CRM data",
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshUsers = async () => {
//     try {
//       const response = await fetch(
//         `${
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
//         }/api/users`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       )

//       if (response.ok) {
//         const data = await response.json()
//         setUsers(data.users || [])
//       }
//     } catch (err) {
//       console.error("Failed to fetch users:", err)
//       setUsers([
//         {
//           id: "user1",
//           name: "Default User",
//           email: "user@example.com",
//           role: "admin",
//         },
//       ])
//     }
//   }

//   const refreshCustomers = async () => {
//     try {
//       const response = await customersApi.getAll({ limit: 100 })
//       const list = (response.customers || []) as any[]
//       setCustomers(list.map((c) => normalizeCustomer(c)))
//     } catch (err) {
//       console.error("Failed to fetch customers:", err)
//       throw err
//     }
//   }

//   const refreshLeads = async () => {
//     try {
//       const response = await leadsApi.getAll({ limit: 100 })
//       const list = (response.leads || []) as Lead[]
//       setLeads(
//         list.map((l) => ({
//           ...l,
//           createdAt: toDate(l.createdAt) ?? l.createdAt,
//           updatedAt: toDate(l.updatedAt) ?? l.updatedAt,
//           lastContactDate: toDate(l.lastContactDate) ?? l.lastContactDate,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch leads:", err)
//       throw err
//     }
//   }

//   const refreshDeals = async () => {
//     try {
//       const response = await dealsApi.getAll({ limit: 100 })
//       const list = (response.deals || []) as Deal[]
//       setDeals(
//         list.map((d) => ({
//           ...d,
//           createdAt: toDate(d.createdAt) ?? d.createdAt,
//           updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//           expectedCloseDate:
//             toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           value:
//             typeof d.value === "number" ? d.value : Number(d.value ?? 0) || 0,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch deals:", err)
//       throw err
//     }
//   }

//   const refreshTasks = async () => {
//     try {
//       const response = await tasksApi.getAll({ limit: 100 })
//       const list = (response.tasks || []) as Task[]
//       setTasks(
//         list.map((t) => ({
//           ...t,
//           createdAt: toDate(t.createdAt) ?? t.createdAt,
//           updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           dueDate: toDate(t.dueDate) ?? t.dueDate,
//           completedAt: toDate(t.completedAt) ?? t.completedAt,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err)
//       throw err
//     }
//   }

//   const refreshInvoices = async () => {
//     try {
//       const response = await invoicesApi.getAll({ limit: 100 })
//       const list = (response.invoices || []) as any[]

//       setInvoices(
//         list.map((inv) => ({
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? inv.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? inv.issueDate) ??
//             (inv.created_at ?? inv.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? inv.dueDate) ??
//             (inv.due_date ?? inv.dueDate),
//           status: inv.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : Number(inv.amount ?? 0) || 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : Number(inv.tax ?? 0) || 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : Number(inv.discount ?? 0) || 0,
//           notes: inv.notes ?? "",
//           items: Array.isArray(inv.items) ? inv.items : [],
//           createdAt:
//             toDate(inv.created_at ?? inv.createdAt) ??
//             (inv.created_at ?? inv.createdAt),
//           updatedAt:
//             toDate(inv.updated_at ?? inv.updatedAt) ??
//             (inv.updated_at ?? inv.updatedAt),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch invoices:", err)
//       throw err
//     }
//   }

//   const refreshRenewals = async () => {
//     try {
//       const [renewalsResponse, remindersResponse] = await Promise.all([
//         renewalsApi.getAll({ limit: 100 }),
//         renewalsApi.getReminders(),
//       ])

//       const renewalsList = (renewalsResponse.renewals || []) as Renewal[]
//       const remindersList = (remindersResponse.reminders || []) as RenewalReminder[]

//       setRenewals(
//         renewalsList.map((r) => ({
//           ...r,
//           createdAt: toDate(r.createdAt) ?? r.createdAt,
//           updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           startDate: toDate(r.startDate) ?? r.startDate,
//           endDate: toDate(r.endDate) ?? r.endDate,
//           amount:
//             typeof r.amount === "number"
//               ? r.amount
//               : Number(r.amount ?? 0) || 0,
//         })),
//       )

//       setRenewalReminders(
//         remindersList.map((rr) => ({
//           ...rr,
//           createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//           updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           expiryDate: toDate(rr.expiryDate) ?? rr.expiryDate,
//           lastReminderSent:
//             toDate(rr.lastReminderSent) ?? rr.lastReminderSent,
//           reminderDays: Array.isArray(rr.reminderDays)
//             ? rr.reminderDays
//             : (() => {
//                 try {
//                   return JSON.parse(
//                     (rr.reminderDays as unknown as string) || "[]",
//                   ) as number[]
//                 } catch {
//                   return []
//                 }
//               })(),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch renewals:", err)
//       throw err
//     }
//   }

//   // Customer CRUD
//   const addCustomer = async (
//     customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const payload = {
//         ...customerData,
//         totalValue:
//           customerData.totalValue !== undefined &&
//           customerData.totalValue !== null &&
//           customerData.totalValue !== ""
//             ? Number(customerData.totalValue)
//             : 0,
//       }

//       const response = await customersApi.create(payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) => [c, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add customer:", err)
//       throw err
//     }
//   }

//   const updateCustomer = async (
//     id: string,
//     customerData: Partial<Customer>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...customerData }
//       if ("totalValue" in payload) {
//         const v = payload.totalValue
//         payload.totalValue =
//           v !== undefined && v !== null && v !== "" ? Number(v) : 0
//       }

//       const response = await customersApi.update(id, payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) =>
//           prev.map((customer) => (customer.id === id ? c : customer)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update customer:", err)
//       throw err
//     }
//   }

//   const deleteCustomer = async (id: string): Promise<boolean> => {
//     try {
//       await customersApi.delete(id)
//       setCustomers((prev) => prev.filter((customer) => customer.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete customer:", err)
//       return false
//     }
//   }

//   // Move customer back to lead
//  // Move customer back to lead WITHOUT deleting (keeps deals/invoices intact)
// const moveCustomerToLead = async (id: string): Promise<boolean> => {
//   try {
//     const customer = customers.find((c) => c.id === id)
//     if (!customer) {
//       console.error("Customer not found")
//       return false
//     }

//     // 1) Create lead from customer
//     const leadData: Omit<Lead, "id" | "createdAt" | "updatedAt"> = {
//       name: customer.name,
//       email: customer.email,
//       phone: customer.phone,
//       company: customer.company || "",
//       status: "new",
//       source: customer.source || "",
//       assignedTo: customer.assignedTo || "", // or "" if not in type
//       notes: (customer.notes || "") + "\n\n[Auto] Restored from customer.",
//       tags: customer.tags || [],
//       lastContactDate: customer.lastContactDate,
//     }

//     const leadResponse = await leadsApi.create(leadData)

//     if (!leadResponse.lead) {
//       console.error("Failed to create lead from customer")
//       return false
//     }

//     const newLead = leadResponse.lead as Lead

//     // 2) Option A: keep customer record, just mark as inactive + add note
//     const updatedCustomerPayload: Partial<Customer> = {
//       status: "inactive",
//       notes: (customer.notes || "") + "\n\n[Auto] Moved back to leads.",
//     }

//     const updatedCustomerResponse = await customersApi.update(
//       id,
//       updatedCustomerPayload as any,
//     )

//     // Normalise the updated customer from API if returned, else fallback to local
//     let updatedCustomer = customer
//     if (updatedCustomerResponse.customer) {
//       updatedCustomer = normalizeCustomer(updatedCustomerResponse.customer)
//     } else {
//       updatedCustomer = {
//         ...customer,
//         status: "inactive",
//         notes: updatedCustomerPayload.notes!,
//       }
//     }

//     // 3) Update local state: add lead and update customer in-place
//     setLeads((prev) => [
//       {
//         ...newLead,
//         createdAt: toDate(newLead.createdAt) ?? newLead.createdAt,
//         updatedAt: toDate(newLead.updatedAt) ?? newLead.updatedAt,
//         lastContactDate: toDate(newLead.lastContactDate) ?? newLead.lastContactDate,
//       },
//       ...prev,
//     ])

//     setCustomers((prev) =>
//       prev.map((c) => (c.id === id ? updatedCustomer : c)),
//     )

//     return true
//   } catch (err) {
//     console.error("Failed to move customer to lead:", err)
//     return false
//   }
// }

//   // Lead CRUD
//   const addLead = async (
//     leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.create(leadData)
//       if (response.lead) {
//         const l = response.lead as Lead
//         setLeads((prev) => [
//           ...prev,
//           { ...l, createdAt: toDate(l.createdAt) ?? l.createdAt },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add lead:", err)
//       return false
//     }
//   }

//   const updateLead = async (
//     id: string,
//     leadData: Partial<Lead>,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.update(id, leadData)
//       if (response.lead) {
//         const l = response.lead as Lead
//         setLeads((prev) =>
//           prev.map((lead) =>
//             lead.id === id
//               ? {
//                   ...l,
//                   createdAt: toDate(l.createdAt) ?? l.createdAt,
//                   updatedAt: toDate(l.updatedAt) ?? l.updatedAt,
//                 }
//               : lead,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update lead:", err)
//       return false
//     }
//   }

//   const deleteLead = async (id: string): Promise<boolean> => {
//     try {
//       await leadsApi.delete(id)
//       setLeads((prev) => prev.filter((lead) => lead.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete lead:", err)
//       return false
//     }
//   }

//   const convertLead = async (
//     id: string,
//     customerData?: any,
//   ): Promise<boolean> => {
//     try {
//       const dataWithFlag = {
//         ...customerData,
//         fromLead: true,
//       }

//       const response = await leadsApi.convertToCustomer(id, dataWithFlag)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         const customerWithFlag = { ...c, fromLead: true } as any

//         setLeads((prev) => prev.filter((lead) => lead.id !== id))
//         setCustomers((prev) => [...prev, customerWithFlag])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to convert lead:", err)
//       return false
//     }
//   }

//   // Deal CRUD
//   const addDeal = async (
//     dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData = {
//         ...dealData,
//         expectedCloseDate: dealData.expectedCloseDate
//           ? dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//           : null,
//         ...(dealData.actualCloseDate && {
//           actualCloseDate:
//             dealData.actualCloseDate instanceof Date
//               ? dealData.actualCloseDate.toISOString()
//               : dealData.actualCloseDate,
//         }),
//         products: Array.isArray(dealData.products)
//           ? dealData.products
//           : [],
//       }

//       const response = await dealsApi.create(formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) => [
//           ...prev,
//           {
//             ...d,
//             createdAt: toDate(d.createdAt) ?? d.createdAt,
//             updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//             expectedCloseDate:
//               toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add deal:", err)
//       return false
//     }
//   }

//   const updateDeal = async (
//     id: string,
//     dealData: Partial<Deal>,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData: any = { ...dealData }

//       if (dealData.expectedCloseDate) {
//         formattedDealData.expectedCloseDate =
//           dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//       }

//       if (dealData.actualCloseDate) {
//         formattedDealData.actualCloseDate =
//           dealData.actualCloseDate instanceof Date
//             ? dealData.actualCloseDate.toISOString()
//             : dealData.actualCloseDate
//       }

//       const response = await dealsApi.update(id, formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) =>
//           prev.map((deal) =>
//             deal.id === id
//               ? {
//                   ...d,
//                   createdAt: toDate(d.createdAt) ?? d.createdAt,
//                   updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//                   expectedCloseDate:
//                     toDate(d.expectedCloseDate) ??
//                     d.expectedCloseDate,
//                 }
//               : deal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update deal:", err)
//       return false
//     }
//   }

//   const deleteDeal = async (id: string): Promise<boolean> => {
//     try {
//       await dealsApi.delete(id)
//       setDeals((prev) => prev.filter((deal) => deal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete deal:", err)
//       return false
//     }
//   }

//   // Task CRUD
//   const addTask = async (
//     taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.create(taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) => [
//           ...prev,
//           {
//             ...t,
//             createdAt: toDate(t.createdAt) ?? t.createdAt,
//             updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add task:", err)
//       return false
//     }
//   }

//   const updateTask = async (
//     id: string,
//     taskData: Partial<Task>,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.update(id, taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.id === id
//               ? {
//                   ...t,
//                   createdAt: toDate(t.createdAt) ?? t.createdAt,
//                   updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//                 }
//               : task,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update task:", err)
//       return false
//     }
//   }

//   const deleteTask = async (id: string): Promise<boolean> => {
//     try {
//       await tasksApi.delete(id)
//       setTasks((prev) => prev.filter((task) => task.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete task:", err)
//       return false
//     }
//   }

//   // Invoice CRUD
//   const addInvoice = async (
//     invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           return {
//             customerId: invoiceData.customerId,
//             amount: subtotal,
//             tax: taxNumber,
//             total,
//             status: invoiceData.status,
//             dueDate: invoiceData.dueDate,
//             items:
//               invoiceData.items?.map((it) => ({
//                 description: it.description,
//                 quantity: it.quantity,
//                 rate: it.rate,
//                 amount: it.amount,
//               })) ?? [],
//             notes: invoiceData.notes,
//           }
//         })()

//       const response = await invoicesApi.create(payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? invoiceData.invoiceNumber,
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at ?? new Date()) ?? new Date(),
//           updatedAt:
//             toDate(inv.updated_at ?? new Date()) ?? new Date(),
//         }

//         setInvoices((prev) => [normalized, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add invoice:", err)
//       return false
//     }
//   }

//   const updateInvoice = async (
//     id: string,
//     invoiceData: Partial<Invoice>,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           const base: any = {}

//           if (invoiceData.customerId) base.customerId = invoiceData.customerId
//           if (subtotal !== undefined) base.amount = subtotal
//           if (taxNumber !== undefined) base.tax = taxNumber
//           base.total = total
//           if (invoiceData.status) base.status = invoiceData.status
//           if (invoiceData.dueDate) base.dueDate = invoiceData.dueDate
//           if (invoiceData.notes !== undefined) base.notes = invoiceData.notes

//           if (invoiceData.items) {
//             base.items = invoiceData.items.map((it) => ({
//               description: it.description,
//               quantity: it.quantity,
//               rate: it.rate,
//               amount: it.amount,
//             }))
//           }

//           return base
//         })()

//       const response = await invoicesApi.update(id, payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status ?? "draft",
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount ?? 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax ?? 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at) ??
//             invoiceData.createdAt ??
//             new Date(),
//           updatedAt:
//             toDate(inv.updated_at) ?? new Date(),
//         }

//         setInvoices((prev) =>
//           prev.map((invoice) => (invoice.id === id ? normalized : invoice)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update invoice:", err)
//       return false
//     }
//   }

//   const deleteInvoice = async (id: string): Promise<boolean> => {
//     try {
//       await invoicesApi.delete(id)
//       setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete invoice:", err)
//       return false
//     }
//   }

//   // Renewal reminder CRUD
//   const addRenewalReminder = async (
//     reminderData: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.createReminder(reminderData)
//       if (response.reminder) {
//         const rr = response.reminder as RenewalReminder
//         setRenewalReminders((prev) => [
//           ...prev,
//           {
//             ...rr,
//             createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//             updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal reminder:", err)
//       return false
//     }
//   }

//   const updateRenewalReminder = async (
//     _id: string,
//     _reminderData: Partial<RenewalReminder>,
//   ): Promise<boolean> => {
//     console.warn("Update renewal reminder not implemented in backend yet")
//     return false
//   }

//   const deleteRenewalReminder = async (_id: string): Promise<boolean> => {
//     console.warn("Delete renewal reminder not implemented in backend yet")
//     return false
//   }

//   // Renewal CRUD
//   const addRenewal = async (
//     renewalData: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.create(renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) => [
//           ...prev,
//           {
//             ...r,
//             createdAt: toDate(r.createdAt) ?? r.createdAt,
//             updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal:", err)
//       return false
//     }
//   }

//   const updateRenewal = async (
//     id: string,
//     renewalData: Partial<Renewal>,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.update(id, renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) =>
//           prev.map((renewal) =>
//             renewal.id === id
//               ? {
//                   ...r,
//                   createdAt: toDate(r.createdAt) ?? r.createdAt,
//                   updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//                 }
//               : renewal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update renewal:", err)
//       return false
//     }
//   }

//   const deleteRenewal = async (id: string): Promise<boolean> => {
//     try {
//       await renewalsApi.delete(id)
//       setRenewals((prev) => prev.filter((renewal) => renewal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete renewal:", err)
//       return false
//     }
//   }

//   const value: CRMContextType = {
//     customers,
//     leads,
//     deals,
//     tasks,
//     invoices,
//     renewalReminders,
//     renewals,
//     users,
//     isLoading,
//     error,
//     addCustomer,
//     updateCustomer,
//     deleteCustomer,
//     moveCustomerToLead,
//     addLead,
//     updateLead,
//     deleteLead,
//     convertLead,
//     addDeal,
//     updateDeal,
//     deleteDeal,
//     addTask,
//     updateTask,
//     deleteTask,
//     addInvoice,
//     updateInvoice,
//     deleteInvoice,
//     addRenewalReminder,
//     updateRenewalReminder,
//     deleteRenewalReminder,
//     addRenewal,
//     updateRenewal,
//     deleteRenewal,
//     refreshData,
//     refreshCustomers,
//     refreshLeads,
//     refreshDeals,
//     refreshTasks,
//     refreshInvoices,
//     refreshRenewals,
//     refreshUsers,
//   }

//   return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
// }

// export function useCRM() {
//   const context = useContext(CRMContext)
//   if (context === undefined) {
//     throw new Error("useCRM must be used within a CRMProvider")
//   }
//   return context
// }

//testing 2 (16-12-2025)

// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type {
//   Customer,
//   Lead,
//   Deal,
//   Task,
//   Invoice,
//   RenewalReminder,
//   Renewal,
// } from "@/types/crm"
// import {
//   customersApi,
//   leadsApi,
//   dealsApi,
//   tasksApi,
//   invoicesApi,
//   renewalsApi,
// } from "@/lib/api"

// // Add User type
// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// // Context type
// interface CRMContextType {
//   customers: Customer[]
//   leads: Lead[]
//   deals: Deal[]
//   tasks: Task[]
//   invoices: Invoice[]
//   renewalReminders: RenewalReminder[]
//   renewals: Renewal[]
//   users: User[]

//   isLoading: boolean
//   error: string | null

//   addCustomer: (
//     customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
//   deleteCustomer: (id: string) => Promise<boolean>
//   moveCustomerToLead: (id: string) => Promise<boolean>

//   addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>
//   deleteLead: (id: string) => Promise<boolean>
//   convertLead: (id: string, customerData?: any) => Promise<boolean>

//   addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>
//   deleteDeal: (id: string) => Promise<boolean>

//   addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateTask: (id: string, task: Partial<Task>) => Promise<boolean>
//   deleteTask: (id: string) => Promise<boolean>

//   addInvoice: (
//     invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   updateInvoice: (
//     id: string,
//     invoice: Partial<Invoice>,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   deleteInvoice: (id: string) => Promise<boolean>

//   addRenewalReminder: (
//     reminder: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewalReminder: (
//     id: string,
//     reminder: Partial<RenewalReminder>,
//   ) => Promise<boolean>
//   deleteRenewalReminder: (id: string) => Promise<boolean>

//   addRenewal: (
//     renewal: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewal: (id: string, renewal: Partial<Renewal>) => Promise<boolean>
//   deleteRenewal: (id: string) => Promise<boolean>

//   refreshData: () => Promise<void>
//   refreshCustomers: () => Promise<void>
//   refreshLeads: () => Promise<void>
//   refreshDeals: () => Promise<void>
//   refreshTasks: () => Promise<void>
//   refreshInvoices: () => Promise<void>
//   refreshRenewals: () => Promise<void>
//   refreshUsers: () => Promise<void>
// }

// const CRMContext = createContext<CRMContextType | undefined>(undefined)

// // Helpers
// const toDate = (value: unknown): Date | null => {
//   if (!value) return null
//   if (value instanceof Date) return value
//   const d = new Date(value as string)
//   return Number.isNaN(d.getTime()) ? null : d
// }

// // Normalize a raw customer from API/DB into app Customer type
// const normalizeCustomer = (raw: any): Customer => ({
//   id: String(raw.id),
//   name: raw.name,
//   email: raw.email,
//   phone: raw.phone,
//   company: raw.company,
//   address: raw.address,
//   city: raw.city,
//   state: raw.state,
//   zipCode: raw.zip_code ?? raw.zipCode,
//   country: raw.country,
//   status: raw.status,
//   source: raw.source,
//   tags: Array.isArray(raw.tags)
//     ? raw.tags
//     : (() => {
//         try {
//           return raw.tags ? JSON.parse(raw.tags) : []
//         } catch {
//           return []
//         }
//       })(),
//   notes: raw.notes,
//   totalValue:
//     typeof raw.totalValue === "number"
//       ? raw.totalValue
//       : typeof raw.total_value === "number"
//       ? raw.total_value
//       : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
//   lastContactDate:
//     toDate(raw.lastContactDate ?? raw.last_contact_date) ??
//     (raw.lastContactDate ?? raw.last_contact_date),
//   createdAt:
//     toDate(raw.createdAt ?? raw.created_at) ??
//     (raw.createdAt ?? raw.created_at),
//   updatedAt:
//     toDate(raw.updatedAt ?? raw.updated_at) ??
//     (raw.updatedAt ?? raw.updated_at),

//   // invoice defaults
//   defaultTaxRate:
//     typeof raw.default_tax_rate === "number"
//       ? raw.default_tax_rate
//       : typeof raw.defaultTaxRate === "number"
//       ? raw.defaultTaxRate
//       : raw.default_tax_rate != null || raw.defaultTaxRate != null
//       ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
//       : undefined,
//   defaultDueDays:
//     typeof raw.default_due_days === "number"
//       ? raw.default_due_days
//       : typeof raw.defaultDueDays === "number"
//       ? raw.defaultDueDays
//       : raw.default_due_days != null || raw.defaultDueDays != null
//       ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
//       : undefined,
//   defaultInvoiceNotes:
//     raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

//   // recurring / subscription info
//   recurringEnabled:
//     raw.recurring_enabled ?? raw.recurringEnabled ?? false,
//   recurringInterval:
//     raw.recurring_interval ?? raw.recurringInterval ?? null,
//   recurringAmount:
//     typeof raw.recurring_amount === "number"
//       ? raw.recurring_amount
//       : typeof raw.recurringAmount === "number"
//       ? raw.recurringAmount
//       : raw.recurring_amount != null || raw.recurringAmount != null
//       ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
//       : undefined,
//   recurringService:
//     raw.recurring_service ?? raw.recurringService ?? null,

//   // renewal defaults
//   defaultRenewalStatus:
//     raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
//   defaultRenewalReminderDays:
//     typeof raw.default_renewal_reminder_days === "number"
//       ? raw.default_renewal_reminder_days
//       : typeof raw.defaultRenewalReminderDays === "number"
//       ? raw.defaultRenewalReminderDays
//       : raw.default_renewal_reminder_days != null ||
//         raw.defaultRenewalReminderDays != null
//       ? Number(
//           raw.default_renewal_reminder_days ??
//             raw.defaultRenewalReminderDays ??
//             0,
//         )
//       : undefined,
//   defaultRenewalNotes:
//     raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
//   nextRenewalDate:
//     toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
//     (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
// })

// // Normalize a raw lead from API/DB into app Lead type
// const normalizeLead = (raw: any): Lead => ({
//   id: String(raw.id),
//   name: raw.name ?? "",
//   email: raw.email ?? "",
//   phone: raw.phone ?? "",
//   company: raw.company ?? "",
//   source: raw.source ?? "website",
//   status: raw.status ?? "new",
//   priority: raw.priority ?? "medium",
//   assignedTo: raw.assigned_to ?? raw.assignedTo ?? "",
//   estimatedValue:
//     typeof raw.estimated_value === "number"
//       ? raw.estimated_value
//       : typeof raw.estimatedValue === "number"
//       ? raw.estimatedValue
//       : Number(raw.estimated_value ?? raw.estimatedValue ?? 0) || 0,
//   notes: raw.notes ?? "",
//   expectedCloseDate:
//     toDate(raw.expected_close_date ?? raw.expectedCloseDate) ??
//     (raw.expected_close_date ?? raw.expectedCloseDate ?? null),
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber ?? "",
//   service: raw.service ?? undefined,
//   createdAt:
//     toDate(raw.created_at ?? raw.createdAt) ??
//     (raw.created_at ?? raw.createdAt),
//   updatedAt:
//     toDate(raw.updated_at ?? raw.updatedAt) ??
//     (raw.updated_at ?? raw.updatedAt),
//   lastContactDate:
//     toDate(raw.last_contact_date ?? raw.lastContactDate) ??
//     (raw.last_contact_date ?? raw.lastContactDate ?? null),

//   // conversion info (for hiding in list but keeping for stats)
//   // ensure these exist in your Lead interface and DB if you need persistence
//   isConverted: Boolean(raw.is_converted ?? raw.isConverted ?? false),
//   convertedCustomerId:
//     raw.converted_customer_id ?? raw.convertedCustomerId ?? null,
// } as Lead)

// export function CRMProvider({ children }: { children: React.ReactNode }) {
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [leads, setLeads] = useState<Lead[]>([])
//   const [deals, setDeals] = useState<Deal[]>([])
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>([])
//   const [renewals, setRenewals] = useState<Renewal[]>([])
//   const [users, setUsers] = useState<User[]>([])

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     void refreshData()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const refreshData = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       await Promise.all([
//         refreshCustomers(),
//         refreshLeads(),
//         refreshDeals(),
//         refreshTasks(),
//         refreshInvoices(),
//         refreshRenewals(),
//         refreshUsers(),
//       ])
//     } catch (err) {
//       console.error("Failed to load CRM data:", err)
//       setError(
//         err instanceof Error ? err.message : "Failed to load CRM data",
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshUsers = async () => {
//     try {
//       const response = await fetch(
//         `${
//           // process.env.NEXT_PUBLIC_API_URL || "https://crm-backend-53w9.onrender.com"}/api/users`,
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       )

//       if (response.ok) {
//         const data = await response.json()
//         setUsers(data.users || [])
//       }
//     } catch (err) {
//       console.error("Failed to fetch users:", err)
//       setUsers([
//         {
//           id: "user1",
//           name: "Default User",
//           email: "user@example.com",
//           role: "admin",
//         },
//       ])
//     }
//   }

//   const refreshCustomers = async () => {
//     try {
//       const response = await customersApi.getAll({ limit: 100 })
//       const list = (response.customers || []) as any[]
//       setCustomers(list.map((c) => normalizeCustomer(c)))
//     } catch (err) {
//       console.error("Failed to fetch customers:", err)
//       throw err
//     }
//   }

//   const refreshLeads = async () => {
//     try {
//       const response = await leadsApi.getAll({ limit: 100 })
//       const list = (response.leads || []) as any[]
//       setLeads(list.map((l) => normalizeLead(l)))
//     } catch (err) {
//       console.error("Failed to fetch leads:", err)
//       throw err
//     }
//   }

//   const refreshDeals = async () => {
//     try {
//       const response = await dealsApi.getAll({ limit: 100 })
//       const list = (response.deals || []) as Deal[]
//       setDeals(
//         list.map((d) => ({
//           ...d,
//           createdAt: toDate(d.createdAt) ?? d.createdAt,
//           updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//           expectedCloseDate:
//             toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           value:
//             typeof d.value === "number" ? d.value : Number(d.value ?? 0) || 0,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch deals:", err)
//       throw err
//     }
//   }

//   const refreshTasks = async () => {
//     try {
//       const response = await tasksApi.getAll({ limit: 100 })
//       const list = (response.tasks || []) as Task[]
//       setTasks(
//         list.map((t) => ({
//           ...t,
//           createdAt: toDate(t.createdAt) ?? t.createdAt,
//           updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           dueDate: toDate(t.dueDate) ?? t.dueDate,
//           completedAt: toDate(t.completedAt) ?? t.completedAt,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err)
//       throw err
//     }
//   }

//   // const refreshInvoices = async () => {
//   //   try {
//   //     const response = await invoicesApi.getAll({ limit: 100 })
//   //     const list = (response.invoices || []) as any[]

//   //     setInvoices(
//   //       list.map((inv) => ({
//   //         id: String(inv.id),
//   //         customerId: String(inv.customer_id ?? inv.customerId),
//   //         customerName: inv.customer_name ?? inv.customerName ?? "",
//   //         invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
//   //         issueDate:
//   //           toDate(inv.created_at ?? inv.issueDate) ??
//   //           (inv.created_at ?? inv.issueDate),
//   //         dueDate:
//   //           toDate(inv.due_date ?? inv.dueDate) ??
//   //           (inv.due_date ?? inv.dueDate),
//   //         status: inv.status,
//   //         amount:
//   //           typeof inv.amount === "number"
//   //             ? inv.amount
//   //             : Number(inv.amount ?? 0) || 0,
//   //         tax:
//   //           typeof inv.tax === "number"
//   //             ? inv.tax
//   //             : Number(inv.tax ?? 0) || 0,
//   //         discount:
//   //           typeof inv.discount === "number"
//   //             ? inv.discount
//   //             : Number(inv.discount ?? 0) || 0,
//   //         notes: inv.notes ?? "",
//   //         items: Array.isArray(inv.items) ? inv.items : [],
//   //         createdAt:
//   //           toDate(inv.created_at ?? inv.createdAt) ??
//   //           (inv.created_at ?? inv.createdAt),
//   //         updatedAt:
//   //           toDate(inv.updated_at ?? inv.updatedAt) ??
//   //           (inv.updated_at ?? inv.updatedAt),
//   //       })),
//   //     )
//   //   } catch (err) {
//   //     console.error("Failed to fetch invoices:", err)
//   //     throw err
//   //   }
//   // }

//   const refreshInvoices = async () => {
//   try {
//     const response = await invoicesApi.getAll({ limit: 100 })
//     const list = (response.invoices || []) as any[]

//     setInvoices(
//       list.map((inv) => ({
//         id: String(inv.id),
//         customerId: String(inv.customer_id ?? inv.customerId),
//         customerName: inv.customer_name ?? inv.customerName ?? "",
//         invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
//         issueDate:
//           toDate(inv.created_at ?? inv.issueDate) ??
//           (inv.created_at ?? inv.issueDate),
//         dueDate:
//           toDate(inv.due_date ?? inv.dueDate) ??
//           (inv.due_date ?? inv.dueDate),
//         status: inv.status,
//         amount:
//           typeof inv.amount === "number"
//             ? inv.amount
//             : Number(inv.amount ?? 0) || 0, // subtotal before GST
//         tax:
//           typeof inv.tax === "number"
//             ? inv.tax
//             : Number(inv.tax ?? 0) || 0,    // GST rate (e.g. 18)
//         discount:
//           typeof inv.discount === "number"
//             ? inv.discount
//             : Number(inv.discount ?? 0) || 0,
//         total:
//           typeof inv.total === "number"
//             ? inv.total
//             : Number(inv.total ?? 0) || 0,   // total payable with GST
//         notes: inv.notes ?? "",
//         items: Array.isArray(inv.items) ? inv.items : [],
//         createdAt:
//           toDate(inv.created_at ?? inv.createdAt) ??
//           (inv.created_at ?? inv.createdAt),
//         updatedAt:
//           toDate(inv.updated_at ?? inv.updatedAt) ??
//           (inv.updated_at ?? inv.updatedAt),
//       })),
//     )
//   } catch (err) {
//     console.error("Failed to fetch invoices:", err)
//     throw err
//   }
// }


//   const refreshRenewals = async () => {
//     try {
//       const [renewalsResponse, remindersResponse] = await Promise.all([
//         renewalsApi.getAll({ limit: 100 }),
//         renewalsApi.getReminders(),
//       ])

//       const renewalsList = (renewalsResponse.renewals || []) as Renewal[]
//       const remindersList = (remindersResponse.reminders || []) as RenewalReminder[]

//       setRenewals(
//         renewalsList.map((r) => ({
//           ...r,
//           createdAt: toDate(r.createdAt) ?? r.createdAt,
//           updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           startDate: toDate(r.startDate) ?? r.startDate,
//           endDate: toDate(r.endDate) ?? r.endDate,
//           amount:
//             typeof r.amount === "number"
//               ? r.amount
//               : Number(r.amount ?? 0) || 0,
//         })),
//       )

//       setRenewalReminders(
//         remindersList.map((rr) => ({
//           ...rr,
//           createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//           updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           expiryDate: toDate(rr.expiryDate) ?? rr.expiryDate,
//           lastReminderSent:
//             toDate(rr.lastReminderSent) ?? rr.lastReminderSent,
//           reminderDays: Array.isArray(rr.reminderDays)
//             ? rr.reminderDays
//             : (() => {
//                 try {
//                   return JSON.parse(
//                     (rr.reminderDays as unknown as string) || "[]",
//                   ) as number[]
//                 } catch {
//                   return []
//                 }
//               })(),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch renewals:", err)
//       throw err
//     }
//   }

//   // Customer CRUD
//   const addCustomer = async (
//     customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const payload = {
//         ...customerData,
//         totalValue:
//           customerData.totalValue !== undefined &&
//           customerData.totalValue !== null &&
//           customerData.totalValue !== ""
//             ? Number(customerData.totalValue)
//             : 0,
//       }

//       const response = await customersApi.create(payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) => [c, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add customer:", err)
//       throw err
//     }
//   }

//   const updateCustomer = async (
//     id: string,
//     customerData: Partial<Customer>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...customerData }
//       if ("totalValue" in payload) {
//         const v = payload.totalValue
//         payload.totalValue =
//           v !== undefined && v !== null && v !== "" ? Number(v) : 0
//       }

//       const response = await customersApi.update(id, payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) =>
//           prev.map((customer) => (customer.id === id ? c : customer)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update customer:", err)
//       throw err
//     }
//   }

//   const deleteCustomer = async (id: string): Promise<boolean> => {
//     try {
//       await customersApi.delete(id)
//       setCustomers((prev) => prev.filter((customer) => customer.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete customer:", err)
//       return false
//     }
//   }

//   // Move customer back to lead WITHOUT deleting (keeps deals/invoices intact)
//   // const moveCustomerToLead = async (id: string): Promise<boolean> => {
//   //   try {
//   //     const customer = customers.find((c) => c.id === id)
//   //     if (!customer) {
//   //       console.error("Customer not found")
//   //       return false
//   //     }

//   //     // 1) Create lead from customer
//   //     const leadData: Omit<Lead, "id" | "createdAt" | "updatedAt"> = {
//   //       name: customer.name,
//   //       email: customer.email,
//   //       phone: customer.phone,
//   //       company: customer.company || "",
//   //       status: "new",
//   //       source: customer.source || "",
//   //       assignedTo: (customer as any).assignedTo || "",
//   //       notes: (customer.notes || "") + "\n\n[Auto] Restored from customer.",
//   //       estimatedValue: (customer.totalValue as any) ?? 0,
//   //       priority: "medium",
//   //       whatsappNumber: customer.whatsappNumber || "",
//   //       service: undefined as any,
//   //       expectedCloseDate: null as any,
//   //       lastContactDate: customer.lastContactDate as any,
//   //       isConverted: false,
//   //       convertedCustomerId: null,
//   //     }

//   //     const leadResponse = await leadsApi.create(leadData)

//   //     if (!leadResponse.lead) {
//   //       console.error("Failed to create lead from customer")
//   //       return false
//   //     }

//   //     const newLead = normalizeLead(leadResponse.lead)

//   //     // 2) mark customer inactive
//   //     const updatedCustomerPayload: Partial<Customer> = {
//   //       status: "inactive",
//   //       notes: (customer.notes || "") + "\n\n[Auto] Moved back to leads.",
//   //     }

//   //     const updatedCustomerResponse = await customersApi.update(
//   //       id,
//   //       updatedCustomerPayload as any,
//   //     )

//   //     let updatedCustomer = customer
//   //     if (updatedCustomerResponse.customer) {
//   //       updatedCustomer = normalizeCustomer(updatedCustomerResponse.customer)
//   //     } else {
//   //       updatedCustomer = {
//   //         ...customer,
//   //         status: "inactive",
//   //         notes: updatedCustomerPayload.notes!,
//   //       }
//   //     }

//   //     // 3) Update local state
//   //     setLeads((prev) => [newLead, ...prev])

//   //     setCustomers((prev) =>
//   //       prev.map((c) => (c.id === id ? updatedCustomer : c)),
//   //     )

//   //     return true
//   //   } catch (err) {
//   //     console.error("Failed to move customer to lead:", err)
//   //     return false
//   //   }
//   // }

//   //testing 

// // Move customer back to lead WITHOUT deleting (keeps deals/invoices intact)
// const moveCustomerToLead = async (id: string): Promise<boolean> => {
//   try {
//     // Call backend route that creates the lead + relinks tasks
//     const response = await customersApi.moveToLead(id)

//     // Mark customer inactive locally
//     setCustomers((prev) =>
//       prev.map((c) =>
//         c.id === id ? { ...c, status: "inactive" } : c,
//       ),
//     )

//     // Refresh leads so the new lead appears in state
//     await refreshLeads()

//     return true
//   } catch (err) {
//     console.error("Failed to move customer to lead:", err)
//     return false
//   }
// }


//   // Lead CRUD
//   const addLead = async (
//     leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.create(leadData)
//       if (response.lead) {
//         const l = normalizeLead(response.lead)
//         setLeads((prev) => [...prev, l])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add lead:", err)
//       return false
//     }
//   }

//   const updateLead = async (
//     id: string,
//     leadData: Partial<Lead>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...leadData }

//       // Normalize expectedCloseDate for MySQL DATE (yyyy-mm-dd)
//       if (payload.expectedCloseDate instanceof Date) {
//         const d = payload.expectedCloseDate
//         const year = d.getFullYear()
//         const month = String(d.getMonth() + 1).padStart(2, "0")
//         const day = String(d.getDate()).padStart(2, "0")
//         payload.expectedCloseDate = `${year}-${month}-${day}`
//       } else if (typeof payload.expectedCloseDate === "string") {
//         if (payload.expectedCloseDate.includes("T")) {
//           payload.expectedCloseDate = payload.expectedCloseDate.split("T")[0]
//         }
//       }

//       const response = await leadsApi.update(id, payload)

//       if (response.lead) {
//         const l = normalizeLead(response.lead)
//         setLeads((prev) => prev.map((lead) => (lead.id === id ? l : lead)))
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update lead:", err)
//       return false
//     }
//   }

//   const deleteLead = async (id: string): Promise<boolean> => {
//     try {
//       await leadsApi.delete(id)
//       setLeads((prev) => prev.filter((lead) => lead.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete lead:", err)
//       return false
//     }
//   }

//   // const convertLead = async (
//   //   id: string,
//   //   customerData?: any,
//   // ): Promise<boolean> => {
//   //   try {
//   //     const dataWithFlag = {
//   //       ...customerData,
//   //       fromLead: true,
//   //     }

//   //     const response = await leadsApi.convertToCustomer(id, dataWithFlag)

//   //     if (response.customer) {
//   //       const c = normalizeCustomer(response.customer)
//   //       const customerWithFlag = { ...c, fromLead: true } as any

//   //       // add new customer
//   //       setCustomers((prev) => [...prev, customerWithFlag])

//   //       // keep lead, mark as closed-won + converted
//   //       setLeads((prev) =>
//   //         prev.map((lead) =>
//   //           lead.id === id
//   //             ? {
//   //                 ...lead,
//   //                 status: "closed-won",
//   //                 isConverted: true,
//   //                 convertedCustomerId: customerWithFlag.id,
//   //               }
//   //             : lead,
//   //         ),
//   //       )

//   //       // optional: if backend also updates lead, you can refresh
//   //       // await refreshLeads()

//   //       return true
//   //     }
//   //     return false
//   //   } catch (err) {
//   //     console.error("Failed to convert lead:", err)
//   //     return false
//   //   }
//   // }


//   const convertLead = async (
//   id: string,
//   customerData?: any,
// ): Promise<boolean> => {
//   try {
//     const dataWithFlag = {
//       ...customerData,
//       fromLead: true,
//     }

//     const response = await leadsApi.convertToCustomer(id, dataWithFlag)

//     if (response.customer) {
//       const c = normalizeCustomer(response.customer)
//       const customerWithFlag = { ...c, fromLead: true } as any

//       setCustomers((prev) => [...prev, customerWithFlag])
//       setLeads((prev) =>
//         prev.map((lead) =>
//           lead.id === id
//             ? {
//                 ...lead,
//                 status: "closed-won",
//                 isConverted: true,
//                 convertedCustomerId: customerWithFlag.id,
//               }
//             : lead,
//         ),
//       )

//       return true
//     }

//     // if API returns { error: "Customer with this email already exists" }
//     if ((response as any).error) {
//       throw new Error((response as any).error)
//     }

//     return false
//   } catch (err: any) {
//     console.error("Failed to convert lead:", err)
//     alert(err?.message || "Failed to convert lead to customer")
//     return false
//   }
// }

//   // Deal CRUD
 

//   const addDeal = async (
//     dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData = {
//         ...dealData,
//         expectedCloseDate: dealData.expectedCloseDate
//           ? dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//           : null,
//         ...(dealData.actualCloseDate && {
//           actualCloseDate:
//             dealData.actualCloseDate instanceof Date
//               ? dealData.actualCloseDate.toISOString()
//               : dealData.actualCloseDate,
//         }),
//         products: Array.isArray(dealData.products)
//           ? dealData.products
//           : [],
//       }

//       const response = await dealsApi.create(formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) => [
//           ...prev,
//           {
//             ...d,
//             createdAt: toDate(d.createdAt) ?? d.createdAt,
//             updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//             expectedCloseDate:
//               toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add deal:", err)
//       return false
//     }
//   }

//   const updateDeal = async (
//     id: string,
//     dealData: Partial<Deal>,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData: any = { ...dealData }

//       if (dealData.expectedCloseDate) {
//         formattedDealData.expectedCloseDate =
//           dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//       }

//       if (dealData.actualCloseDate) {
//         formattedDealData.actualCloseDate =
//           dealData.actualCloseDate instanceof Date
//             ? dealData.actualCloseDate.toISOString()
//             : dealData.actualCloseDate
//       }

//       const response = await dealsApi.update(id, formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) =>
//           prev.map((deal) =>
//             deal.id === id
//               ? {
//                   ...d,
//                   createdAt: toDate(d.createdAt) ?? d.createdAt,
//                   updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//                   expectedCloseDate:
//                     toDate(d.expectedCloseDate) ??
//                     d.expectedCloseDate,
//                 }
//               : deal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update deal:", err)
//       return false
//     }
//   }

//   const deleteDeal = async (id: string): Promise<boolean> => {
//     try {
//       await dealsApi.delete(id)
//       setDeals((prev) => prev.filter((deal) => deal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete deal:", err)
//       return false
//     }
//   }

//   // Task CRUD
//   const addTask = async (
//     taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.create(taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) => [
//           ...prev,
//           {
//             ...t,
//             createdAt: toDate(t.createdAt) ?? t.createdAt,
//             updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add task:", err)
//       return false
//     }
//   }

//   const updateTask = async (
//     id: string,
//     taskData: Partial<Task>,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.update(id, taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.id === id
//               ? {
//                   ...t,
//                   createdAt: toDate(t.createdAt) ?? t.createdAt,
//                   updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//                 }
//               : task,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update task:", err)
//       return false
//     }
//   }

//   const deleteTask = async (id: string): Promise<boolean> => {
//     try {
//       await tasksApi.delete(id)
//       setTasks((prev) => prev.filter((task) => task.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete task:", err)
//       return false
//     }
//   }

//   // Invoice CRUD
//   const addInvoice = async (
//     invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           return {
//             customerId: invoiceData.customerId,
//             amount: subtotal,
//             tax: taxNumber,
//             total,
//             status: invoiceData.status,
//             dueDate: invoiceData.dueDate,
//             items:
//               invoiceData.items?.map((it) => ({
//                 description: it.description,
//                 quantity: it.quantity,
//                 rate: it.rate,
//                 amount: it.amount,
//               })) ?? [],
//             notes: invoiceData.notes,
//           }
//         })()

//       const response = await invoicesApi.create(payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? invoiceData.invoiceNumber,
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at ?? new Date()) ?? new Date(),
//           updatedAt:
//             toDate(inv.updated_at ?? new Date()) ?? new Date(),
//         }

//         setInvoices((prev) => [normalized, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add invoice:", err)
//       return false
//     }
//   }

//   const updateInvoice = async (
//     id: string,
//     invoiceData: Partial<Invoice>,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           const base: any = {}

//           if (invoiceData.customerId) base.customerId = invoiceData.customerId
//           if (subtotal !== undefined) base.amount = subtotal
//           if (taxNumber !== undefined) base.tax = taxNumber
//           base.total = total
//           if (invoiceData.status) base.status = invoiceData.status
//           if (invoiceData.dueDate) base.dueDate = invoiceData.dueDate
//           if (invoiceData.notes !== undefined) base.notes = invoiceData.notes

//           if (invoiceData.items) {
//             base.items = invoiceData.items.map((it) => ({
//               description: it.description,
//               quantity: it.quantity,
//               rate: it.rate,
//               amount: it.amount,
//             }))
//           }

//           return base
//         })()

//       const response = await invoicesApi.update(id, payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status ?? "draft",
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount ?? 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax ?? 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at) ??
//             invoiceData.createdAt ??
//             new Date(),
//           updatedAt:
//             toDate(inv.updated_at) ?? new Date(),
//         }

//         setInvoices((prev) =>
//           prev.map((invoice) => (invoice.id === id ? normalized : invoice)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update invoice:", err)
//       return false
//     }
//   }

//   const deleteInvoice = async (id: string): Promise<boolean> => {
//     try {
//       await invoicesApi.delete(id)
//       setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete invoice:", err)
//       return false
//     }
//   }

//   // Renewal reminder CRUD
//   const addRenewalReminder = async (
//     reminderData: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.createReminder(reminderData)
//       if (response.reminder) {
//         const rr = response.reminder as RenewalReminder
//         setRenewalReminders((prev) => [
//           ...prev,
//           {
//             ...rr,
//             createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//             updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal reminder:", err)
//       return false
//     }
//   }

//   const updateRenewalReminder = async (
//     _id: string,
//     _reminderData: Partial<RenewalReminder>,
//   ): Promise<boolean> => {
//     console.warn("Update renewal reminder not implemented in backend yet")
//     return false
//   }

//   const deleteRenewalReminder = async (_id: string): Promise<boolean> => {
//     console.warn("Delete renewal reminder not implemented in backend yet")
//     return false
//   }

//   // Renewal CRUD
//   const addRenewal = async (
//     renewalData: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.create(renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) => [
//           ...prev,
//           {
//             ...r,
//             createdAt: toDate(r.createdAt) ?? r.createdAt,
//             updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal:", err)
//       return false
//     }
//   }

//   const updateRenewal = async (
//     id: string,
//     renewalData: Partial<Renewal>,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.update(id, renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) =>
//           prev.map((renewal) =>
//             renewal.id === id
//               ? {
//                   ...r,
//                   createdAt: toDate(r.createdAt) ?? r.createdAt,
//                   updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//                 }
//               : renewal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update renewal:", err)
//       return false
//     }
//   }

//   const deleteRenewal = async (id: string): Promise<boolean> => {
//     try {
//       await renewalsApi.delete(id)
//       setRenewals((prev) => prev.filter((renewal) => renewal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete renewal:", err)
//       return false
//     }
//   }

//   const value: CRMContextType = {
//     customers,
//     leads,
//     deals,
//     tasks,
//     invoices,
//     renewalReminders,
//     renewals,
//     users,
//     isLoading,
//     error,
//     addCustomer,
//     updateCustomer,
//     deleteCustomer,
//     moveCustomerToLead,
//     addLead,
//     updateLead,
//     deleteLead,
//     convertLead,
//     addDeal,
//     updateDeal,
//     deleteDeal,
//     addTask,
//     updateTask,
//     deleteTask,
//     addInvoice,
//     updateInvoice,
//     deleteInvoice,
//     addRenewalReminder,
//     updateRenewalReminder,
//     deleteRenewalReminder,
//     addRenewal,
//     updateRenewal,
//     deleteRenewal,
//     refreshData,
//     refreshCustomers,
//     refreshLeads,
//     refreshDeals,
//     refreshTasks,
//     refreshInvoices,
//     refreshRenewals,
//     refreshUsers,
//   }

//   return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
// }

// export function useCRM() {
//   const context = useContext(CRMContext)
//   if (context === undefined) {
//     throw new Error("useCRM must be used within a CRMProvider")
//   }
//   return context
// }


//testing for new changes(18-12-2025)
// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type {
//   Customer,
//   Lead,
//   Deal,
//   Task,
//   Invoice,
//   RenewalReminder,
//   Renewal,
// } from "@/types/crm"
// import {
//   customersApi,
//   leadsApi,
//   dealsApi,
//   tasksApi,
//   invoicesApi,
//   renewalsApi,
// } from "@/lib/api"

// // Add User type
// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// // Lead filter type (for backend query)
// interface LeadFilters {
//   status?: string
//   priority?: string
//   service?: string
//   assignedTo?: string
// }

// // Context type
// interface CRMContextType {
//   customers: Customer[]
//   leads: Lead[]
//   deals: Deal[]
//   tasks: Task[]
//   invoices: Invoice[]
//   renewalReminders: RenewalReminder[]
//   renewals: Renewal[]
//   users: User[]

//   // auth / user
//   currentUser: User | null
//   setCurrentUser: (user: User | null) => void

//   // lead filters (for /api/leads)
//   leadFilters: LeadFilters
//   setLeadFilters: React.Dispatch<React.SetStateAction<LeadFilters>>

//   isLoading: boolean
//   error: string | null

//   addCustomer: (
//     customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
//   deleteCustomer: (id: string) => Promise<boolean>
//   moveCustomerToLead: (id: string) => Promise<boolean>

//   addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>
//   deleteLead: (id: string) => Promise<boolean>
//   convertLead: (id: string, customerData?: any) => Promise<boolean>

//   addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>
//   deleteDeal: (id: string) => Promise<boolean>

//   addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateTask: (id: string, task: Partial<Task>) => Promise<boolean>
//   deleteTask: (id: string) => Promise<boolean>

//   addInvoice: (
//     invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   updateInvoice: (
//     id: string,
//     invoice: Partial<Invoice>,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   deleteInvoice: (id: string) => Promise<boolean>

//   addRenewalReminder: (
//     reminder: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewalReminder: (
//     id: string,
//     reminder: Partial<RenewalReminder>,
//   ) => Promise<boolean>
//   deleteRenewalReminder: (id: string) => Promise<boolean>

//   addRenewal: (
//     renewal: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewal: (id: string, renewal: Partial<Renewal>) => Promise<boolean>
//   deleteRenewal: (id: string) => Promise<boolean>

//   refreshData: () => Promise<void>
//   refreshCustomers: () => Promise<void>
//   refreshLeads: () => Promise<void>
//   refreshDeals: () => Promise<void>
//   refreshTasks: () => Promise<void>
//   refreshInvoices: () => Promise<void>
//   refreshRenewals: () => Promise<void>
//   refreshUsers: () => Promise<void>
// }

// const CRMContext = createContext<CRMContextType | undefined>(undefined)

// // Helpers
// const toDate = (value: unknown): Date | null => {
//   if (!value) return null
//   if (value instanceof Date) return value
//   const d = new Date(value as string)
//   return Number.isNaN(d.getTime()) ? null : d
// }

// // Normalize a raw customer from API/DB into app Customer type
// const normalizeCustomer = (raw: any): Customer => ({
//   id: String(raw.id),
//   name: raw.name,
//   email: raw.email,
//   phone: raw.phone,
//   company: raw.company,
//   address: raw.address,
//   city: raw.city,
//   state: raw.state,
//   zipCode: raw.zip_code ?? raw.zipCode,
//   country: raw.country,
//   status: raw.status,
//   source: raw.source,
//   tags: Array.isArray(raw.tags)
//     ? raw.tags
//     : (() => {
//         try {
//           return raw.tags ? JSON.parse(raw.tags) : []
//         } catch {
//           return []
//         }
//       })(),
//   notes: raw.notes,
//   totalValue:
//     typeof raw.totalValue === "number"
//       ? raw.totalValue
//       : typeof raw.total_value === "number"
//       ? raw.total_value
//       : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
//   lastContactDate:
//     toDate(raw.lastContactDate ?? raw.last_contact_date) ??
//     (raw.lastContactDate ?? raw.last_contact_date),
//   createdAt:
//     toDate(raw.createdAt ?? raw.created_at) ??
//     (raw.createdAt ?? raw.created_at),
//   updatedAt:
//     toDate(raw.updatedAt ?? raw.updated_at) ??
//     (raw.updatedAt ?? raw.updated_at),

//   // invoice defaults
//   defaultTaxRate:
//     typeof raw.default_tax_rate === "number"
//       ? raw.default_tax_rate
//       : typeof raw.defaultTaxRate === "number"
//       ? raw.defaultTaxRate
//       : raw.default_tax_rate != null || raw.defaultTaxRate != null
//       ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
//       : undefined,
//   defaultDueDays:
//     typeof raw.default_due_days === "number"
//       ? raw.default_due_days
//       : typeof raw.defaultDueDays === "number"
//       ? raw.defaultDueDays
//       : raw.default_due_days != null || raw.defaultDueDays != null
//       ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
//       : undefined,
//   defaultInvoiceNotes:
//     raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

//   // recurring / subscription info
//   recurringEnabled:
//     raw.recurring_enabled ?? raw.recurringEnabled ?? false,
//   recurringInterval:
//     raw.recurring_interval ?? raw.recurringInterval ?? null,
//   recurringAmount:
//     typeof raw.recurring_amount === "number"
//       ? raw.recurring_amount
//       : typeof raw.recurringAmount === "number"
//       ? raw.recurringAmount
//       : raw.recurring_amount != null || raw.recurringAmount != null
//       ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
//       : undefined,
//   recurringService:
//     raw.recurring_service ?? raw.recurringService ?? null,

//   // renewal defaults
//   defaultRenewalStatus:
//     raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
//   defaultRenewalReminderDays:
//     typeof raw.default_renewal_reminder_days === "number"
//       ? raw.default_renewal_reminder_days
//       : typeof raw.defaultRenewalReminderDays === "number"
//       ? raw.defaultRenewalReminderDays
//       : raw.default_renewal_reminder_days != null ||
//         raw.defaultRenewalReminderDays != null
//       ? Number(
//           raw.default_renewal_reminder_days ??
//             raw.defaultRenewalReminderDays ??
//             0,
//         )
//       : undefined,
//   defaultRenewalNotes:
//     raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
//   nextRenewalDate:
//     toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
//     (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
// })

// // Normalize a raw lead from API/DB into app Lead type
// const normalizeLead = (raw: any): Lead =>
//   ({
//     id: String(raw.id),
//     name: raw.name ?? "",
//     email: raw.email ?? "",
//     phone: raw.phone ?? "",
//     company: raw.company ?? "",
//     source: raw.source ?? "website",
//     status: raw.status ?? "new",
//     priority: raw.priority ?? "medium",
//     assignedTo: raw.assigned_to ?? raw.assignedTo ?? "",
//     estimatedValue:
//       typeof raw.estimated_value === "number"
//         ? raw.estimated_value
//         : typeof raw.estimatedValue === "number"
//         ? raw.estimatedValue
//         : Number(raw.estimated_value ?? raw.estimatedValue ?? 0) || 0,
//     notes: raw.notes ?? "",
//     expectedCloseDate:
//       toDate(raw.expected_close_date ?? raw.expectedCloseDate) ??
//       (raw.expected_close_date ?? raw.expectedCloseDate ?? null),
//     whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber ?? "",
//     service: raw.service ?? undefined,
//     createdAt:
//       toDate(raw.created_at ?? raw.createdAt) ??
//       (raw.created_at ?? raw.createdAt),
//     updatedAt:
//       toDate(raw.updated_at ?? raw.updatedAt) ??
//       (raw.updated_at ?? raw.updatedAt),
//     lastContactDate:
//       toDate(raw.last_contact_date ?? raw.lastContactDate) ??
//       (raw.last_contact_date ?? raw.lastContactDate ?? null),

//     // conversion info (for hiding in list but keeping for stats)
//     isConverted: Boolean(raw.is_converted ?? raw.isConverted ?? false),
//     convertedCustomerId:
//       raw.converted_customer_id ?? raw.convertedCustomerId ?? null,
//   } as Lead)

// export function CRMProvider({ children }: { children: React.ReactNode }) {
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [leads, setLeads] = useState<Lead[]>([])
//   const [deals, setDeals] = useState<Deal[]>([])
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>([])
//   const [renewals, setRenewals] = useState<Renewal[]>([])
//   const [users, setUsers] = useState<User[]>([])

//   const [currentUser, setCurrentUser] = useState<User | null>(null)
//   const [leadFilters, setLeadFilters] = useState<LeadFilters>({})

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     void refreshData()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const refreshData = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       await Promise.all([
//         refreshCustomers(),
//         refreshLeads(),
//         refreshDeals(),
//         refreshTasks(),
//         refreshInvoices(),
//         refreshRenewals(),
//         refreshUsers(),
//       ])
//     } catch (err) {
//       console.error("Failed to load CRM data:", err)
//       setError(
//         err instanceof Error ? err.message : "Failed to load CRM data",
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // const refreshUsers = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `${
//   //         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
//   //       }/api/users`,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //         },
//   //       },
//   //     )

//   //     if (response.ok) {
//   //       const data = await response.json()
//   //       setUsers(data.users || [])
//   //     }
//   //   } catch (err) {
//   //     console.error("Failed to fetch users:", err)
//   //     setUsers([
//   //       {
//   //         id: "user1",
//   //         name: "Default User",
//   //         email: "user@example.com",
//   //         role: "admin",
//   //       },
//   //     ])
//   //   }
//   // }

// //   test


// const refreshUsers = async () => {
//   try {
//     const response = await fetch(
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/users",
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       },
//     )

//     if (response.ok) {
//       const data = await response.json()
//       setUsers(data.users)
//     } else {
//       // e.g. 401 fallback
//       setUsers([
//         { id: "user1", name: "Default User", email: "user@example.com", role: "admin" },
//       ])
//     }
//   } catch (err) {
//     console.error("Failed to fetch users", err)
//     setUsers([
//       { id: "user1", name: "Default User", email: "user@example.com", role: "admin" },
//     ])
//   }
// }



//   const refreshCustomers = async () => {
//     try {
//       const response = await customersApi.getAll({ limit: 100 })
//       const list = (response.customers || []) as any[]
//       setCustomers(list.map((c) => normalizeCustomer(c)))
//     } catch (err) {
//       console.error("Failed to fetch customers:", err)
//       throw err
//     }
//   }

//   const refreshLeads = async () => {
//     try {
//       const params: any = {
//         limit: 100,
//       }

//       if (leadFilters.status && leadFilters.status !== "all") {
//         params.status = leadFilters.status
//       }
//       if (leadFilters.priority && leadFilters.priority !== "all") {
//         params.priority = leadFilters.priority
//       }
//       if (leadFilters.service && leadFilters.service !== "all") {
//         params.service = leadFilters.service
//       }
//       if (leadFilters.assignedTo) {
//         params.assignedTo = leadFilters.assignedTo
//       }

//       const response = await leadsApi.getAll(params)
//       const list = (response.leads || []) as any[]
//       setLeads(list.map((l) => normalizeLead(l)))
//     } catch (err) {
//       console.error("Failed to fetch leads:", err)
//       throw err
//     }
//   }

//   const refreshDeals = async () => {
//     try {
//       const response = await dealsApi.getAll({ limit: 100 })
//       const list = (response.deals || []) as Deal[]
//       setDeals(
//         list.map((d) => ({
//           ...d,
//           createdAt: toDate(d.createdAt) ?? d.createdAt,
//           updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//           expectedCloseDate:
//             toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           value:
//             typeof d.value === "number" ? d.value : Number(d.value ?? 0) || 0,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch deals:", err)
//       throw err
//     }
//   }

//   const refreshTasks = async () => {
//     try {
//       const response = await tasksApi.getAll({ limit: 100 })
//       const list = (response.tasks || []) as Task[]
//       setTasks(
//         list.map((t) => ({
//           ...t,
//           createdAt: toDate(t.createdAt) ?? t.createdAt,
//           updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           dueDate: toDate(t.dueDate) ?? t.dueDate,
//           completedAt: toDate(t.completedAt) ?? t.completedAt,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err)
//       throw err
//     }
//   }

//   const refreshInvoices = async () => {
//     try {
//       const response = await invoicesApi.getAll({ limit: 100 })
//       const list = (response.invoices || []) as any[]

//       setInvoices(
//         list.map((inv) => ({
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? inv.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? inv.issueDate) ??
//             (inv.created_at ?? inv.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? inv.dueDate) ??
//             (inv.due_date ?? inv.dueDate),
//           status: inv.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : Number(inv.amount ?? 0) || 0, // subtotal
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : Number(inv.tax ?? 0) || 0, // GST rate
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : Number(inv.discount ?? 0) || 0,
//           total:
//             typeof inv.total === "number"
//               ? inv.total
//               : Number(inv.total ?? 0) || 0, // total with GST
//           notes: inv.notes ?? "",
//           items: Array.isArray(inv.items) ? inv.items : [],
//           createdAt:
//             toDate(inv.created_at ?? inv.createdAt) ??
//             (inv.created_at ?? inv.createdAt),
//           updatedAt:
//             toDate(inv.updated_at ?? inv.updatedAt) ??
//             (inv.updated_at ?? inv.updatedAt),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch invoices:", err)
//       throw err
//     }
//   }

//   const refreshRenewals = async () => {
//     try {
//       const [renewalsResponse, remindersResponse] = await Promise.all([
//         renewalsApi.getAll({ limit: 100 }),
//         renewalsApi.getReminders(),
//       ])

//       const renewalsList = (renewalsResponse.renewals || []) as Renewal[]
//       const remindersList =
//         (remindersResponse.reminders || []) as RenewalReminder[]

//       setRenewals(
//         renewalsList.map((r) => ({
//           ...r,
//           createdAt: toDate(r.createdAt) ?? r.createdAt,
//           updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           startDate: toDate(r.startDate) ?? r.startDate,
//           endDate: toDate(r.endDate) ?? r.endDate,
//           amount:
//             typeof r.amount === "number"
//               ? r.amount
//               : Number(r.amount ?? 0) || 0,
//         })),
//       )

//       setRenewalReminders(
//         remindersList.map((rr) => ({
//           ...rr,
//           createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//           updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           expiryDate: toDate(rr.expiryDate) ?? rr.expiryDate,
//           lastReminderSent:
//             toDate(rr.lastReminderSent) ?? rr.lastReminderSent,
//           reminderDays: Array.isArray(rr.reminderDays)
//             ? rr.reminderDays
//             : (() => {
//                 try {
//                   return JSON.parse(
//                     (rr.reminderDays as unknown as string) || "[]",
//                   ) as number[]
//                 } catch {
//                   return []
//                 }
//               })(),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch renewals:", err)
//       throw err
//     }
//   }

//   // Customer CRUD
//   const addCustomer = async (
//     customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const payload = {
//         ...customerData,
//         totalValue:
//           customerData.totalValue !== undefined &&
//           customerData.totalValue !== null &&
//           customerData.totalValue !== ""
//             ? Number(customerData.totalValue)
//             : 0,
//       }

//       const response = await customersApi.create(payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) => [c, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add customer:", err)
//       throw err
//     }
//   }

//   const updateCustomer = async (
//     id: string,
//     customerData: Partial<Customer>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...customerData }
//       if ("totalValue" in payload) {
//         const v = payload.totalValue
//         payload.totalValue =
//           v !== undefined && v !== null && v !== "" ? Number(v) : 0
//       }

//       const response = await customersApi.update(id, payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) =>
//           prev.map((customer) => (customer.id === id ? c : customer)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update customer:", err)
//       throw err
//     }
//   }

//   const deleteCustomer = async (id: string): Promise<boolean> => {
//     try {
//       await customersApi.delete(id)
//       setCustomers((prev) => prev.filter((customer) => customer.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete customer:", err)
//       return false
//     }
//   }

//   // Move customer back to lead WITHOUT deleting (keeps deals/invoices intact)
//   const moveCustomerToLead = async (id: string): Promise<boolean> => {
//     try {
//       const response = await customersApi.moveToLead(id)

//       setCustomers((prev) =>
//         prev.map((c) =>
//           c.id === id ? { ...c, status: "inactive" } : c,
//         ),
//       )

//       await refreshLeads()

//       return true
//     } catch (err) {
//       console.error("Failed to move customer to lead:", err)
//       return false
//     }
//   }

//   // Lead CRUD
//   const addLead = async (
//     leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.create(leadData)
//       if (response.lead) {
//         const l = normalizeLead(response.lead)
//         setLeads((prev) => [...prev, l])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add lead:", err)
//       return false
//     }
//   }

//   const updateLead = async (
//     id: string,
//     leadData: Partial<Lead>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...leadData }

//       // Normalize expectedCloseDate for MySQL DATE (yyyy-mm-dd)
//       if (payload.expectedCloseDate instanceof Date) {
//         const d = payload.expectedCloseDate
//         const year = d.getFullYear()
//         const month = String(d.getMonth() + 1).padStart(2, "0")
//         const day = String(d.getDate()).padStart(2, "0")
//         payload.expectedCloseDate = `${year}-${month}-${day}`
//       } else if (typeof payload.expectedCloseDate === "string") {
//         if (payload.expectedCloseDate.includes("T")) {
//           payload.expectedCloseDate = payload.expectedCloseDate.split("T")[0]
//         }
//       }

//       const response = await leadsApi.update(id, payload)

//       if (response.lead) {
//         const l = normalizeLead(response.lead)
//         setLeads((prev) => prev.map((lead) => (lead.id === id ? l : lead)))
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update lead:", err)
//       return false
//     }
//   }

//   const deleteLead = async (id: string): Promise<boolean> => {
//     try {
//       await leadsApi.delete(id)
//       setLeads((prev) => prev.filter((lead) => lead.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete lead:", err)
//       return false
//     }
//   }

//   const convertLead = async (
//     id: string,
//     customerData?: any,
//   ): Promise<boolean> => {
//     try {
//       const dataWithFlag = {
//         ...customerData,
//         fromLead: true,
//       }

//       const response = await leadsApi.convertToCustomer(id, dataWithFlag)

//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         const customerWithFlag = { ...c, fromLead: true } as any

//         setCustomers((prev) => [...prev, customerWithFlag])
//         setLeads((prev) =>
//           prev.map((lead) =>
//             lead.id === id
//               ? {
//                   ...lead,
//                   status: "closed-won",
//                   isConverted: true,
//                   convertedCustomerId: customerWithFlag.id,
//                 }
//               : lead,
//           ),
//         )

//         return true
//       }

//       if ((response as any).error) {
//         throw new Error((response as any).error)
//       }

//       return false
//     } catch (err: any) {
//       console.error("Failed to convert lead:", err)
//       alert(err?.message || "Failed to convert lead to customer")
//       return false
//     }
//   }

//   // Deal CRUD
//   const addDeal = async (
//     dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData = {
//         ...dealData,
//         expectedCloseDate: dealData.expectedCloseDate
//           ? dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//           : null,
//         ...(dealData.actualCloseDate && {
//           actualCloseDate:
//             dealData.actualCloseDate instanceof Date
//               ? dealData.actualCloseDate.toISOString()
//               : dealData.actualCloseDate,
//         }),
//         products: Array.isArray(dealData.products)
//           ? dealData.products
//           : [],
//       }

//       const response = await dealsApi.create(formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) => [
//           ...prev,
//           {
//             ...d,
//             createdAt: toDate(d.createdAt) ?? d.createdAt,
//             updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//             expectedCloseDate:
//               toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add deal:", err)
//       return false
//     }
//   }

//   const updateDeal = async (
//     id: string,
//     dealData: Partial<Deal>,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData: any = { ...dealData }

//       if (dealData.expectedCloseDate) {
//         formattedDealData.expectedCloseDate =
//           dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//       }

//       if (dealData.actualCloseDate) {
//         formattedDealData.actualCloseDate =
//           dealData.actualCloseDate instanceof Date
//             ? dealData.actualCloseDate.toISOString()
//             : dealData.actualCloseDate
//       }

//       const response = await dealsApi.update(id, formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) =>
//           prev.map((deal) =>
//             deal.id === id
//               ? {
//                   ...d,
//                   createdAt: toDate(d.createdAt) ?? d.createdAt,
//                   updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//                   expectedCloseDate:
//                     toDate(d.expectedCloseDate) ??
//                     d.expectedCloseDate,
//                 }
//               : deal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update deal:", err)
//       return false
//     }
//   }

//   const deleteDeal = async (id: string): Promise<boolean> => {
//     try {
//       await dealsApi.delete(id)
//       setDeals((prev) => prev.filter((deal) => deal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete deal:", err)
//       return false
//     }
//   }

//   // Task CRUD
//   const addTask = async (
//     taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.create(taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) => [
//           ...prev,
//           {
//             ...t,
//             createdAt: toDate(t.createdAt) ?? t.createdAt,
//             updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add task:", err)
//       return false
//     }
//   }

//   const updateTask = async (
//     id: string,
//     taskData: Partial<Task>,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.update(id, taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.id === id
//               ? {
//                   ...t,
//                   createdAt: toDate(t.createdAt) ?? t.createdAt,
//                   updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//                 }
//               : task,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update task:", err)
//       return false
//     }
//   }

//   const deleteTask = async (id: string): Promise<boolean> => {
//     try {
//       await tasksApi.delete(id)
//       setTasks((prev) => prev.filter((task) => task.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete task:", err)
//       return false
//     }
//   }

//   // Invoice CRUD
//   const addInvoice = async (
//     invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           return {
//             customerId: invoiceData.customerId,
//             amount: subtotal,
//             tax: taxNumber,
//             total,
//             status: invoiceData.status,
//             dueDate: invoiceData.dueDate,
//             items:
//               invoiceData.items?.map((it) => ({
//                 description: it.description,
//                 quantity: it.quantity,
//                 rate: it.rate,
//                 amount: it.amount,
//               })) ?? [],
//             notes: invoiceData.notes,
//           }
//         })()

//       const response = await invoicesApi.create(payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber,
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at ?? new Date()) ?? new Date(),
//           updatedAt:
//             toDate(inv.updated_at ?? new Date()) ?? new Date(),
//         }

//         setInvoices((prev) => [normalized, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add invoice:", err)
//       return false
//     }
//   }

//   const updateInvoice = async (
//     id: string,
//     invoiceData: Partial<Invoice>,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) /
//             100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           const base: any = {}

//           if (invoiceData.customerId) base.customerId = invoiceData.customerId
//           if (subtotal !== undefined) base.amount = subtotal
//           if (taxNumber !== undefined) base.tax = taxNumber
//           base.total = total
//           if (invoiceData.status) base.status = invoiceData.status
//           if (invoiceData.dueDate) base.dueDate = invoiceData.dueDate
//           if (invoiceData.notes !== undefined) base.notes = invoiceData.notes

//           if (invoiceData.items) {
//             base.items = invoiceData.items.map((it) => ({
//               description: it.description,
//               quantity: it.quantity,
//               rate: it.rate,
//               amount: it.amount,
//             }))
//           }

//           return base
//         })()

//       const response = await invoicesApi.update(id, payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status ?? "draft",
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount ?? 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax ?? 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at) ??
//             invoiceData.createdAt ??
//             new Date(),
//           updatedAt:
//             toDate(inv.updated_at) ?? new Date(),
//         }

//         setInvoices((prev) =>
//           prev.map((invoice) =>
//             invoice.id === id ? normalized : invoice,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update invoice:", err)
//       return false
//     }
//   }

//   const deleteInvoice = async (id: string): Promise<boolean> => {
//     try {
//       await invoicesApi.delete(id)
//       setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete invoice:", err)
//       return false
//     }
//   }

//   // Renewal reminder CRUD
//   const addRenewalReminder = async (
//     reminderData: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.createReminder(reminderData)
//       if (response.reminder) {
//         const rr = response.reminder as RenewalReminder
//         setRenewalReminders((prev) => [
//           ...prev,
//           {
//             ...rr,
//             createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//             updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal reminder:", err)
//       return false
//     }
//   }

//   const updateRenewalReminder = async (
//     _id: string,
//     _reminderData: Partial<RenewalReminder>,
//   ): Promise<boolean> => {
//     console.warn("Update renewal reminder not implemented in backend yet")
//     return false
//   }

//   const deleteRenewalReminder = async (_id: string): Promise<boolean> => {
//     console.warn("Delete renewal reminder not implemented in backend yet")
//     return false
//   }

//   // Renewal CRUD
//   const addRenewal = async (
//     renewalData: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.create(renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) => [
//           ...prev,
//           {
//             ...r,
//             createdAt: toDate(r.createdAt) ?? r.createdAt,
//             updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal:", err)
//       return false
//     }
//   }

//   const updateRenewal = async (
//     id: string,
//     renewalData: Partial<Renewal>,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.update(id, renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) =>
//           prev.map((renewal) =>
//             renewal.id === id
//               ? {
//                   ...r,
//                   createdAt: toDate(r.createdAt) ?? r.createdAt,
//                   updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//                 }
//               : renewal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update renewal:", err)
//       return false
//     }
//   }

//   const deleteRenewal = async (id: string): Promise<boolean> => {
//     try {
//       await renewalsApi.delete(id)
//       setRenewals((prev) => prev.filter((renewal) => renewal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete renewal:", err)
//       return false
//     }
//   }

//   const value: CRMContextType = {
//     customers,
//     leads,
//     deals,
//     tasks,
//     invoices,
//     renewalReminders,
//     renewals,
//     users,
//     currentUser,
//     setCurrentUser,
//     leadFilters,
//     setLeadFilters,
//     isLoading,
//     error,
//     addCustomer,
//     updateCustomer,
//     deleteCustomer,
//     moveCustomerToLead,
//     addLead,
//     updateLead,
//     deleteLead,
//     convertLead,
//     addDeal,
//     updateDeal,
//     deleteDeal,
//     addTask,
//     updateTask,
//     deleteTask,
//     addInvoice,
//     updateInvoice,
//     deleteInvoice,
//     addRenewalReminder,
//     updateRenewalReminder,
//     deleteRenewalReminder,
//     addRenewal,
//     updateRenewal,
//     deleteRenewal,
//     refreshData,
//     refreshCustomers,
//     refreshLeads,
//     refreshDeals,
//     refreshTasks,
//     refreshInvoices,
//     refreshRenewals,
//     refreshUsers,
//   }

//   return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
// }

// export function useCRM() {
//   const context = useContext(CRMContext)
//   if (context === undefined) {
//     throw new Error("useCRM must be used within a CRMProvider")
//   }
//   return context
// }


//testing 2 (18-12-2025)




// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type {
//   Customer,
//   Lead,
//   Deal,
//   Task,
//   Invoice,
//   RenewalReminder,
//   Renewal,
// } from "@/types/crm"
// import {
//   customersApi,
//   leadsApi,
//   dealsApi,
//   tasksApi,
//   invoicesApi,
//   renewalsApi,
// } from "@/lib/api"

// // Add User type
// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// // Lead filter type (for backend query)
// interface LeadFilters {
//   status?: string
//   priority?: string
//   service?: string
//   assignedTo?: string
// }

// // Context type
// interface CRMContextType {
//   customers: Customer[]
//   leads: Lead[]
//   deals: Deal[]
//   tasks: Task[]
//   invoices: Invoice[]
//   renewalReminders: RenewalReminder[]
//   renewals: Renewal[]
//   users: User[]

//   // auth / user
//   currentUser: User | null
//   setCurrentUser: (user: User | null) => void

//   // lead filters (for /api/leads)
//   leadFilters: LeadFilters
//   setLeadFilters: React.Dispatch<React.SetStateAction<LeadFilters>>

//   isLoading: boolean
//   error: string | null

//   addCustomer: (
//     customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
//   deleteCustomer: (id: string) => Promise<boolean>
//   moveCustomerToLead: (id: string) => Promise<boolean>

//   addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>
//   deleteLead: (id: string) => Promise<boolean>
//   convertLead: (id: string, customerData?: any) => Promise<boolean>

//   addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>
//   deleteDeal: (id: string) => Promise<boolean>

//   addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
//   updateTask: (id: string, task: Partial<Task>) => Promise<boolean>
//   deleteTask: (id: string) => Promise<boolean>

//   addInvoice: (
//     invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   updateInvoice: (
//     id: string,
//     invoice: Partial<Invoice>,
//     apiPayload?: any,
//   ) => Promise<boolean>
//   deleteInvoice: (id: string) => Promise<boolean>

//   addRenewalReminder: (
//     reminder: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewalReminder: (
//     id: string,
//     reminder: Partial<RenewalReminder>,
//   ) => Promise<boolean>
//   deleteRenewalReminder: (id: string) => Promise<boolean>

//   addRenewal: (
//     renewal: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ) => Promise<boolean>
//   updateRenewal: (id: string, renewal: Partial<Renewal>) => Promise<boolean>
//   deleteRenewal: (id: string) => Promise<boolean>

//   refreshData: () => Promise<void>
//   refreshCustomers: () => Promise<void>
//   refreshLeads: () => Promise<void>
//   refreshDeals: () => Promise<void>
//   refreshTasks: () => Promise<void>
//   refreshInvoices: () => Promise<void>
//   refreshRenewals: () => Promise<void>
//   refreshUsers: () => Promise<void>
// }

// const CRMContext = createContext<CRMContextType | undefined>(undefined)

// // Helpers
// const toDate = (value: unknown): Date | null => {
//   if (!value) return null
//   if (value instanceof Date) return value
//   const d = new Date(value as string)
//   return Number.isNaN(d.getTime()) ? null : d
// }

// // Normalize a raw customer from API/DB into app Customer type
// const normalizeCustomer = (raw: any): Customer => ({
//   id: String(raw.id),
//   name: raw.name,
//   email: raw.email,
//   phone: raw.phone,
//   company: raw.company,
//   address: raw.address,
//   city: raw.city,
//   state: raw.state,
//   zipCode: raw.zip_code ?? raw.zipCode,
//   country: raw.country,
//   status: raw.status,
//   source: raw.source,
//   tags: Array.isArray(raw.tags)
//     ? raw.tags
//     : (() => {
//         try {
//           return raw.tags ? JSON.parse(raw.tags) : []
//         } catch {
//           return []
//         }
//       })(),
//   notes: raw.notes,
//   totalValue:
//     typeof raw.totalValue === "number"
//       ? raw.totalValue
//       : typeof raw.total_value === "number"
//       ? raw.total_value
//       : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
//   lastContactDate:
//     toDate(raw.lastContactDate ?? raw.last_contact_date) ??
//     (raw.lastContactDate ?? raw.last_contact_date),
//   createdAt:
//     toDate(raw.createdAt ?? raw.created_at) ?? (raw.createdAt ?? raw.created_at),
//   updatedAt:
//     toDate(raw.updatedAt ?? raw.updated_at) ?? (raw.updatedAt ?? raw.updated_at),

//   // invoice defaults
//   defaultTaxRate:
//     typeof raw.default_tax_rate === "number"
//       ? raw.default_tax_rate
//       : typeof raw.defaultTaxRate === "number"
//       ? raw.defaultTaxRate
//       : raw.default_tax_rate != null || raw.defaultTaxRate != null
//       ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
//       : undefined,
//   defaultDueDays:
//     typeof raw.default_due_days === "number"
//       ? raw.default_due_days
//       : typeof raw.defaultDueDays === "number"
//       ? raw.defaultDueDays
//       : raw.default_due_days != null || raw.defaultDueDays != null
//       ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
//       : undefined,
//   defaultInvoiceNotes: raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

//   // recurring / subscription info
//   recurringEnabled: raw.recurring_enabled ?? raw.recurringEnabled ?? false,
//   recurringInterval: raw.recurring_interval ?? raw.recurringInterval ?? null,
//   recurringAmount:
//     typeof raw.recurring_amount === "number"
//       ? raw.recurring_amount
//       : typeof raw.recurringAmount === "number"
//       ? raw.recurringAmount
//       : raw.recurring_amount != null || raw.recurringAmount != null
//       ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
//       : undefined,
//   recurringService: raw.recurring_service ?? raw.recurringService ?? null,

//   // renewal defaults
//   defaultRenewalStatus:
//     raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
//   defaultRenewalReminderDays:
//     typeof raw.default_renewal_reminder_days === "number"
//       ? raw.default_renewal_reminder_days
//       : typeof raw.defaultRenewalReminderDays === "number"
//       ? raw.defaultRenewalReminderDays
//       : raw.default_renewal_reminder_days != null ||
//         raw.defaultRenewalReminderDays != null
//       ? Number(
//           raw.default_renewal_reminder_days ??
//             raw.defaultRenewalReminderDays ??
//             0,
//         )
//       : undefined,
//   defaultRenewalNotes: raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
//   nextRenewalDate:
//     toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
//     (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
// })

// // Normalize a raw lead from API/DB into app Lead type
// const normalizeLead = (raw: any): Lead =>
//   ({
//     id: String(raw.id),
//     name: raw.name ?? "",
//     email: raw.email ?? "",
//     phone: raw.phone ?? "",
//     company: raw.company ?? "",
//     source: raw.source ?? "website",
//     status: raw.status ?? "new",
//     priority: raw.priority ?? "medium",
//     assignedTo: raw.assigned_to ?? raw.assignedTo ?? "",
//     estimatedValue:
//       typeof raw.estimated_value === "number"
//         ? raw.estimated_value
//         : typeof raw.estimatedValue === "number"
//         ? raw.estimatedValue
//         : Number(raw.estimated_value ?? raw.estimatedValue ?? 0) || 0,
//     notes: raw.notes ?? "",
//     expectedCloseDate:
//       toDate(raw.expected_close_date ?? raw.expectedCloseDate) ??
//       (raw.expected_close_date ?? raw.expectedCloseDate ?? null),
//     whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber ?? "",
//     service: raw.service ?? undefined,
//     createdAt:
//       toDate(raw.created_at ?? raw.createdAt) ?? (raw.created_at ?? raw.createdAt),
//     updatedAt:
//       toDate(raw.updated_at ?? raw.updatedAt) ?? (raw.updated_at ?? raw.updatedAt),
//     lastContactDate:
//       toDate(raw.last_contact_date ?? raw.lastContactDate) ??
//       (raw.last_contact_date ?? raw.lastContactDate ?? null),

//     // conversion info (for hiding in list but keeping for stats)
//     isConverted: Boolean(raw.is_converted ?? raw.isConverted ?? false),
//     convertedCustomerId:
//       raw.converted_customer_id ?? raw.convertedCustomerId ?? null,
//   } as Lead)

// export function CRMProvider({ children }: { children: React.ReactNode }) {
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [leads, setLeads] = useState<Lead[]>([])
//   const [deals, setDeals] = useState<Deal[]>([])
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>([])
//   const [renewals, setRenewals] = useState<Renewal[]>([])
//   const [users, setUsers] = useState<User[]>([])

//   const [currentUser, setCurrentUser] = useState<User | null>(null)
//   const [leadFilters, setLeadFilters] = useState<LeadFilters>({})

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     void refreshData()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const refreshData = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       await Promise.all([
//         refreshCustomers(),
//         refreshLeads(),
//         refreshDeals(),
//         refreshTasks(),
//         refreshInvoices(),
//         refreshRenewals(),
//         refreshUsers(),
//       ])
//     } catch (err) {
//       console.error("Failed to load CRM data:", err)
//       setError(err instanceof Error ? err.message : "Failed to load CRM data")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshUsers = async () => {
//     try {
//       // Read token safely on client
//       const token =
//         typeof window !== "undefined" ? localStorage.getItem("token") : null

//       // If no token, skip hitting API and still provide a default user list
//       if (!token) {
//         console.warn("No token found, skipping /api/users")
//         setUsers([
//           {
//             id: "user1",
//             name: "Default User",
//             email: "user@example.com",
//             role: "admin",
//           },
//         ])
//         return
//       }

//       const baseUrl =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

//       const response = await fetch(`${baseUrl}/api/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUsers(Array.isArray(data.users) ? data.users : [])
//       } else {
//         console.warn("Users request failed, status:", response.status)
//         // Fallback so UI can still render filters
//         setUsers([
//           {
//             id: "user1",
//             name: "Default User",
//             email: "user@example.com",
//             role: "admin",
//           },
//         ])
//       }
//     } catch (err) {
//       console.error("Failed to fetch users", err)
//       setUsers([
//         {
//           id: "user1",
//           name: "Default User",
//           email: "user@example.com",
//           role: "admin",
//         },
//       ])
//     }
//   }

//   const refreshCustomers = async () => {
//     try {
//       const response = await customersApi.getAll({ limit: 100 })
//       const list = (response.customers || []) as any[]
//       setCustomers(list.map((c) => normalizeCustomer(c)))
//     } catch (err) {
//       console.error("Failed to fetch customers:", err)
//       throw err
//     }
//   }

//   // const refreshLeads = async () => {
//   //   try {
//   //     const params: any = {
//   //       limit: 100,
//   //     }

//   //     if (leadFilters.status && leadFilters.status !== "all") {
//   //       params.status = leadFilters.status
//   //     }
//   //     if (leadFilters.priority && leadFilters.priority !== "all") {
//   //       params.priority = leadFilters.priority
//   //     }
//   //     if (leadFilters.service && leadFilters.service !== "all") {
//   //       params.service = leadFilters.service
//   //     }
//   //     if (leadFilters.assignedTo) {
//   //       params.assignedTo = leadFilters.assignedTo
//   //     }

//   //     const response = await leadsApi.getAll(params)
//   //     const list = (response.leads || []) as any[]
//   //     setLeads(list.map((l) => normalizeLead(l)))
//   //   } catch (err) {
//   //     console.error("Failed to fetch leads:", err)
//   //     throw err
//   //   }
//   // }

//   //test

//   const refreshLeads = async () => {
//   try {
//     const params: any = {
//       limit: 100,
//     }

//     // Only add if meaningful, otherwise send null
//     params.status =
//       leadFilters.status && leadFilters.status !== "all"
//         ? leadFilters.status
//         : null

//     params.priority =
//       leadFilters.priority && leadFilters.priority !== "all"
//         ? leadFilters.priority
//         : null

//     params.service =
//       leadFilters.service && leadFilters.service !== "all"
//         ? leadFilters.service
//         : null

//     // If you actually support assignedTo on backend, normalize it too
//     params.assignedTo =
//       leadFilters.assignedTo && leadFilters.assignedTo !== "all"
//         ? leadFilters.assignedTo
//         : null

//     const response = await leadsApi.getAll(params)
//     const list = (response.leads || []) as any[]
//     setLeads(list.map((l) => normalizeLead(l)))
//   } catch (err) {
//     console.error("Failed to fetch leads:", err)
//     throw err
//   }
// }

//   const refreshDeals = async () => {
//     try {
//       const response = await dealsApi.getAll({ limit: 100 })
//       const list = (response.deals || []) as Deal[]
//       setDeals(
//         list.map((d) => ({
//           ...d,
//           createdAt: toDate(d.createdAt) ?? d.createdAt,
//           updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//           expectedCloseDate:
//             toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           value:
//             typeof d.value === "number" ? d.value : Number(d.value ?? 0) || 0,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch deals:", err)
//       throw err
//     }
//   }

//   const refreshTasks = async () => {
//     try {
//       const response = await tasksApi.getAll({ limit: 100 })
//       const list = (response.tasks || []) as Task[]
//       setTasks(
//         list.map((t) => ({
//           ...t,
//           createdAt: toDate(t.createdAt) ?? t.createdAt,
//           updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           dueDate: toDate(t.dueDate) ?? t.dueDate,
//           completedAt: toDate(t.completedAt) ?? t.completedAt,
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err)
//       throw err
//     }
//   }

//   const refreshInvoices = async () => {
//     try {
//       const response = await invoicesApi.getAll({ limit: 100 })
//       const list = (response.invoices || []) as any[]

//       setInvoices(
//         list.map((inv) => ({
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? inv.customerName ?? "",
//           invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? inv.issueDate) ??
//             (inv.created_at ?? inv.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? inv.dueDate) ??
//             (inv.due_date ?? inv.dueDate),
//           status: inv.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : Number(inv.amount ?? 0) || 0, // subtotal
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : Number(inv.tax ?? 0) || 0, // GST rate
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : Number(inv.discount ?? 0) || 0,
//           total:
//             typeof inv.total === "number"
//               ? inv.total
//               : Number(inv.total ?? 0) || 0, // total with GST
//           notes: inv.notes ?? "",
//           items: Array.isArray(inv.items) ? inv.items : [],
//           createdAt:
//             toDate(inv.created_at ?? inv.createdAt) ??
//             (inv.created_at ?? inv.createdAt),
//           updatedAt:
//             toDate(inv.updated_at ?? inv.updatedAt) ??
//             (inv.updated_at ?? inv.updatedAt),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch invoices:", err)
//       throw err
//     }
//   }

//   const refreshRenewals = async () => {
//     try {
//       const [renewalsResponse, remindersResponse] = await Promise.all([
//         renewalsApi.getAll({ limit: 100 }),
//         renewalsApi.getReminders(),
//       ])

//       const renewalsList = (renewalsResponse.renewals || []) as Renewal[]
//       const remindersList =
//         (remindersResponse.reminders || []) as RenewalReminder[]

//       setRenewals(
//         renewalsList.map((r) => ({
//           ...r,
//           createdAt: toDate(r.createdAt) ?? r.createdAt,
//           updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           startDate: toDate(r.startDate) ?? r.startDate,
//           endDate: toDate(r.endDate) ?? r.endDate,
//           amount:
//             typeof r.amount === "number"
//               ? r.amount
//               : Number(r.amount ?? 0) || 0,
//         })),
//       )

//       setRenewalReminders(
//         remindersList.map((rr) => ({
//           ...rr,
//           createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//           updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           expiryDate: toDate(rr.expiryDate) ?? rr.expiryDate,
//           lastReminderSent:
//             toDate(rr.lastReminderSent) ?? rr.lastReminderSent,
//           reminderDays: Array.isArray(rr.reminderDays)
//             ? rr.reminderDays
//             : (() => {
//                 try {
//                   return JSON.parse(
//                     (rr.reminderDays as unknown as string) || "[]",
//                   ) as number[]
//                 } catch {
//                   return []
//                 }
//               })(),
//         })),
//       )
//     } catch (err) {
//       console.error("Failed to fetch renewals:", err)
//       throw err
//     }
//   }

//   // Customer CRUD
//   const addCustomer = async (
//     customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const payload = {
//         ...customerData,
//         totalValue:
//           customerData.totalValue !== undefined &&
//           customerData.totalValue !== null &&
//           customerData.totalValue !== ""
//             ? Number(customerData.totalValue)
//             : 0,
//       }

//       const response = await customersApi.create(payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) => [c, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add customer:", err)
//       throw err
//     }
//   }

//   const updateCustomer = async (
//     id: string,
//     customerData: Partial<Customer>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...customerData }
//       if ("totalValue" in payload) {
//         const v = payload.totalValue
//         payload.totalValue =
//           v !== undefined && v !== null && v !== "" ? Number(v) : 0
//       }

//       const response = await customersApi.update(id, payload)
//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         setCustomers((prev) =>
//           prev.map((customer) => (customer.id === id ? c : customer)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update customer:", err)
//       throw err
//     }
//   }

//   const deleteCustomer = async (id: string): Promise<boolean> => {
//     try {
//       await customersApi.delete(id)
//       setCustomers((prev) => prev.filter((customer) => customer.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete customer:", err)
//       return false
//     }
//   }

//   // Move customer back to lead WITHOUT deleting (keeps deals/invoices intact)
//   const moveCustomerToLead = async (id: string): Promise<boolean> => {
//     try {
//       await customersApi.moveToLead(id)

//       setCustomers((prev) =>
//         prev.map((c) => (c.id === id ? { ...c, status: "inactive" } : c)),
//       )

//       await refreshLeads()

//       return true
//     } catch (err) {
//       console.error("Failed to move customer to lead:", err)
//       return false
//     }
//   }

//   // Lead CRUD
//   const addLead = async (
//     leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await leadsApi.create(leadData)
//       if (response.lead) {
//         const l = normalizeLead(response.lead)
//         setLeads((prev) => [...prev, l])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add lead:", err)
//       return false
//     }
//   }

//   const updateLead = async (
//     id: string,
//     leadData: Partial<Lead>,
//   ): Promise<boolean> => {
//     try {
//       const payload: any = { ...leadData }

//       // Normalize expectedCloseDate for MySQL DATE (yyyy-mm-dd)
//       if (payload.expectedCloseDate instanceof Date) {
//         const d = payload.expectedCloseDate
//         const year = d.getFullYear()
//         const month = String(d.getMonth() + 1).padStart(2, "0")
//         const day = String(d.getDate()).padStart(2, "0")
//         payload.expectedCloseDate = `${year}-${month}-${day}`
//       } else if (typeof payload.expectedCloseDate === "string") {
//         if (payload.expectedCloseDate.includes("T")) {
//           payload.expectedCloseDate = payload.expectedCloseDate.split("T")[0]
//         }
//       }

//       const response = await leadsApi.update(id, payload)

//       if (response.lead) {
//         const l = normalizeLead(response.lead)
//         setLeads((prev) => prev.map((lead) => (lead.id === id ? l : lead)))
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update lead:", err)
//       return false
//     }
//   }

//   const deleteLead = async (id: string): Promise<boolean> => {
//     try {
//       await leadsApi.delete(id)
//       setLeads((prev) => prev.filter((lead) => lead.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete lead:", err)
//       return false
//     }
//   }

//   const convertLead = async (
//     id: string,
//     customerData?: any,
//   ): Promise<boolean> => {
//     try {
//       const dataWithFlag = {
//         ...customerData,
//         fromLead: true,
//       }

//       const response = await leadsApi.convertToCustomer(id, dataWithFlag)

//       if (response.customer) {
//         const c = normalizeCustomer(response.customer)
//         const customerWithFlag = { ...c, fromLead: true } as any

//         setCustomers((prev) => [...prev, customerWithFlag])
//         setLeads((prev) =>
//           prev.map((lead) =>
//             lead.id === id
//               ? {
//                   ...lead,
//                   status: "closed-won",
//                   isConverted: true,
//                   convertedCustomerId: customerWithFlag.id,
//                 }
//               : lead,
//           ),
//         )

//         return true
//       }

//       if ((response as any).error) {
//         throw new Error((response as any).error)
//       }

//       return false
//     } catch (err: any) {
//       console.error("Failed to convert lead:", err)
//       alert(err?.message || "Failed to convert lead to customer")
//       return false
//     }
//   }

//   // Deal CRUD
//   const addDeal = async (
//     dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData = {
//         ...dealData,
//         expectedCloseDate: dealData.expectedCloseDate
//           ? dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//           : null,
//         ...(dealData.actualCloseDate && {
//           actualCloseDate:
//             dealData.actualCloseDate instanceof Date
//               ? dealData.actualCloseDate.toISOString()
//               : dealData.actualCloseDate,
//         }),
//         products: Array.isArray(dealData.products) ? dealData.products : [],
//       }

//       const response = await dealsApi.create(formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) => [
//           ...prev,
//           {
//             ...d,
//             createdAt: toDate(d.createdAt) ?? d.createdAt,
//             updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//             expectedCloseDate:
//               toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add deal:", err)
//       return false
//     }
//   }

//   const updateDeal = async (
//     id: string,
//     dealData: Partial<Deal>,
//   ): Promise<boolean> => {
//     try {
//       const formattedDealData: any = { ...dealData }

//       if (dealData.expectedCloseDate) {
//         formattedDealData.expectedCloseDate =
//           dealData.expectedCloseDate instanceof Date
//             ? dealData.expectedCloseDate.toISOString()
//             : dealData.expectedCloseDate
//       }

//       if (dealData.actualCloseDate) {
//         formattedDealData.actualCloseDate =
//           dealData.actualCloseDate instanceof Date
//             ? dealData.actualCloseDate.toISOString()
//             : dealData.actualCloseDate
//       }

//       const response = await dealsApi.update(id, formattedDealData)

//       if (response.deal) {
//         const d = response.deal as Deal
//         setDeals((prev) =>
//           prev.map((deal) =>
//             deal.id === id
//               ? {
//                   ...d,
//                   createdAt: toDate(d.createdAt) ?? d.createdAt,
//                   updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
//                   expectedCloseDate:
//                     toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
//                 }
//               : deal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update deal:", err)
//       return false
//     }
//   }

//   const deleteDeal = async (id: string): Promise<boolean> => {
//     try {
//       await dealsApi.delete(id)
//       setDeals((prev) => prev.filter((deal) => deal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete deal:", err)
//       return false
//     }
//   }

//   // Task CRUD
//   const addTask = async (
//     taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.create(taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) => [
//           ...prev,
//           {
//             ...t,
//             createdAt: toDate(t.createdAt) ?? t.createdAt,
//             updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add task:", err)
//       return false
//     }
//   }

//   const updateTask = async (
//     id: string,
//     taskData: Partial<Task>,
//   ): Promise<boolean> => {
//     try {
//       const response = await tasksApi.update(id, taskData)
//       if (response.task) {
//         const t = response.task as Task
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.id === id
//               ? {
//                   ...t,
//                   createdAt: toDate(t.createdAt) ?? t.createdAt,
//                   updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
//                 }
//               : task,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update task:", err)
//       return false
//     }
//   }

//   const deleteTask = async (id: string): Promise<boolean> => {
//     try {
//       await tasksApi.delete(id)
//       setTasks((prev) => prev.filter((task) => task.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete task:", err)
//       return false
//     }
//   }

//   // Invoice CRUD
//   const addInvoice = async (
//     invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) / 100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           return {
//             customerId: invoiceData.customerId,
//             amount: subtotal,
//             tax: taxNumber,
//             total,
//             status: invoiceData.status,
//             dueDate: invoiceData.dueDate,
//             items:
//               invoiceData.items?.map((it) => ({
//                 description: it.description,
//                 quantity: it.quantity,
//                 rate: it.rate,
//                 amount: it.amount,
//               })) ?? [],
//             notes: invoiceData.notes,
//           }
//         })()

//       const response = await invoicesApi.create(payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber,
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status,
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at ?? new Date()) ?? new Date(),
//           updatedAt:
//             toDate(inv.updated_at ?? new Date()) ?? new Date(),
//         }

//         setInvoices((prev) => [normalized, ...prev])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add invoice:", err)
//       return false
//     }
//   }

//   const updateInvoice = async (
//     id: string,
//     invoiceData: Partial<Invoice>,
//     apiPayload?: any,
//   ): Promise<boolean> => {
//     try {
//       const payload =
//         apiPayload ??
//         (() => {
//           const subtotal =
//             invoiceData.items?.reduce(
//               (sum, it) => sum + (it.amount ?? 0),
//               0,
//             ) ?? invoiceData.amount

//           const taxNumber =
//             typeof invoiceData.tax === "number"
//               ? invoiceData.tax
//               : Number(invoiceData.tax ?? 0) || 0

//           const discountNumber =
//             typeof invoiceData.discount === "number"
//               ? invoiceData.discount
//               : Number(invoiceData.discount ?? 0) || 0

//           const taxAmount =
//             (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) / 100
//           const total =
//             subtotal +
//             taxAmount -
//             (Number.isNaN(discountNumber) ? 0 : discountNumber)

//           const base: any = {}

//           if (invoiceData.customerId) base.customerId = invoiceData.customerId
//           if (subtotal !== undefined) base.amount = subtotal
//           if (taxNumber !== undefined) base.tax = taxNumber
//           base.total = total
//           if (invoiceData.status) base.status = invoiceData.status
//           if (invoiceData.dueDate) base.dueDate = invoiceData.dueDate
//           if (invoiceData.notes !== undefined) base.notes = invoiceData.notes

//           if (invoiceData.items) {
//             base.items = invoiceData.items.map((it) => ({
//               description: it.description,
//               quantity: it.quantity,
//               rate: it.rate,
//               amount: it.amount,
//             }))
//           }

//           return base
//         })()

//       const response = await invoicesApi.update(id, payload)

//       if (response.invoice) {
//         const inv = response.invoice as any

//         const normalized: Invoice = {
//           id: String(inv.id),
//           customerId: String(inv.customer_id ?? inv.customerId),
//           customerName: inv.customer_name ?? invoiceData.customerName ?? "",
//           invoiceNumber:
//             inv.invoice_number ?? invoiceData.invoiceNumber ?? "",
//           issueDate:
//             toDate(inv.created_at ?? invoiceData.issueDate) ??
//             (inv.created_at ?? invoiceData.issueDate),
//           dueDate:
//             toDate(inv.due_date ?? invoiceData.dueDate) ??
//             (inv.due_date ?? invoiceData.dueDate),
//           status: inv.status ?? invoiceData.status ?? "draft",
//           amount:
//             typeof inv.amount === "number"
//               ? inv.amount
//               : invoiceData.amount ?? 0,
//           tax:
//             typeof inv.tax === "number"
//               ? inv.tax
//               : invoiceData.tax ?? 0,
//           discount:
//             typeof inv.discount === "number"
//               ? inv.discount
//               : invoiceData.discount ?? 0,
//           notes: inv.notes ?? invoiceData.notes ?? "",
//           items:
//             Array.isArray(inv.items) && inv.items.length > 0
//               ? inv.items
//               : invoiceData.items ?? [],
//           createdAt:
//             toDate(inv.created_at) ??
//             invoiceData.createdAt ??
//             new Date(),
//           updatedAt:
//             toDate(inv.updated_at) ?? new Date(),
//         }

//         setInvoices((prev) =>
//           prev.map((invoice) => (invoice.id === id ? normalized : invoice)),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update invoice:", err)
//       return false
//     }
//   }

//   const deleteInvoice = async (id: string): Promise<boolean> => {
//     try {
//       await invoicesApi.delete(id)
//       setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete invoice:", err)
//       return false
//     }
//   }

//   // Renewal reminder CRUD
//   const addRenewalReminder = async (
//     reminderData: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.createReminder(reminderData)
//       if (response.reminder) {
//         const rr = response.reminder as RenewalReminder
//         setRenewalReminders((prev) => [
//           ...prev,
//           {
//             ...rr,
//             createdAt: toDate(rr.createdAt) ?? rr.createdAt,
//             updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal reminder:", err)
//       return false
//     }
//   }

//   const updateRenewalReminder = async (
//     _id: string,
//     _reminderData: Partial<RenewalReminder>,
//   ): Promise<boolean> => {
//     console.warn("Update renewal reminder not implemented in backend yet")
//     return false
//   }

//   const deleteRenewalReminder = async (_id: string): Promise<boolean> => {
//     console.warn("Delete renewal reminder not implemented in backend yet")
//     return false
//   }

//   // Renewal CRUD
//   const addRenewal = async (
//     renewalData: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.create(renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) => [
//           ...prev,
//           {
//             ...r,
//             createdAt: toDate(r.createdAt) ?? r.createdAt,
//             updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//           },
//         ])
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to add renewal:", err)
//       return false
//     }
//   }

//   const updateRenewal = async (
//     id: string,
//     renewalData: Partial<Renewal>,
//   ): Promise<boolean> => {
//     try {
//       const response = await renewalsApi.update(id, renewalData)
//       if (response.renewal) {
//         const r = response.renewal as Renewal
//         setRenewals((prev) =>
//           prev.map((renewal) =>
//             renewal.id === id
//               ? {
//                   ...r,
//                   createdAt: toDate(r.createdAt) ?? r.createdAt,
//                   updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
//                 }
//               : renewal,
//           ),
//         )
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Failed to update renewal:", err)
//       return false
//     }
//   }

//   const deleteRenewal = async (id: string): Promise<boolean> => {
//     try {
//       await renewalsApi.delete(id)
//       setRenewals((prev) => prev.filter((renewal) => renewal.id !== id))
//       return true
//     } catch (err) {
//       console.error("Failed to delete renewal:", err)
//       return false
//     }
//   }

//   const value: CRMContextType = {
//     customers,
//     leads,
//     deals,
//     tasks,
//     invoices,
//     renewalReminders,
//     renewals,
//     users,
//     currentUser,
//     setCurrentUser,
//     leadFilters,
//     setLeadFilters,
//     isLoading,
//     error,
//     addCustomer,
//     updateCustomer,
//     deleteCustomer,
//     moveCustomerToLead,
//     addLead,
//     updateLead,
//     deleteLead,
//     convertLead,
//     addDeal,
//     updateDeal,
//     deleteDeal,
//     addTask,
//     updateTask,
//     deleteTask,
//     addInvoice,
//     updateInvoice,
//     deleteInvoice,
//     addRenewalReminder,
//     updateRenewalReminder,
//     deleteRenewalReminder,
//     addRenewal,
//     updateRenewal,
//     deleteRenewal,
//     refreshData,
//     refreshCustomers,
//     refreshLeads,
//     refreshDeals,
//     refreshTasks,
//     refreshInvoices,
//     refreshRenewals,
//     refreshUsers,
//   }

//   return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
// }

// export function useCRM() {
//   const context = useContext(CRMContext)
//   if (context === undefined) {
//     throw new Error("useCRM must be used within a CRMProvider")
//   }
//   return context
// }


//testing (19-12-2025)

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type {
  Customer,
  Lead,
  Deal,
  Task,
  Invoice,
  RenewalReminder,
  Renewal,
} from "@/types/crm"
import {
  customersApi,
  leadsApi,
  dealsApi,
  tasksApi,
  invoicesApi,
  renewalsApi,
} from "@/lib/api"

// Add User type
interface User {
  id: string
  name: string
  email: string
  role: string
}

// Lead filter type (for backend query)
interface LeadFilters {
  status?: string
  priority?: string
  service?: string
  assignedTo?: string
  createdBy?: string // NEW: admin created-by filter
}

// Context type
interface CRMContextType {
  customers: Customer[]
  leads: Lead[]
  deals: Deal[]
  tasks: Task[]
  invoices: Invoice[]
  renewalReminders: RenewalReminder[]
  renewals: Renewal[]
  users: User[]

  // auth / user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // lead filters (for /api/leads)
  leadFilters: LeadFilters
  setLeadFilters: React.Dispatch<React.SetStateAction<LeadFilters>>

  isLoading: boolean
  error: string | null

  addCustomer: (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
  ) => Promise<boolean>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
  deleteCustomer: (id: string) => Promise<boolean>
  moveCustomerToLead: (id: string) => Promise<boolean>

  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>
  deleteLead: (id: string) => Promise<boolean>
  convertLead: (id: string, customerData?: any) => Promise<boolean>

  addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>
  deleteDeal: (id: string) => Promise<boolean>

  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateTask: (id: string, task: Partial<Task>) => Promise<boolean>
  deleteTask: (id: string) => Promise<boolean>

  addInvoice: (
    invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
    apiPayload?: any,
  ) => Promise<boolean>
  updateInvoice: (
    id: string,
    invoice: Partial<Invoice>,
    apiPayload?: any,
  ) => Promise<boolean>
  deleteInvoice: (id: string) => Promise<boolean>

  addRenewalReminder: (
    reminder: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
  ) => Promise<boolean>
  updateRenewalReminder: (
    id: string,
    reminder: Partial<RenewalReminder>,
  ) => Promise<boolean>
  deleteRenewalReminder: (id: string) => Promise<boolean>

  addRenewal: (
    renewal: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
  ) => Promise<boolean>
  updateRenewal: (id: string, renewal: Partial<Renewal>) => Promise<boolean>
  deleteRenewal: (id: string) => Promise<boolean>

  refreshData: () => Promise<void>
  refreshCustomers: () => Promise<void>
  refreshLeads: () => Promise<void>
  refreshDeals: () => Promise<void>
  refreshTasks: () => Promise<void>
  refreshInvoices: () => Promise<void>
  refreshRenewals: () => Promise<void>
  refreshUsers: () => Promise<void>
}

const CRMContext = createContext<CRMContextType | undefined>(undefined)

// Helpers
const toDate = (value: unknown): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  const d = new Date(value as string)
  return Number.isNaN(d.getTime()) ? null : d
}

// Normalize a raw customer from API/DB into app Customer type
// const normalizeCustomer = (raw: any): Customer => ({
//   id: String(raw.id),
//   name: raw.name,
//   email: raw.email,
//   phone: raw.phone,
//   company: raw.company,
//   address: raw.address,
//   city: raw.city,
//   state: raw.state,
//   zipCode: raw.zip_code ?? raw.zipCode,
//   country: raw.country,
//   status: raw.status,
//   source: raw.source,
//   tags: Array.isArray(raw.tags)
//     ? raw.tags
//     : (() => {
//         try {
//           return raw.tags ? JSON.parse(raw.tags) : []
//         } catch {
//           return []
//         }
//       })(),
//   notes: raw.notes,
//   totalValue:
//     typeof raw.totalValue === "number"
//       ? raw.totalValue
//       : typeof raw.total_value === "number"
//       ? raw.total_value
//       : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
//   whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
//   lastContactDate:
//     toDate(raw.lastContactDate ?? raw.last_contact_date) ??
//     (raw.lastContactDate ?? raw.last_contact_date),
//   createdAt:
//     toDate(raw.createdAt ?? raw.created_at) ?? (raw.createdAt ?? raw.created_at),
//   updatedAt:
//     toDate(raw.updatedAt ?? raw.updated_at) ?? (raw.updatedAt ?? raw.updated_at),

//   // invoice defaults
//   defaultTaxRate:
//     typeof raw.default_tax_rate === "number"
//       ? raw.default_tax_rate
//       : typeof raw.defaultTaxRate === "number"
//       ? raw.defaultTaxRate
//       : raw.default_tax_rate != null || raw.defaultTaxRate != null
//       ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
//       : undefined,
//   defaultDueDays:
//     typeof raw.default_due_days === "number"
//       ? raw.default_due_days
//       : typeof raw.defaultDueDays === "number"
//       ? raw.defaultDueDays
//       : raw.default_due_days != null || raw.defaultDueDays != null
//       ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
//       : undefined,
//   defaultInvoiceNotes: raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

//   // recurring / subscription info
//   recurringEnabled: raw.recurring_enabled ?? raw.recurringEnabled ?? false,
//   recurringInterval: raw.recurring_interval ?? raw.recurringInterval ?? null,
//   recurringAmount:
//     typeof raw.recurring_amount === "number"
//       ? raw.recurring_amount
//       : typeof raw.recurringAmount === "number"
//       ? raw.recurringAmount
//       : raw.recurring_amount != null || raw.recurringAmount != null
//       ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
//       : undefined,
//   recurringService: raw.recurring_service ?? raw.recurringService ?? null,

//   // renewal defaults
//   defaultRenewalStatus:
//     raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
//   defaultRenewalReminderDays:
//     typeof raw.default_renewal_reminder_days === "number"
//       ? raw.default_renewal_reminder_days
//       : typeof raw.defaultRenewalReminderDays === "number"
//       ? raw.defaultRenewalReminderDays
//       : raw.default_renewal_reminder_days != null ||
//         raw.defaultRenewalReminderDays != null
//       ? Number(
//           raw.default_renewal_reminder_days ??
//             raw.defaultRenewalReminderDays ??
//             0,
//         )
//       : undefined,
//   defaultRenewalNotes: raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
//   nextRenewalDate:
//     toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
//     (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
// })


//testing 


const normalizeCustomer = (raw: any): Customer => ({
  id: String(raw.id),
  name: raw.name,
  email: raw.email,
  phone: raw.phone,
  company: raw.company,
  address: raw.address,
  city: raw.city,
  state: raw.state,
  zipCode: raw.zip_code ?? raw.zipCode,
  country: raw.country,
  status: raw.status,
  source: raw.source,

  // service from DB (adjust column if needed)
  service: raw.service ?? raw.service_type ?? null,

  tags: Array.isArray(raw.tags)
    ? raw.tags
    : (() => {
        try {
          return raw.tags ? JSON.parse(raw.tags) : []
        } catch {
          return []
        }
      })(),
  notes: raw.notes,
  totalValue:
    typeof raw.totalValue === "number"
      ? raw.totalValue
      : typeof raw.total_value === "number"
      ? raw.total_value
      : Number(raw.totalValue ?? raw.total_value ?? 0) || 0,
  whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber,
  lastContactDate:
    toDate(raw.lastContactDate ?? raw.last_contact_date) ??
    (raw.lastContactDate ?? raw.last_contact_date),
  createdAt:
    toDate(raw.createdAt ?? raw.created_at) ?? (raw.createdAt ?? raw.created_at),
  updatedAt:
    toDate(raw.updatedAt ?? raw.updated_at) ?? (raw.updatedAt ?? raw.updated_at),

  // invoice defaults
  defaultTaxRate:
    typeof raw.default_tax_rate === "number"
      ? raw.default_tax_rate
      : typeof raw.defaultTaxRate === "number"
      ? raw.defaultTaxRate
      : raw.default_tax_rate != null || raw.defaultTaxRate != null
      ? Number(raw.default_tax_rate ?? raw.defaultTaxRate ?? 0)
      : undefined,
  defaultDueDays:
    typeof raw.default_due_days === "number"
      ? raw.default_due_days
      : typeof raw.defaultDueDays === "number"
      ? raw.defaultDueDays
      : raw.default_due_days != null || raw.defaultDueDays != null
      ? Number(raw.default_due_days ?? raw.defaultDueDays ?? 0)
      : undefined,
  defaultInvoiceNotes: raw.default_invoice_notes ?? raw.defaultInvoiceNotes ?? null,

  // recurring / subscription info
  recurringEnabled: raw.recurring_enabled ?? raw.recurringEnabled ?? false,
  recurringInterval: raw.recurring_interval ?? raw.recurringInterval ?? null,
  recurringAmount:
    typeof raw.recurring_amount === "number"
      ? raw.recurring_amount
      : typeof raw.recurringAmount === "number"
      ? raw.recurringAmount
      : raw.recurring_amount != null || raw.recurringAmount != null
      ? Number(raw.recurring_amount ?? raw.recurringAmount ?? 0)
      : undefined,
  recurringService: raw.recurring_service ?? raw.recurringService ?? null,

  // renewal defaults
  defaultRenewalStatus:
    raw.default_renewal_status ?? raw.defaultRenewalStatus ?? null,
  defaultRenewalReminderDays:
    typeof raw.default_renewal_reminder_days === "number"
      ? raw.default_renewal_reminder_days
      : typeof raw.defaultRenewalReminderDays === "number"
      ? raw.defaultRenewalReminderDays
      : raw.default_renewal_reminder_days != null ||
        raw.defaultRenewalReminderDays != null
      ? Number(
          raw.default_renewal_reminder_days ??
            raw.defaultRenewalReminderDays ??
            0,
        )
      : undefined,
  defaultRenewalNotes: raw.default_renewal_notes ?? raw.defaultRenewalNotes ?? null,
  nextRenewalDate:
    toDate(raw.next_renewal_date ?? raw.nextRenewalDate) ??
    (raw.next_renewal_date ?? raw.nextRenewalDate ?? null),
})

// const normalizeLead = (raw: any): Lead =>
//   ({
//     id: String(raw.id),
//     name: raw.name ?? "",
//     email: raw.email ?? "",
//     phone: raw.phone ?? "",
//     company: raw.company ?? "",
//     source: raw.source ?? "website",
//     status: raw.status ?? "new",
//     priority: raw.priority ?? "medium",
//     assignedTo: raw.assigned_to ?? raw.assignedTo ?? "",
//     estimatedValue:
//       typeof raw.estimated_value === "number"
//         ? raw.estimated_value
//         : typeof raw.estimatedValue === "number"
//         ? raw.estimatedValue
//         : Number(raw.estimated_value ?? raw.estimatedValue ?? 0) || 0,
//     notes: raw.notes ?? "",
//     expectedCloseDate:
//       toDate(raw.expected_close_date ?? raw.expectedCloseDate) ??
//       (raw.expected_close_date ?? raw.expectedCloseDate ?? null),
//     whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber ?? "",
//     service: raw.service ?? undefined,

//     // creator id from backend
//     createdBy: raw.created_by ?? raw.createdBy ?? null,

//     createdAt:
//       toDate(raw.created_at ?? raw.createdAt) ??
//       (raw.created_at ?? raw.createdAt),
//     updatedAt:
//       toDate(raw.updated_at ?? raw.updatedAt) ??
//       (raw.updated_at ?? raw.updatedAt),
//     lastContactDate:
//       toDate(raw.last_contact_date ?? raw.lastContactDate) ??
//       (raw.last_contact_date ?? raw.lastContactDate ?? null),

//     isConverted: Boolean(raw.is_converted ?? raw.isConverted ?? false),
//     convertedCustomerId:
//       raw.converted_customer_id ?? raw.convertedCustomerId ?? null,
//   } as Lead)

//testing 22-12-2025

const normalizeLead = (raw: any): Lead =>
  ({
    id: String(raw.id),
    name: raw.name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    company: raw.company ?? "",
    source: raw.source ?? "website",
    status: raw.status ?? "new",
    priority: raw.priority ?? "medium",
    assignedTo: raw.assigned_to ?? raw.assignedTo ?? "",
    estimatedValue:
      typeof raw.estimated_value === "number"
        ? raw.estimated_value
        : typeof raw.estimatedValue === "number"
        ? raw.estimatedValue
        : Number(raw.estimated_value ?? raw.estimatedValue ?? 0) || 0,
    notes: raw.notes ?? "",
    expectedCloseDate:
      toDate(raw.expected_close_date ?? raw.expectedCloseDate) ??
      (raw.expected_close_date ?? raw.expectedCloseDate ?? null),
    whatsappNumber: raw.whatsapp_number ?? raw.whatsappNumber ?? "",
    service: raw.service ?? undefined,

    // creator id from backend
    createdBy: raw.created_by ?? raw.createdBy ?? null,

    // NEW: creator name from backend join
    created_user_name: raw.created_user_name ?? raw.createdUserName ?? null,

    createdAt:
      toDate(raw.created_at ?? raw.createdAt) ??
      (raw.created_at ?? raw.createdAt),
    updatedAt:
      toDate(raw.updated_at ?? raw.updatedAt) ??
      (raw.updated_at ?? raw.updatedAt),
    lastContactDate:
      toDate(raw.last_contact_date ?? raw.lastContactDate) ??
      (raw.last_contact_date ?? raw.lastContactDate ?? null),

    isConverted: Boolean(raw.is_converted ?? raw.isConverted ?? false),
    convertedCustomerId:
      raw.converted_customer_id ?? raw.convertedCustomerId ?? null,
  } as Lead);


export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [renewalReminders, setRenewalReminders] = useState<RenewalReminder[]>([])
  const [renewals, setRenewals] = useState<Renewal[]>([])
  const [users, setUsers] = useState<User[]>([])

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [leadFilters, setLeadFilters] = useState<LeadFilters>({})

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void refreshData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await Promise.all([
        refreshCustomers(),
        refreshLeads(),
        refreshDeals(),
        refreshTasks(),
        refreshInvoices(),
        refreshRenewals(),
        refreshUsers(),
      ])
    } catch (err) {
      console.error("Failed to load CRM data:", err)
      setError(err instanceof Error ? err.message : "Failed to load CRM data")
    } finally {
      setIsLoading(false)
    }
  }

//   const refreshUsers = async () => {
//     try {
//       const token =
//         typeof window !== "undefined" ? localStorage.getItem("token") : null

//      if (!token) {
//   // No token yet (e.g. before login) – just use a default admin user silently
//   setUsers([
//     {
//       id: "admin",
//       name: "Admin User",
//       email: "admin@example.com",
//       role: "admin",
//     },
//   ])
//   return
// }

//       const baseUrl =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

//       const response = await fetch(`${baseUrl}/api/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUsers(Array.isArray(data.users) ? data.users : [])
//       } else {
//         console.warn("Users request failed, status:", response.status)
//         setUsers([
//           {
//             id: "user1",
//             name: "Default User",
//             email: "user@example.com",
//             role: "admin",
//           },
//         ])
//       }
//     } catch (err) {
//       console.error("Failed to fetch users", err)
//       setUsers([
//         {
//           id: "user1",
//           name: "Default User",
//           email: "user@example.com",
//           role: "admin",
//         },
//       ])
//     }
//   }



const refreshUsers = async () => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (!token) {
      // Before login, you can keep this empty or a minimal fallback
      setUsers([])
      return
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const response = await fetch(`${baseUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      setUsers(Array.isArray(data.users) ? data.users : [])
    } else {
      console.warn("Users request failed, status:", response.status)
      setUsers([])
    }
  } catch (err) {
    console.error("Failed to fetch users", err)
    setUsers([])
  }
}

  const refreshCustomers = async () => {
    try {
      const response = await customersApi.getAll({ limit: 100 })
      const list = (response.customers || []) as any[]
      setCustomers(list.map((c) => normalizeCustomer(c)))
    } catch (err) {
      console.error("Failed to fetch customers:", err)
      throw err
    }
  }

  // Leads with filters, including admin createdBy
  const refreshLeads = async () => {
    try {
      const params: any = {
        limit: 100,
      }

      params.status =
        leadFilters.status && leadFilters.status !== "all"
          ? leadFilters.status
          : undefined

      params.priority =
        leadFilters.priority && leadFilters.priority !== "all"
          ? leadFilters.priority
          : undefined

      params.service =
        leadFilters.service && leadFilters.service !== "all"
          ? leadFilters.service
          : undefined

      params.assignedTo =
        leadFilters.assignedTo && leadFilters.assignedTo !== "all"
          ? leadFilters.assignedTo
          : undefined

      params.createdBy =
        leadFilters.createdBy && leadFilters.createdBy !== "all"
          ? leadFilters.createdBy
          : undefined

      const response = await leadsApi.getAll(params)
      const list = (response.leads || []) as any[]
      setLeads(list.map((l) => normalizeLead(l)))
    } catch (err) {
      console.error("Failed to fetch leads:", err)
      throw err
    }
  }

  const refreshDeals = async () => {
    try {
      const response = await dealsApi.getAll({ limit: 100 })
      const list = (response.deals || []) as Deal[]
      setDeals(
        list.map((d) => ({
          ...d,
          createdAt: toDate(d.createdAt) ?? d.createdAt,
          updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
          expectedCloseDate:
            toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
          value:
            typeof d.value === "number" ? d.value : Number(d.value ?? 0) || 0,
        })),
      )
    } catch (err) {
      console.error("Failed to fetch deals:", err)
      throw err
    }
  }

  const refreshTasks = async () => {
    try {
      const response = await tasksApi.getAll({ limit: 100 })
      const list = (response.tasks || []) as Task[]
      setTasks(
        list.map((t) => ({
          ...t,
          createdAt: toDate(t.createdAt) ?? t.createdAt,
          updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
          dueDate: toDate(t.dueDate) ?? t.dueDate,
          completedAt: toDate(t.completedAt) ?? t.completedAt,
        })),
      )
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
      throw err
    }
  }

  const refreshInvoices = async () => {
    try {
      const response = await invoicesApi.getAll({ limit: 100 })
      const list = (response.invoices || []) as any[]
      setInvoices(
        list.map((inv) => ({
          id: String(inv.id),
          customerId: String(inv.customer_id ?? inv.customerId),
          customerName: inv.customer_name ?? inv.customerName ?? "",
          invoiceNumber: inv.invoice_number ?? inv.invoiceNumber ?? "",
          issueDate:
            toDate(inv.created_at ?? inv.issueDate) ??
            (inv.created_at ?? inv.issueDate),
          dueDate:
            toDate(inv.due_date ?? inv.dueDate) ??
            (inv.due_date ?? inv.dueDate),
          status: inv.status,
          amount:
            typeof inv.amount === "number"
              ? inv.amount
              : Number(inv.amount ?? 0) || 0,
          tax:
            typeof inv.tax === "number"
              ? inv.tax
              : Number(inv.tax ?? 0) || 0,
          discount:
            typeof inv.discount === "number"
              ? inv.discount
              : Number(inv.discount ?? 0) || 0,
          total:
            typeof inv.total === "number"
              ? inv.total
              : Number(inv.total ?? 0) || 0,
          notes: inv.notes ?? "",
          items: Array.isArray(inv.items) ? inv.items : [],
          createdAt:
            toDate(inv.created_at ?? inv.createdAt) ??
            (inv.created_at ?? inv.createdAt),
          updatedAt:
            toDate(inv.updated_at ?? inv.updatedAt) ??
            (inv.updated_at ?? inv.updatedAt),
        })),
      )
    } catch (err) {
      console.error("Failed to fetch invoices:", err)
      throw err
    }
  }

  const refreshRenewals = async () => {
    try {
      const [renewalsResponse, remindersResponse] = await Promise.all([
        renewalsApi.getAll({ limit: 100 }),
        renewalsApi.getReminders(),
      ])

      const renewalsList = (renewalsResponse.renewals || []) as Renewal[]
      const remindersList =
        (remindersResponse.reminders || []) as RenewalReminder[]

      setRenewals(
        renewalsList.map((r) => ({
          ...r,
          createdAt: toDate(r.createdAt) ?? r.createdAt,
          updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
          startDate: toDate(r.startDate) ?? r.startDate,
          endDate: toDate(r.endDate) ?? r.endDate,
          amount:
            typeof r.amount === "number"
              ? r.amount
              : Number(r.amount ?? 0) || 0,
        })),
      )

      setRenewalReminders(
        remindersList.map((rr) => ({
          ...rr,
          createdAt: toDate(rr.createdAt) ?? rr.createdAt,
          updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
          expiryDate: toDate(rr.expiryDate) ?? rr.expiryDate,
          lastReminderSent:
            toDate(rr.lastReminderSent) ?? rr.lastReminderSent,
          reminderDays: Array.isArray(rr.reminderDays)
            ? rr.reminderDays
            : (() => {
                try {
                  return JSON.parse(
                    (rr.reminderDays as unknown as string) || "[]",
                  ) as number[]
                } catch {
                  return []
                }
              })(),
        })),
      )
    } catch (err) {
      console.error("Failed to fetch renewals:", err)
      throw err
    }
  }

  // Customer CRUD
  const addCustomer = async (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const payload = {
        ...customerData,
        totalValue:
          customerData.totalValue !== undefined &&
          customerData.totalValue !== null &&
          customerData.totalValue !== ""
            ? Number(customerData.totalValue)
            : 0,
      }

      const response = await customersApi.create(payload)
      if (response.customer) {
        const c = normalizeCustomer(response.customer)
        setCustomers((prev) => [c, ...prev])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add customer:", err)
      throw err
    }
  }

  const updateCustomer = async (
    id: string,
    customerData: Partial<Customer>,
  ): Promise<boolean> => {
    try {
      const payload: any = { ...customerData }
      if ("totalValue" in payload) {
        const v = payload.totalValue
        payload.totalValue =
          v !== undefined && v !== null && v !== "" ? Number(v) : 0
      }

      const response = await customersApi.update(id, payload)
      if (response.customer) {
        const c = normalizeCustomer(response.customer)
        setCustomers((prev) =>
          prev.map((customer) => (customer.id === id ? c : customer)),
        )
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to update customer:", err)
      throw err
    }
  }

  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      await customersApi.delete(id)
      setCustomers((prev) => prev.filter((customer) => customer.id !== id))
      return true
    } catch (err) {
      console.error("Failed to delete customer:", err)
      return false
    }
  }

  // Move customer back to lead WITHOUT deleting
  const moveCustomerToLead = async (id: string): Promise<boolean> => {
    try {
      await customersApi.moveToLead(id)

      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "inactive" } : c)),
      )

      await refreshLeads()

      return true
    } catch (err) {
      console.error("Failed to move customer to lead:", err)
      return false
    }
  }

  // Lead CRUD
  const addLead = async (
    leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const response = await leadsApi.create(leadData)
      if (response.lead) {
        const l = normalizeLead(response.lead)
        setLeads((prev) => [...prev, l])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add lead:", err)
      return false
    }
  }

  const updateLead = async (
    id: string,
    leadData: Partial<Lead>,
  ): Promise<boolean> => {
    try {
      const payload: any = { ...leadData }

      if (payload.expectedCloseDate instanceof Date) {
        const d = payload.expectedCloseDate
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        payload.expectedCloseDate = `${year}-${month}-${day}`
      } else if (typeof payload.expectedCloseDate === "string") {
        if (payload.expectedCloseDate.includes("T")) {
          payload.expectedCloseDate = payload.expectedCloseDate.split("T")[0]
        }
      }

      const response = await leadsApi.update(id, payload)

      if (response.lead) {
        const l = normalizeLead(response.lead)
        setLeads((prev) => prev.map((lead) => (lead.id === id ? l : lead)))
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to update lead:", err)
      return false
    }
  }

  const deleteLead = async (id: string): Promise<boolean> => {
    try {
      await leadsApi.delete(id)
      setLeads((prev) => prev.filter((lead) => lead.id !== id))
      return true
    } catch (err) {
      console.error("Failed to delete lead:", err)
      return false
    }
  }

  const convertLead = async (
    id: string,
    customerData?: any,
  ): Promise<boolean> => {
    try {
      const dataWithFlag = {
        ...customerData,
        fromLead: true,
      }

      const response = await leadsApi.convertToCustomer(id, dataWithFlag)

      if (response.customer) {
        const c = normalizeCustomer(response.customer)
        const customerWithFlag = { ...c, fromLead: true } as any

        setCustomers((prev) => [...prev, customerWithFlag])
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id
              ? {
                  ...lead,
                  status: "closed-won",
                  isConverted: true,
                  convertedCustomerId: customerWithFlag.id,
                }
              : lead,
          ),
        )

        return true
      }

      if ((response as any).error) {
        throw new Error((response as any).error)
      }

      return false
    } catch (err: any) {
      console.error("Failed to convert lead:", err)
      alert(err?.message || "Failed to convert lead to customer")
      return false
    }
  }

  // Deal CRUD
  const addDeal = async (
    dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const formattedDealData = {
        ...dealData,
        expectedCloseDate: dealData.expectedCloseDate
          ? dealData.expectedCloseDate instanceof Date
            ? dealData.expectedCloseDate.toISOString()
            : dealData.expectedCloseDate
          : null,
        ...(dealData.actualCloseDate && {
          actualCloseDate:
            dealData.actualCloseDate instanceof Date
              ? dealData.actualCloseDate.toISOString()
              : dealData.actualCloseDate,
        }),
        products: Array.isArray(dealData.products) ? dealData.products : [],
      }

      const response = await dealsApi.create(formattedDealData)

      if (response.deal) {
        const d = response.deal as Deal
        setDeals((prev) => [
          ...prev,
          {
            ...d,
            createdAt: toDate(d.createdAt) ?? d.createdAt,
            updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
            expectedCloseDate:
              toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
          },
        ])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add deal:", err)
      return false
    }
  }

  const updateDeal = async (
    id: string,
    dealData: Partial<Deal>,
  ): Promise<boolean> => {
    try {
      const formattedDealData: any = { ...dealData }

      if (dealData.expectedCloseDate) {
        formattedDealData.expectedCloseDate =
          dealData.expectedCloseDate instanceof Date
            ? dealData.expectedCloseDate.toISOString()
            : dealData.expectedCloseDate
      }

      if (dealData.actualCloseDate) {
        formattedDealData.actualCloseDate =
          dealData.actualCloseDate instanceof Date
            ? dealData.actualCloseDate.toISOString()
            : dealData.actualCloseDate
      }

      const response = await dealsApi.update(id, formattedDealData)

      if (response.deal) {
        const d = response.deal as Deal
        setDeals((prev) =>
          prev.map((deal) =>
            deal.id === id
              ? {
                  ...d,
                  createdAt: toDate(d.createdAt) ?? d.createdAt,
                  updatedAt: toDate(d.updatedAt) ?? d.updatedAt,
                  expectedCloseDate:
                    toDate(d.expectedCloseDate) ?? d.expectedCloseDate,
                }
              : deal,
          ),
        )
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to update deal:", err)
      return false
    }
  }

  const deleteDeal = async (id: string): Promise<boolean> => {
    try {
      await dealsApi.delete(id)
      setDeals((prev) => prev.filter((deal) => deal.id !== id))
      return true
    } catch (err) {
      console.error("Failed to delete deal:", err)
      return false
    }
  }

  // Task CRUD
  const addTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const response = await tasksApi.create(taskData)
      if (response.task) {
        const t = response.task as Task
        setTasks((prev) => [
          ...prev,
          {
            ...t,
            createdAt: toDate(t.createdAt) ?? t.createdAt,
            updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
          },
        ])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add task:", err)
      return false
    }
  }

  const updateTask = async (
    id: string,
    taskData: Partial<Task>,
  ): Promise<boolean> => {
    try {
      const response = await tasksApi.update(id, taskData)
      if (response.task) {
        const t = response.task as Task
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? {
                  ...t,
                  createdAt: toDate(t.createdAt) ?? t.createdAt,
                  updatedAt: toDate(t.updatedAt) ?? t.updatedAt,
                }
              : task,
          ),
        )
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to update task:", err)
      return false
    }
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await tasksApi.delete(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      return true
    } catch (err) {
      console.error("Failed to delete task:", err)
      return false
    }
  }

  // Invoice CRUD
  const addInvoice = async (
    invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
    apiPayload?: any,
  ): Promise<boolean> => {
    try {
      const payload =
        apiPayload ??
        (() => {
          const subtotal =
            invoiceData.items?.reduce(
              (sum, it) => sum + (it.amount ?? 0),
              0,
            ) ?? invoiceData.amount

          const taxNumber =
            typeof invoiceData.tax === "number"
              ? invoiceData.tax
              : Number(invoiceData.tax ?? 0) || 0

          const discountNumber =
            typeof invoiceData.discount === "number"
              ? invoiceData.discount
              : Number(invoiceData.discount ?? 0) || 0

          const taxAmount =
            (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) / 100
          const total =
            subtotal +
            taxAmount -
            (Number.isNaN(discountNumber) ? 0 : discountNumber)

          return {
            customerId: invoiceData.customerId,
            amount: subtotal,
            tax: taxNumber,
            total,
            status: invoiceData.status,
            dueDate: invoiceData.dueDate,
            items:
              invoiceData.items?.map((it) => ({
                description: it.description,
                quantity: it.quantity,
                rate: it.rate,
                amount: it.amount,
              })) ?? [],
            notes: invoiceData.notes,
          }
        })()

      const response = await invoicesApi.create(payload)

      if (response.invoice) {
        const inv = response.invoice as any

        const normalized: Invoice = {
          id: String(inv.id),
          customerId: String(inv.customer_id ?? inv.customerId),
          customerName: inv.customer_name ?? invoiceData.customerName ?? "",
          invoiceNumber:
            inv.invoice_number ?? invoiceData.invoiceNumber,
          issueDate:
            toDate(inv.created_at ?? invoiceData.issueDate) ??
            (inv.created_at ?? invoiceData.issueDate),
          dueDate:
            toDate(inv.due_date ?? invoiceData.dueDate) ??
            (inv.due_date ?? invoiceData.dueDate),
          status: inv.status ?? invoiceData.status,
          amount:
            typeof inv.amount === "number"
              ? inv.amount
              : invoiceData.amount,
          tax:
            typeof inv.tax === "number"
              ? inv.tax
              : invoiceData.tax,
          discount:
            typeof inv.discount === "number"
              ? inv.discount
              : invoiceData.discount ?? 0,
          notes: inv.notes ?? invoiceData.notes ?? "",
          items:
            Array.isArray(inv.items) && inv.items.length > 0
              ? inv.items
              : invoiceData.items ?? [],
          createdAt:
            toDate(inv.created_at ?? new Date()) ?? new Date(),
          updatedAt:
            toDate(inv.updated_at ?? new Date()) ?? new Date(),
        }

        setInvoices((prev) => [normalized, ...prev])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add invoice:", err)
      return false
    }
  }

  const updateInvoice = async (
    id: string,
    invoiceData: Partial<Invoice>,
    apiPayload?: any,
  ): Promise<boolean> => {
    try {
      const payload =
        apiPayload ??
        (() => {
          const subtotal =
            invoiceData.items?.reduce(
              (sum, it) => sum + (it.amount ?? 0),
              0,
            ) ?? invoiceData.amount

          const taxNumber =
            typeof invoiceData.tax === "number"
              ? invoiceData.tax
              : Number(invoiceData.tax ?? 0) || 0

          const discountNumber =
            typeof invoiceData.discount === "number"
              ? invoiceData.discount
              : Number(invoiceData.discount ?? 0) || 0

          const taxAmount =
            (subtotal * (Number.isNaN(taxNumber) ? 0 : taxNumber)) / 100
          const total =
            subtotal +
            taxAmount -
            (Number.isNaN(discountNumber) ? 0 : discountNumber)

          const base: any = {}
          if (invoiceData.customerId) base.customerId = invoiceData.customerId
          if (subtotal !== undefined) base.amount = subtotal
          if (taxNumber !== undefined) base.tax = taxNumber
          base.total = total
          if (invoiceData.status) base.status = invoiceData.status
          if (invoiceData.dueDate) base.dueDate = invoiceData.dueDate
          if (invoiceData.notes !== undefined) base.notes = invoiceData.notes

          if (invoiceData.items) {
            base.items = invoiceData.items.map((it) => ({
              description: it.description,
              quantity: it.quantity,
              rate: it.rate,
              amount: it.amount,
            }))
          }

          return base
        })()

      const response = await invoicesApi.update(id, payload)

      if (response.invoice) {
        const inv = response.invoice as any

        const normalized: Invoice = {
          id: String(inv.id),
          customerId: String(inv.customer_id ?? inv.customerId),
          customerName: inv.customer_name ?? invoiceData.customerName ?? "",
          invoiceNumber:
            inv.invoice_number ?? invoiceData.invoiceNumber ?? "",
          issueDate:
            toDate(inv.created_at ?? invoiceData.issueDate) ??
            (inv.created_at ?? invoiceData.issueDate),
          dueDate:
            toDate(inv.due_date ?? invoiceData.dueDate) ??
            (inv.due_date ?? invoiceData.dueDate),
          status: inv.status ?? invoiceData.status ?? "draft",
          amount:
            typeof inv.amount === "number"
              ? inv.amount
              : invoiceData.amount ?? 0,
          tax:
            typeof inv.tax === "number"
              ? inv.tax
              : invoiceData.tax ?? 0,
          discount:
            typeof inv.discount === "number"
              ? inv.discount
              : invoiceData.discount ?? 0,
          notes: inv.notes ?? invoiceData.notes ?? "",
          items:
            Array.isArray(inv.items) && inv.items.length > 0
              ? inv.items
              : invoiceData.items ?? [],
          createdAt:
            toDate(inv.created_at) ??
            invoiceData.createdAt ??
            new Date(),
          updatedAt:
            toDate(inv.updated_at) ?? new Date(),
        }

        setInvoices((prev) =>
          prev.map((invoice) => (invoice.id === id ? normalized : invoice)),
        )
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to update invoice:", err)
      return false
    }
  }

  const deleteInvoice = async (id: string): Promise<boolean> => {
    try {
      await invoicesApi.delete(id)
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
      return true
    } catch (err) {
      console.error("Failed to delete invoice:", err)
      return false
    }
  }

  // Renewal reminder CRUD
  const addRenewalReminder = async (
    reminderData: Omit<RenewalReminder, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const response = await renewalsApi.createReminder(reminderData)
      if (response.reminder) {
        const rr = response.reminder as RenewalReminder
        setRenewalReminders((prev) => [
          ...prev,
          {
            ...rr,
            createdAt: toDate(rr.createdAt) ?? rr.createdAt,
            updatedAt: toDate(rr.updatedAt) ?? rr.updatedAt,
          },
        ])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add renewal reminder:", err)
      return false
    }
  }

  const updateRenewalReminder = async (
    _id: string,
    _reminderData: Partial<RenewalReminder>,
  ): Promise<boolean> => {
    console.warn("Update renewal reminder not implemented in backend yet")
    return false
  }

  const deleteRenewalReminder = async (_id: string): Promise<boolean> => {
    console.warn("Delete renewal reminder not implemented in backend yet")
    return false
  }

  // Renewal CRUD
  const addRenewal = async (
    renewalData: Omit<Renewal, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const response = await renewalsApi.create(renewalData)
      if (response.renewal) {
        const r = response.renewal as Renewal
        setRenewals((prev) => [
          ...prev,
          {
            ...r,
            createdAt: toDate(r.createdAt) ?? r.createdAt,
            updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
          },
        ])
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to add renewal:", err)
      return false
    }
  }

  const updateRenewal = async (
    id: string,
    renewalData: Partial<Renewal>,
  ): Promise<boolean> => {
    try {
      const response = await renewalsApi.update(id, renewalData)
      if (response.renewal) {
        const r = response.renewal as Renewal
        setRenewals((prev) =>
          prev.map((renewal) =>
            renewal.id === id
              ? {
                  ...r,
                  createdAt: toDate(r.createdAt) ?? r.createdAt,
                  updatedAt: toDate(r.updatedAt) ?? r.updatedAt,
                }
              : renewal,
          ),
        )
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to update renewal:", err)
      return false
    }
  }

  const deleteRenewal = async (id: string): Promise<boolean> => {
    try {
      await renewalsApi.delete(id)
      setRenewals((prev) => prev.filter((renewal) => renewal.id !== id))
      return true
    } catch (err) {
      console.error("Failed to delete renewal:", err)
      return false
    }
  }

  const value: CRMContextType = {
    customers,
    leads,
    deals,
    tasks,
    invoices,
    renewalReminders,
    renewals,
    users,
    currentUser,
    setCurrentUser,
    leadFilters,
    setLeadFilters,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    moveCustomerToLead,
    addLead,
    updateLead,
    deleteLead,
    convertLead,
    addDeal,
    updateDeal,
    deleteDeal,
    addTask,
    updateTask,
    deleteTask,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addRenewalReminder,
    updateRenewalReminder,
    deleteRenewalReminder,
    addRenewal,
    updateRenewal,
    deleteRenewal,
    refreshData,
    refreshCustomers,
    refreshLeads,
    refreshDeals,
    refreshTasks,
    refreshInvoices,
    refreshRenewals,
    refreshUsers,
  }

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
}

export function useCRM() {
  const context = useContext(CRMContext)
  if (context === undefined) {
    throw new Error("useCRM must be used within a CRMProvider")
  }
  return context
}
