// "use client"

// import { useMemo } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Users,
//   UserPlus,
//   TrendingUp,
//   IndianRupee,
//   CheckSquare,
//   AlertTriangle,
//   ReceiptIndianRupee,
// } from "lucide-react"

// const formatDate = (value: unknown) => {
//   if (!value) return "—"
//   const date = value instanceof Date ? value : new Date(value as string)
//   if (Number.isNaN(date.getTime())) return "—"
//   return date.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     timeZone: "UTC",
//   })
// }

// export function DashboardContent() {
//   // add invoices into context usage so dashboard reflects billing too
//   const { customers, leads, deals, tasks, renewalReminders, invoices } = useCRM()

//   const stats = useMemo(() => {
//     const totalCustomers = customers.length

//     const activeLeads = leads.filter(
//       (lead) => !["closed-won", "closed-lost"].includes(lead.status),
//     ).length

//     const openDeals = deals.filter(
//       (deal) => !["closed-won", "closed-lost"].includes(deal.stage),
//     ).length

//     const closedWonRevenue = deals
//       .filter((deal) => deal.stage === "closed-won")
//       .reduce((sum, deal) => sum + (deal.value ?? 0), 0)

//     const pendingTasks = tasks.filter((task) => task.status === "pending").length

//     const renewalsDue = renewalReminders.filter((reminder) => {
//       const expiry =
//         reminder.expiryDate instanceof Date
//           ? reminder.expiryDate
//           : new Date(reminder.expiryDate as string)
//       if (Number.isNaN(expiry.getTime())) return false
//       const daysUntilExpiry = Math.ceil(
//         (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
//       )
//       return daysUntilExpiry <= 30 && daysUntilExpiry > 0
//     }).length

//     // invoice-related KPIs from new invoices module
//     const totalInvoices = invoices?.length ?? 0
//     const invoiceRevenue = (invoices ?? []).reduce((sum, inv) => {
//       const total =
//         typeof inv.total === "number" ? inv.total : Number(inv.total ?? 0) || 0
//       return sum + total
//     }, 0)

//     return [
//       {
//         title: "Total Customers",
//         value: totalCustomers,
//         description: "Active customers",
//         icon: Users,
//         color: "text-blue-600",
//         bg: "bg-blue-50 dark:bg-blue-950/30",
//       },
//       {
//         title: "Active Leads",
//         value: activeLeads,
//         description: "Potential customers",
//         icon: UserPlus,
//         color: "text-green-600",
//         bg: "bg-emerald-50 dark:bg-emerald-950/30",
//       },
//       {
//         title: "Open Deals",
//         value: openDeals,
//         description: "In progress",
//         icon: TrendingUp,
//         color: "text-purple-600",
//         bg: "bg-purple-50 dark:bg-purple-950/30",
//       },
//       {
//         title: "Revenue (Deals)",
//         value: `₹${closedWonRevenue.toLocaleString("en-IN")}`,
//         description: "Closed‑won deals",
//         icon: IndianRupee,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50 dark:bg-emerald-950/30",
//       },
//       {
//         title: "Total Invoices",
//         value: totalInvoices,
//         description: "All generated invoices",
//         icon: ReceiptIndianRupee,
//         color: "text-sky-600",
//         bg: "bg-sky-50 dark:bg-sky-950/30",
//       },
//       {
//         title: "Invoice Revenue",
//         value: `₹${invoiceRevenue.toLocaleString("en-IN")}`,
//         description: "Total invoice amount (with GST)",
//         icon: IndianRupee,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50 dark:bg-indigo-950/30",
//       },
//       {
//         title: "Pending Tasks",
//         value: pendingTasks,
//         description: "Due tasks",
//         icon: CheckSquare,
//         color: "text-orange-600",
//         bg: "bg-amber-50 dark:bg-amber-950/30",
//       },
//       {
//         title: "Renewals Due",
//         value: renewalsDue,
//         description: "Next 30 days",
//         icon: AlertTriangle,
//         color: "text-red-600",
//         bg: "bg-rose-50 dark:bg-rose-950/30",
//       },
//     ]
//   }, [customers, leads, deals, tasks, renewalReminders, invoices])

//   const pendingTasksOnly = tasks.filter((task) => task.status === "pending")

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-1">
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-sm text-muted-foreground">
//           Overview of your customers, pipeline, billing and upcoming work.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <Card
//             key={index}
//             className={`border-none shadow-sm hover:shadow-md transition-shadow ${stat.bg}`}
//           >
//             <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
//               <div className="space-y-1">
//                 <CardTitle className="text-xs font-medium text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <div className="text-2xl font-semibold tracking-tight">
//                   {stat.value}
//                 </div>
//               </div>
//               <div
//                 className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-background/60 shadow-sm ${stat.color}`}
//               >
//                 <stat.icon className="h-4 w-4" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xs text-muted-foreground">
//                 {stat.description}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent customers */}
//         <Card className="border-dashed">
//           <CardHeader>
//             <CardTitle className="text-base">Recent Customers</CardTitle>
//             <CardDescription>Latest customer additions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {customers.slice(0, 5).map((customer) => (
//                 <div
//                   key={customer.id}
//                   className="flex items-center space-x-4 rounded-md border bg-card/50 px-3 py-2"
//                 >
//                   <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
//                     <span className="text-sm font-medium text-primary">
//                       {customer.name?.charAt(0)?.toUpperCase() ?? "C"}
//                     </span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">
//                       {customer.name || "Unnamed customer"}
//                     </p>
//                     <p className="text-xs text-muted-foreground truncate">
//                       {customer.company || "—"}
//                     </p>
//                   </div>
//                   <div className="text-xs text-muted-foreground text-right">
//                     {typeof customer.totalValue === "number"
//                       ? `₹${customer.totalValue.toLocaleString("en-IN")}`
//                       : "—"}
//                   </div>
//                 </div>
//               ))}
//               {customers.length === 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   No customers yet.
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Upcoming tasks */}
//         <Card className="border-dashed">
//           <CardHeader>
//             <CardTitle className="text-base">Upcoming Tasks</CardTitle>
//             <CardDescription>Tasks due soon</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {pendingTasksOnly.slice(0, 5).map((task) => (
//                 <div
//                   key={task.id}
//                   className="flex items-center space-x-3 rounded-md border bg-card/50 px-3 py-2"
//                 >
//                   <div
//                     className={`w-2 h-2 rounded-full ${
//                       task.priority === "high"
//                         ? "bg-red-500"
//                         : task.priority === "medium"
//                           ? "bg-yellow-500"
//                           : "bg-green-500"
//                     }`}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">
//                       {task.title}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       Due: {formatDate(task.dueDate)}
//                     </p>
//                   </div>
//                   <div className="text-xs text-muted-foreground capitalize">
//                     {task.type}
//                   </div>
//                 </div>
//               ))}
//               {pendingTasksOnly.length === 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   No pending tasks.
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


//Above code is working
//testing for better ui

// "use client"

// import { useMemo } from "react"
// import { useCRM } from "@/contexts/crm-context"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Users,
//   UserPlus,
//   TrendingUp,
//   IndianRupee,
//   CheckSquare,
//   AlertTriangle,
//   ReceiptIndianRupee,
//   ArrowUpRight,
//   ArrowDownRight,
// } from "lucide-react"

// const formatDate = (value: unknown) => {
//   if (!value) return "—"
//   const date = value instanceof Date ? value : new Date(value as string)
//   if (Number.isNaN(date.getTime())) return "—"
//   return date.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     timeZone: "UTC",
//   })
// }

// export function DashboardContent() {
//   const { customers, leads, deals, tasks, renewalReminders, invoices } = useCRM()

//   const stats = useMemo(() => {
//     const totalCustomers = customers.length

//     const activeLeads = leads.filter(
//       (lead) => !["closed-won", "closed-lost"].includes(lead.status),
//     ).length

//     const openDeals = deals.filter(
//       (deal) => !["closed-won", "closed-lost"].includes(deal.stage),
//     ).length

//     const closedWonRevenue = deals
//       .filter((deal) => deal.stage === "closed-won")
//       .reduce((sum, deal) => sum + (deal.value ?? 0), 0)

//     const pendingTasks = tasks.filter((task) => task.status === "pending").length

//     const renewalsDue = renewalReminders.filter((reminder) => {
//       const expiry =
//         reminder.expiryDate instanceof Date
//           ? reminder.expiryDate
//           : new Date(reminder.expiryDate as string)
//       if (Number.isNaN(expiry.getTime())) return false
//       const daysUntilExpiry = Math.ceil(
//         (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
//       )
//       return daysUntilExpiry <= 30 && daysUntilExpiry > 0
//     }).length

//     const totalInvoices = invoices?.length ?? 0
//     const invoiceRevenue = (invoices ?? []).reduce((sum, inv) => {
//       const total =
//         typeof inv.total === "number" ? inv.total : Number(inv.total ?? 0) || 0
//       return sum + total
//     }, 0)

//     return [
//       {
//         title: "Total Customers",
//         value: totalCustomers,
//         description: "Active customers",
//         trend: "+12%",
//         trendUp: true,
//         icon: Users,
//         gradient: "from-blue-500 to-cyan-500",
//         iconBg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
//         iconColor: "text-blue-600 dark:text-blue-400",
//       },
//       {
//         title: "Active Leads",
//         value: activeLeads,
//         description: "Potential customers",
//         trend: "+8%",
//         trendUp: true,
//         icon: UserPlus,
//         gradient: "from-emerald-500 to-teal-500",
//         iconBg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
//         iconColor: "text-emerald-600 dark:text-emerald-400",
//       },
//       {
//         title: "Open Deals",
//         value: openDeals,
//         description: "In progress",
//         trend: "+15%",
//         trendUp: true,
//         icon: TrendingUp,
//         gradient: "from-purple-500 to-pink-500",
//         iconBg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
//         iconColor: "text-purple-600 dark:text-purple-400",
//       },
//       {
//         title: "Revenue (Deals)",
//         value: `₹${closedWonRevenue.toLocaleString("en-IN")}`,
//         description: "Closed‑won deals",
//         trend: "+23%",
//         trendUp: true,
//         icon: IndianRupee,
//         gradient: "from-amber-500 to-orange-500",
//         iconBg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
//         iconColor: "text-amber-600 dark:text-amber-400",
//       },
//       {
//         title: "Total Invoices",
//         value: totalInvoices,
//         description: "All generated invoices",
//         trend: "+18%",
//         trendUp: true,
//         icon: ReceiptIndianRupee,
//         gradient: "from-sky-500 to-blue-500",
//         iconBg: "bg-gradient-to-br from-sky-500/10 to-blue-500/10",
//         iconColor: "text-sky-600 dark:text-sky-400",
//       },
//       {
//         title: "Invoice Revenue",
//         value: `₹${invoiceRevenue.toLocaleString("en-IN")}`,
//         description: "Total invoice amount (with GST)",
//         trend: "+27%",
//         trendUp: true,
//         icon: IndianRupee,
//         gradient: "from-indigo-500 to-violet-500",
//         iconBg: "bg-gradient-to-br from-indigo-500/10 to-violet-500/10",
//         iconColor: "text-indigo-600 dark:text-indigo-400",
//       },
//       {
//         title: "Pending Tasks",
//         value: pendingTasks,
//         description: "Due tasks",
//         trend: "-5%",
//         trendUp: false,
//         icon: CheckSquare,
//         gradient: "from-orange-500 to-red-500",
//         iconBg: "bg-gradient-to-br from-orange-500/10 to-red-500/10",
//         iconColor: "text-orange-600 dark:text-orange-400",
//       },
//       {
//         title: "Renewals Due",
//         value: renewalsDue,
//         description: "Next 30 days",
//         trend: "+3%",
//         trendUp: true,
//         icon: AlertTriangle,
//         gradient: "from-rose-500 to-pink-500",
//         iconBg: "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
//         iconColor: "text-rose-600 dark:text-rose-400",
//       },
//     ]
//   }, [customers, leads, deals, tasks, renewalReminders, invoices])

//   const pendingTasksOnly = tasks.filter((task) => task.status === "pending")

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
//         {/* Premium Header with Gradient */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black p-8 md:p-12 shadow-2xl">
//           {/* Animated background elements */}
//           <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
//           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          
//           <div className="relative z-10">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
//               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//               <span className="text-xs font-medium text-white">Live Dashboard</span>
//             </div>
//             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
//               Dashboard Overview
//             </h1>
//             {/* <p className="text-slate-300 text-base md:text-lg max-w-2xl">
//               Real-time insights 
//             </p> */}
//           </div>
//         </div>

//         {/* Premium Stats Grid with Glassmorphism */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <Card
//               key={index}
//               className="group relative overflow-hidden border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
//             >
//               {/* Gradient overlay on hover */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
//               <CardHeader className="relative pb-3">
//                 <div className="flex items-start justify-between">
//                   <div className="space-y-2 flex-1">
//                     <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                       {stat.title}
//                     </CardTitle>
//                     <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
//                       {stat.value}
//                     </div>
//                   </div>
//                   <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
//                     <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
//                   </div>
//                 </div>
//               </CardHeader>
              
//               <CardContent className="relative">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-slate-600 dark:text-slate-400">
//                     {stat.description}
//                   </p>
//                   <div className={`flex items-center gap-1 text-xs font-semibold ${
//                     stat.trendUp 
//                       ? 'text-emerald-600 dark:text-emerald-400' 
//                       : 'text-rose-600 dark:text-rose-400'
//                   }`}>
//                     {stat.trendUp ? (
//                       <ArrowUpRight className="h-3 w-3" />
//                     ) : (
//                       <ArrowDownRight className="h-3 w-3" />
//                     )}
//                     {stat.trend}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Premium Activity Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Recent customers with modern design */}
//           <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-blue-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Recent Customers</CardTitle>
//                   <CardDescription>Latest customer additions</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-3">
//                 {customers.slice(0, 5).map((customer, idx) => (
//                   <div
//                     key={customer.id}
//                     className="group flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent hover:from-blue-50 hover:to-cyan-50/30 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md"
//                   >
//                     <div className="relative">
//                       <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//                         <span className="text-sm font-bold text-white">
//                           {customer.name?.charAt(0)?.toUpperCase() ?? "C"}
//                         </span>
//                       </div>
//                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
//                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
//                         {customer.name || "Unnamed customer"}
//                       </p>
//                       <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                         {customer.company || "No company"}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-bold text-slate-900 dark:text-white">
//                         {typeof customer.totalValue === "number"
//                           ? `₹${customer.totalValue.toLocaleString("en-IN")}`
//                           : "—"}
//                       </p>
//                       <p className="text-xs text-slate-500">Total value</p>
//                     </div>
//                   </div>
//                 ))}
//                 {customers.length === 0 && (
//                   <div className="text-center py-12">
//                     <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
//                       <Users className="h-8 w-8 text-slate-400" />
//                     </div>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       No customers yet. Add your first customer to get started.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Upcoming tasks with priority indicators */}
//           <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-purple-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
//                   <CheckSquare className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
//                   <CardDescription>Tasks due soon</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-3">
//                 {pendingTasksOnly.slice(0, 5).map((task) => (
//                   <div
//                     key={task.id}
//                     className="group flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent hover:from-purple-50 hover:to-pink-50/30 dark:hover:from-purple-950/30 dark:hover:to-pink-950/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md"
//                   >
//                     <div className={`w-3 h-3 rounded-full shadow-lg ${
//                       task.priority === "high"
//                         ? "bg-gradient-to-br from-red-500 to-rose-500 animate-pulse"
//                         : task.priority === "medium"
//                           ? "bg-gradient-to-br from-amber-500 to-orange-500"
//                           : "bg-gradient-to-br from-emerald-500 to-teal-500"
//                     }`} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
//                         {task.title}
//                       </p>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         Due: {formatDate(task.dueDate)}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
//                         {task.type}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//                 {pendingTasksOnly.length === 0 && (
//                   <div className="text-center py-12">
//                     <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
//                       <CheckSquare className="h-8 w-8 text-slate-400" />
//                     </div>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       No pending tasks. You're all caught up!
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

//testing 2

"use client"

import { useMemo, useState } from "react"
import { useCRM } from "@/contexts/crm-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Users,
  UserPlus,
  TrendingUp,
  IndianRupee,
  CheckSquare,
  AlertTriangle,
  ReceiptIndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const formatDate = (value: unknown) => {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(value as string)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

type TimeRange = "7d" | "30d" | "90d"

const getRangeStart = (range: TimeRange) => {
  const now = new Date()
  const d = new Date(now)
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
  d.setDate(d.getDate() - days)
  return d
}

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function DashboardContent() {
  const { customers, leads, deals, tasks, renewalReminders, invoices } = useCRM()
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")

  const rangeStart = getRangeStart(timeRange)
  const now = new Date()

  const pendingTasksOnly = tasks.filter((task) => task.status === "pending")

  const stats = useMemo(() => {
    const inRange = (dateValue: unknown) => {
      const d = dateValue instanceof Date ? dateValue : new Date(dateValue as string)
      if (Number.isNaN(d.getTime())) return false
      return d >= rangeStart && d <= now
    }

    // Customers
    const customersCurrent = customers.filter((c) => inRange(c.createdAt)).length
    const customersPrev = customers.filter((c) => {
      const d =
        c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt as string)
      if (Number.isNaN(d.getTime())) return false
      return d < rangeStart
    }).length
    const customersTrend = percentChange(customersCurrent, customersPrev)

    // Leads
    const activeLeads = leads.filter(
      (lead) => !["closed-won", "closed-lost"].includes(lead.status),
    )
    const activeLeadsCurrent = activeLeads.filter((l) => inRange(l.createdAt)).length
    const activeLeadsPrev = activeLeads.filter((l) => {
      const d =
        l.createdAt instanceof Date ? l.createdAt : new Date(l.createdAt as string)
      if (Number.isNaN(d.getTime())) return false
      return d < rangeStart
    }).length
    const leadsTrend = percentChange(activeLeadsCurrent, activeLeadsPrev)

    // Deals
    const openDeals = deals.filter(
      (deal) => !["closed-won", "closed-lost"].includes(deal.stage),
    ).length

    const closedWonDeals = deals.filter((deal) => deal.stage === "closed-won")
    const closedWonCurrent = closedWonDeals.filter((d) =>
      inRange(d.actualCloseDate ?? d.updatedAt ?? d.createdAt),
    )
    const closedWonPrev = closedWonDeals.filter((d) => {
      const source = d.actualCloseDate ?? d.updatedAt ?? d.createdAt
      const dt = source instanceof Date ? source : new Date(source as string)
      if (Number.isNaN(dt.getTime())) return false
      return dt < rangeStart
    })

    const closedWonRevenueCurrent = closedWonCurrent.reduce(
      (sum, d) => sum + (d.value ?? 0),
      0,
    )
    const closedWonRevenuePrev = closedWonPrev.reduce(
      (sum, d) => sum + (d.value ?? 0),
      0,
    )
    const revenueTrend = percentChange(
      closedWonRevenueCurrent,
      closedWonRevenuePrev,
    )

    // Tasks
    const pendingTasks = pendingTasksOnly.length
    const pendingTasksPrev = tasks.filter((t) => {
      if (t.status !== "pending") return false
      const d = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt as string)
      if (Number.isNaN(d.getTime())) return false
      return d < rangeStart
    }).length
    const tasksTrend = percentChange(pendingTasks, pendingTasksPrev)

    // Renewals
    const renewalsDue = renewalReminders.filter((reminder) => {
      const expiry =
        reminder.expiryDate instanceof Date
          ? reminder.expiryDate
          : new Date(reminder.expiryDate as string)
      if (Number.isNaN(expiry.getTime())) return false
      const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0
    }).length

    // Invoices
    const invoicesCurrent = (invoices ?? []).filter((inv) => inRange(inv.createdAt))
    const invoicesPrev = (invoices ?? []).filter((inv) => {
      const d =
        inv.createdAt instanceof Date
          ? inv.createdAt
          : new Date(inv.createdAt as string)
      if (Number.isNaN(d.getTime())) return false
      return d < rangeStart
    })

    const totalInvoices = invoices?.length ?? 0

    const invoiceRevenueCurrent = invoicesCurrent.reduce((sum, inv) => {
      const total =
        typeof inv.total === "number" ? inv.total : Number(inv.total ?? 0) || 0
      return sum + total
    }, 0)
    const invoiceRevenuePrev = invoicesPrev.reduce((sum, inv) => {
      const total =
        typeof inv.total === "number" ? inv.total : Number(inv.total ?? 0) || 0
      return sum + total
    }, 0)
    const invoiceTrend = percentChange(invoiceRevenueCurrent, invoiceRevenuePrev)

    const customersTotal = customers.length
    const activeLeadsTotal = activeLeads.length

    return [
      {
        title: "Total Customers",
        value: customersTotal,
        description: "Active customers",
        trend: `${customersTrend >= 0 ? "+" : ""}${customersTrend.toFixed(1)}%`,
        trendUp: customersTrend >= 0,
        icon: Users,
        gradient: "from-blue-500 to-cyan-500",
        iconBg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "Active Leads",
        value: activeLeadsTotal,
        description: "Potential customers",
        trend: `${leadsTrend >= 0 ? "+" : ""}${leadsTrend.toFixed(1)}%`,
        trendUp: leadsTrend >= 0,
        icon: UserPlus,
        gradient: "from-emerald-500 to-teal-500",
        iconBg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        title: "Open Deals",
        value: openDeals,
        description: "In progress",
        trend: "+0.0%",
        trendUp: true,
        icon: TrendingUp,
        gradient: "from-purple-500 to-pink-500",
        iconBg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
      },
      {
        title: "Revenue (Deals)",
        value: `₹${closedWonRevenueCurrent.toLocaleString("en-IN")}`,
        description: "Closed‑won deals",
        trend: `${revenueTrend >= 0 ? "+" : ""}${revenueTrend.toFixed(1)}%`,
        trendUp: revenueTrend >= 0,
        icon: IndianRupee,
        gradient: "from-amber-500 to-orange-500",
        iconBg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
      },
      {
        title: "Total Invoices",
        value: totalInvoices,
        description: "All generated invoices",
        trend: "+0.0%",
        trendUp: true,
        icon: ReceiptIndianRupee,
        gradient: "from-sky-500 to-blue-500",
        iconBg: "bg-gradient-to-br from-sky-500/10 to-blue-500/10",
        iconColor: "text-sky-600 dark:text-sky-400",
      },
      {
        title: "Invoice Revenue",
        value: `₹${invoiceRevenueCurrent.toLocaleString("en-IN")}`,
        description: `Total invoice amount (${timeRange})`,
        trend: `${invoiceTrend >= 0 ? "+" : ""}${invoiceTrend.toFixed(1)}%`,
        trendUp: invoiceTrend >= 0,
        icon: IndianRupee,
        gradient: "from-indigo-500 to-violet-500",
        iconBg: "bg-gradient-to-br from-indigo-500/10 to-violet-500/10",
        iconColor: "text-indigo-600 dark:text-indigo-400",
      },
      {
        title: "Pending Tasks",
        value: pendingTasks,
        description: "Due tasks",
        trend: `${tasksTrend >= 0 ? "+" : ""}${tasksTrend.toFixed(1)}%`,
        trendUp: tasksTrend < 0 ? true : false, // fewer pending = good
        icon: CheckSquare,
        gradient: "from-orange-500 to-red-500",
        iconBg: "bg-gradient-to-br from-orange-500/10 to-red-500/10",
        iconColor: "text-orange-600 dark:text-orange-400",
      },
      {
        title: "Renewals Due",
        value: renewalsDue,
        description: "Next 30 days",
        trend: "+0.0%",
        trendUp: true,
        icon: AlertTriangle,
        gradient: "from-rose-500 to-pink-500",
        iconBg: "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
        iconColor: "text-rose-600 dark:text-rose-400",
      },
    ]
  }, [
    customers,
    leads,
    deals,
    tasks,
    renewalReminders,
    invoices,
    pendingTasksOnly,
    rangeStart,
    now,
    timeRange,
  ])

  const recentInvoices = useMemo(
    () =>
      (invoices ?? [])
        .slice()
        .sort((a, b) => {
          const da =
            a.createdAt instanceof Date
              ? a.createdAt
              : new Date(a.createdAt as string)
          const db =
            b.createdAt instanceof Date
              ? b.createdAt
              : new Date(b.createdAt as string)
          return db.getTime() - da.getTime()
        })
        .slice(0, 5),
    [invoices],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Premium Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white">
                  Live Dashboard
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Dashboard Overview
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl">
                Real-time insights 
                upcoming work.
              </p>
            </div>

            {/* Time range selector */}
            <div className="inline-flex rounded-full bg-white/10 border border-white/20 p-1 text-xs text-slate-100 backdrop-blur-sm">
              {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-full transition ${
                    timeRange === range
                      ? "bg-white text-slate-900"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  Last {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Key metrics
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />
              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </CardTitle>
                    <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                      {stat.value}
                    </div>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} shadow-md group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {stat.description}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      stat.trendUp
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {stat.trendUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Section */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Activity
          </h2>
        </div>

        {/* Activity Cards: Customers, Tasks, Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent customers */}
          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Recent Customers
                  </CardTitle>
                  <CardDescription>Latest customer additions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {customers.slice(0, 5).map((customer) => (
                  <div
                    key={customer.id}
                    className="group flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent hover:from-blue-50 hover:to-cyan-50/30 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-bold text-white">
                          {customer.name?.charAt(0)?.toUpperCase() ?? "C"}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {customer.name || "Unnamed customer"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {customer.company || "No company"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {typeof customer.totalValue === "number"
                          ? `₹${customer.totalValue.toLocaleString("en-IN")}`
                          : "—"}
                      </p>
                      <p className="text-xs text-slate-500">Total value</p>
                    </div>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                      <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No customers yet. Add your first customer to get started.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming tasks */}
          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>Tasks due soon</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {pendingTasksOnly.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent hover:from-purple-50 hover:to-pink-50/30 dark:hover:from-purple-950/30 dark:hover:to-pink-950/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md"
                  >
                    <div
                      className={`w-3 h-3 rounded-full shadow-md ${
                        task.priority === "high"
                          ? "bg-gradient-to-br from-red-500 to-rose-500 animate-pulse"
                          : task.priority === "medium"
                            ? "bg-gradient-to-br from-amber-500 to-orange-500"
                            : "bg-gradient-to-br from-emerald-500 to-teal-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Due: {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                        {task.type}
                      </span>
                    </div>
                  </div>
                ))}
                {pendingTasksOnly.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                      <CheckSquare className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No pending tasks. You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent invoices */}
          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <ReceiptIndianRupee className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Recent Invoices
                  </CardTitle>
                  <CardDescription>Latest billing activity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {recentInvoices.map((inv) => {
                  const total =
                    typeof inv.total === "number"
                      ? inv.total
                      : Number(inv.total ?? 0) || 0
                  const statusColor =
                    inv.status === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900"
                      : inv.status === "overdue"
                        ? "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-900"
                        : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900"

                  return (
                    <div
                      key={inv.id}
                      className="group flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent hover:from-emerald-50 hover:to-teal-50/30 dark:hover:from-emerald-950/30 dark:hover:to-teal-950/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {inv.customerName || "Unknown customer"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          ₹{total.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(inv.issueDate)}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColor} capitalize`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  )
                })}
                {recentInvoices.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                      <ReceiptIndianRupee className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No invoices yet. Create your first invoice to see it here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
