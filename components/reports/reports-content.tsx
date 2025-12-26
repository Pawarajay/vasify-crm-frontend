// "use client"

// import { useMemo, useState } from "react"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { useCRM } from "@/contexts/crm-context"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Area,
//   AreaChart,
// } from "recharts"
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   Target,
//   DollarSign,
//   Download,
//   ArrowUpRight,
//   ArrowDownRight,
//   BarChart3,
//   PieChart as PieChartIcon,
//   Activity,
//   CheckCircle2,
// } from "lucide-react"

// const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

// const formatCurrency = (value: number) =>
//   `₹${value.toLocaleString("en-IN", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   })}`

// export function ReportsContent() {
//   const { customers, leads, deals, tasks } = useCRM()
//   const [dateRange, setDateRange] = useState("30")

//   const {
//     totalCustomers,
//     totalLeads,
//     totalDeals,
//     totalRevenue,
//     avgDealValue,
//     conversionRate,
//     completedTasks,
//     taskCompletionRate,
//     pipelineData,
//     leadSourceData,
//   } = useMemo(() => {
//     const totalCustomers = customers.length
//     const totalLeads = leads.length
//     const totalDeals = deals.length

//     const normalizeValue = (v: unknown) =>
//       typeof v === "number" ? v : Number(v ?? 0) || 0

//     const wonDeals = deals.filter((d) => d.status === "won")
//     const totalRevenue = wonDeals.reduce(
//       (sum, d) => sum + normalizeValue(d.value),
//       0,
//     )
//     const avgDealValue =
//       wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0

//     const conversionRate =
//       totalCustomers + totalLeads > 0
//         ? (totalCustomers / (totalCustomers + totalLeads)) * 100
//         : 0

//     const completedTasks = tasks.filter((t) => t.status === "completed").length
//     const taskCompletionRate =
//       tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

//     const pipelineStages = [
//       "prospecting",
//       "qualification",
//       "proposal",
//       "negotiation",
//       "closed-won",
//     ] as const

//     const labelMap: Record<(typeof pipelineStages)[number], string> = {
//       prospecting: "Prospecting",
//       qualification: "Qualification",
//       proposal: "Proposal",
//       negotiation: "Negotiation",
//       "closed-won": "Closed Won",
//     }

//     const pipelineData = pipelineStages.map((stage) => {
//       const stageDeals = deals.filter((d) => d.stage === stage)
//       return {
//         stage: labelMap[stage],
//         count: stageDeals.length,
//         value: stageDeals.reduce(
//           (sum, d) => sum + normalizeValue(d.value),
//           0,
//         ),
//       }
//     })

//     const leadSourceData = [
//       { source: "Website", key: "website" },
//       { source: "Referral", key: "referral" },
//       { source: "Social Media", key: "social-media" },
//       { source: "Email Campaign", key: "email-campaign" },
//       { source: "Cold Call", key: "cold-call" },
//     ].map(({ source, key }) => ({
//       source,
//       count: leads.filter((l) => l.source === key).length,
//     }))

//     return {
//       totalCustomers,
//       totalLeads,
//       totalDeals,
//       totalRevenue,
//       avgDealValue,
//       conversionRate,
//       completedTasks,
//       taskCompletionRate,
//       pipelineData,
//       leadSourceData,
//     }
//   }, [customers, leads, deals, tasks])

//   // Monthly Revenue Trend (mock data for demo)
//   const revenueData = [
//     { month: "Jan", revenue: 45000, deals: 12 },
//     { month: "Feb", revenue: 52000, deals: 15 },
//     { month: "Mar", revenue: 48000, deals: 13 },
//     { month: "Apr", revenue: 61000, deals: 18 },
//     { month: "May", revenue: 55000, deals: 16 },
//     { month: "Jun", revenue: 67000, deals: 20 },
//   ]

//   // Customer Growth Data
//   const customerGrowthData = [
//     { month: "Jan", customers: 45, leads: 23 },
//     { month: "Feb", customers: 52, leads: 28 },
//     { month: "Mar", customers: 48, leads: 25 },
//     { month: "Apr", customers: 61, leads: 32 },
//     { month: "May", customers: 55, leads: 29 },
//     { month: "Jun", customers: 67, leads: 35 },
//   ]

//   const exportReport = () => {
//     // Mock export functionality
//     alert("Report exported successfully!")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
//         {/* Premium Header with Gradient */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black p-8 md:p-12 shadow-xl">
//           <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
//           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

//           <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
//                 <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
//                 <span className="text-xs font-medium text-white">
//                   Live Analytics
//                 </span>
//               </div>
//               <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
//                 Reports & Analytics
//               </h1>
//               <p className="text-slate-300 text-base md:text-lg max-w-2xl">
//                 Comprehensive business insights and performance metrics to drive growth
//               </p>
//             </div>

//             {/* Controls */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//               <Select value={dateRange} onValueChange={setDateRange}>
//                 <SelectTrigger className="w-full sm:w-40 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="7">Last 7 days</SelectItem>
//                   <SelectItem value="30">Last 30 days</SelectItem>
//                   <SelectItem value="90">Last 90 days</SelectItem>
//                   <SelectItem value="365">Last year</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button
//                 onClick={exportReport}
//                 className="w-full sm:w-auto bg-white text-slate-900 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Export Report
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Section Title */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
//             Key Performance Indicators
//           </h2>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//           <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
//             <CardHeader className="relative pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2 flex-1">
//                   <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                     Total Revenue
//                   </CardTitle>
//                   <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
//                     {formatCurrency(totalRevenue)}
//                   </div>
//                 </div>
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
//                   <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//                 </div>
//               </div>
//             </CardHeader>
//           </Card>

//           <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
//             <CardHeader className="relative pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2 flex-1">
//                   <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                     Total Customers
//                   </CardTitle>
//                   <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
//                     {totalCustomers}
//                   </div>
//                 </div>
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
//                   <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs text-slate-600 dark:text-slate-400">
//                   Active customers
//                 </p>
//                 <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
//                   <ArrowUpRight className="h-3 w-3" />
//                   +8.2%
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
//             <CardHeader className="relative pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2 flex-1">
//                   <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                     Conversion Rate
//                   </CardTitle>
//                   <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
//                     {conversionRate.toFixed(1)}%
//                   </div>
//                 </div>
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
//                   <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs text-slate-600 dark:text-slate-400">
//                   Lead to customer
//                 </p>
//                 <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
//                   <ArrowDownRight className="h-3 w-3" />
//                   -2.1%
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

          
//         </div>

//         {/* Section Title */}
//         <div className="flex items-center justify-between mt-2">
//           <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
//             Sales Analytics
//           </h2>
//         </div>

//         {/* Charts Row 1 */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-blue-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
//                   <BarChart3 className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Sales Pipeline</CardTitle>
//                   <CardDescription>Deals by stage and value</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={pipelineData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip
//                     formatter={(value: any, name: string) => [
//                       name === "value"
//                         ? formatCurrency(Number(value || 0))
//                         : value,
//                       name === "value" ? "Value" : "Count",
//                     ]}
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       border: "none",
//                       borderRadius: "12px",
//                       boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                     }}
//                   />
//                   <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="count" />
//                   <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} name="value" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-purple-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
//                   <PieChartIcon className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Lead Sources</CardTitle>
//                   <CardDescription>Distribution of lead sources</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={leadSourceData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ source, percent }) =>
//                       `${source} ${(percent * 100).toFixed(0)}%`
//                     }
//                     outerRadius={90}
//                     fill="#8884d8"
//                     dataKey="count"
//                   >
//                     {leadSourceData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       border: "none",
//                       borderRadius: "12px",
//                       boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Section Title */}
//         <div className="flex items-center justify-between mt-2">
//           <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
//             Growth Trends
//           </h2>
//         </div>

//         {/* Charts Row 2 */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-emerald-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
//                   <TrendingUp className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
//                   <CardDescription>Monthly revenue and deal count</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip
//                     formatter={(value: any, name: string) => [
//                       name === "revenue"
//                         ? formatCurrency(Number(value || 0))
//                         : value,
//                       name === "revenue" ? "Revenue" : "Deals",
//                     ]}
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       border: "none",
//                       borderRadius: "12px",
//                       boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="revenue"
//                     stackId="1"
//                     stroke="#3b82f6"
//                     fill="#3b82f6"
//                     fillOpacity={0.6}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="deals"
//                     stroke="#10b981"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-indigo-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Customer Growth</CardTitle>
//                   <CardDescription>
//                     Customer and lead acquisition over time
//                   </CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={customerGrowthData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       border: "none",
//                       borderRadius: "12px",
//                       boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="customers"
//                     stroke="#3b82f6"
//                     strokeWidth={3}
//                     name="Customers"
//                     dot={{ fill: "#3b82f6", r: 4 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="leads"
//                     stroke="#10b981"
//                     strokeWidth={3}
//                     name="Leads"
//                     dot={{ fill: "#10b981", r: 4 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Section Title */}
//         <div className="flex items-center justify-between mt-2">
//           <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
//             Performance Metrics
//           </h2>
//         </div>

//         {/* Performance Metrics */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-purple-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
//                   <CheckCircle2 className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Task Performance</CardTitle>
//                   <CardDescription>Task completion metrics</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6 space-y-4">
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed Tasks</span>
//                 <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">{completedTasks}</Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Tasks</span>
//                 <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">{tasks.length}</Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
//                 <Badge
//                   className={`border-0 ${
//                     taskCompletionRate >= 80
//                       ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
//                       : "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
//                   }`}
//                 >
//                   {taskCompletionRate.toFixed(1)}%
//                 </Badge>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
//                   <span>Progress</span>
//                   <span className="font-semibold">{taskCompletionRate.toFixed(0)}%</span>
//                 </div>
//                 <div className="w-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
//                   <div
//                     className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
//                     style={{ width: `${taskCompletionRate}%` }}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

        
//           <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
//             <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-amber-500/5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
//                   <Activity className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg font-semibold">Lead Quality</CardTitle>
//                   <CardDescription>Lead scoring and quality metrics</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6 space-y-4">
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hot Leads</span>
//                 <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-md">
//                   {leads.filter((l) => l.score >= 80).length}
//                 </Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Warm Leads</span>
//                 <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
//                   {leads.filter((l) => l.score >= 50 && l.score < 80).length}
//                 </Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cold Leads</span>
//                 <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-md">
//                   {leads.filter((l) => l.score < 50).length}
//                 </Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Score</span>
//                 <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 shadow-md">
//                   {leads.length > 0
//                     ? (
//                         leads.reduce((sum, l) => sum + l.score, 0) / leads.length
//                       ).toFixed(1)
//                     : 0}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

//testing
"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCRM } from "@/contexts/crm-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Sparkles,
  FileText,
} from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

export function ReportsContent() {
  const { customers, leads, deals } = useCRM()
  const [dateRange, setDateRange] = useState("30")

  const {
    totalCustomers,
    totalLeads,
    totalRevenue,
    avgDealValue,
    conversionRate,
    pipelineData,
    leadSourceData,
  } = useMemo(() => {
    const totalCustomers = customers.length
    const totalLeads = leads.length

    const normalizeValue = (v: unknown) =>
      typeof v === "number" ? v : Number(v ?? 0) || 0

    const wonDeals = deals.filter((d) => d.status === "won")
    const totalRevenue = wonDeals.reduce(
      (sum, d) => sum + normalizeValue(d.value),
      0,
    )
    const avgDealValue =
      wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0

    const conversionRate =
      totalCustomers + totalLeads > 0
        ? (totalCustomers / (totalCustomers + totalLeads)) * 100
        : 0

    const pipelineStages = [
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed-won",
    ] as const

    const labelMap: Record<(typeof pipelineStages)[number], string> = {
      prospecting: "Prospecting",
      qualification: "Qualification",
      proposal: "Proposal",
      negotiation: "Negotiation",
      "closed-won": "Closed Won",
    }

    const pipelineData = pipelineStages.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage)
      return {
        stage: labelMap[stage],
        count: stageDeals.length,
        value: stageDeals.reduce(
          (sum, d) => sum + normalizeValue(d.value),
          0,
        ),
      }
    })

    const leadSourceData = [
      { source: "Website", key: "website" },
      { source: "Referral", key: "referral" },
      { source: "Social Media", key: "social-media" },
      { source: "Email Campaign", key: "email-campaign" },
      { source: "Cold Call", key: "cold-call" },
    ].map(({ source, key }) => ({
      source,
      count: leads.filter((l) => l.source === key).length,
    }))

    return {
      totalCustomers,
      totalLeads,
      totalRevenue,
      avgDealValue,
      conversionRate,
      pipelineData,
      leadSourceData,
    }
  }, [customers, leads, deals])

  // Monthly Revenue Trend (mock data for demo)
  const revenueData = [
    { month: "Jan", revenue: 45000, deals: 12 },
    { month: "Feb", revenue: 52000, deals: 15 },
    { month: "Mar", revenue: 48000, deals: 13 },
    { month: "Apr", revenue: 61000, deals: 18 },
    { month: "May", revenue: 55000, deals: 16 },
    { month: "Jun", revenue: 67000, deals: 20 },
  ]

  // Customer Growth Data
  const customerGrowthData = [
    { month: "Jan", customers: 45, leads: 23 },
    { month: "Feb", customers: 52, leads: 28 },
    { month: "Mar", customers: 48, leads: 25 },
    { month: "Apr", customers: 61, leads: 32 },
    { month: "May", customers: 55, leads: 29 },
    { month: "Jun", customers: 67, leads: 35 },
  ]

  const exportReport = () => {
    alert("Report exported successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-[1600px]">
        {/* Premium Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="space-y-3">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50">
                <div className="relative">
                  <Activity className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Live Analytics
                </span>
              </div>

              {/* Main Title */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Reports & Analytics
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  Comprehensive business insights and performance metrics
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-44 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={exportReport}
                className="h-11 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Section */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Key Performance Indicators
          </h2>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-10 sm:mb-12">
          <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/50 dark:to-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  <DollarSign className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+12.5%</span>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Total Revenue
              </CardTitle>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                {formatCurrency(totalRevenue)}
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                From won deals
              </p>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-amber-900/30 dark:to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Card>

          <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-cyan-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+8.2%</span>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Total Customers
              </CardTitle>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                {totalCustomers}
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                Active customers
              </p>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-100/50 to-transparent dark:from-blue-900/30 dark:to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Card>

          <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50/50 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  <Target className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/50 dark:to-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span>-2.1%</span>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Conversion Rate
              </CardTitle>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                {conversionRate.toFixed(1)}%
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                Lead to customer
              </p>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-900/30 dark:to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Card>

          <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-50/50 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+15.3%</span>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Avg Deal Value
              </CardTitle>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                {formatCurrency(avgDealValue)}
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                Per closed deal
              </p>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-transparent dark:from-emerald-900/30 dark:to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Card>
        </div>

        {/* Sales Analytics Section */}
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Sales Analytics
          </h2>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-7 mb-10 sm:mb-12">
          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-50/80 via-cyan-50/40 to-transparent dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Sales Pipeline
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Deals by stage and value
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      name === "value"
                        ? formatCurrency(Number(value || 0))
                        : value,
                      name === "value" ? "Value" : "Count",
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="count" />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} name="value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-purple-50/80 via-pink-50/40 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <PieChartIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Lead Sources
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Distribution of lead sources
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percent }) =>
                      `${source} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Growth Trends Section */}
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Growth Trends
          </h2>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-7 mb-10 sm:mb-12">
          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-transparent dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Revenue Trend
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Monthly revenue and deal count
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      name === "revenue"
                        ? formatCurrency(Number(value || 0))
                        : value,
                      name === "revenue" ? "Revenue" : "Deals",
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Line
                    type="monotone"
                    dataKey="deals"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-indigo-50/80 via-violet-50/40 to-transparent dark:from-indigo-950/30 dark:via-violet-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Customer Growth
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Customer and lead acquisition over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Customers"
                    dot={{ fill: "#3b82f6", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Leads"
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics Section */}
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Lead Performance
          </h2>
        </div>

        {/* Performance Metrics Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-transparent dark:from-amber-950/30 dark:via-orange-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Lead Quality
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Lead scoring and quality metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hot Leads</span>
                <Badge className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.filter((l) => l.score >= 80).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-amber-200 dark:hover:border-amber-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Warm Leads</span>
                <Badge className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.filter((l) => l.score >= 50 && l.score < 80).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cold Leads</span>
                <Badge className="bg-gradient-to-br from-slate-500 to-slate-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.filter((l) => l.score < 50).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/50 dark:to-indigo-900/30 border border-indigo-200/50 dark:border-indigo-900/50">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Average Score</span>
                <Badge className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.length > 0
                    ? (
                        leads.reduce((sum, l) => sum + l.score, 0) / leads.length
                      ).toFixed(1)
                    : 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-50/80 via-cyan-50/40 to-transparent dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Lead Distribution
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Lead status breakdown
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active Leads</span>
                <Badge className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.filter((l) => !["closed-won", "closed-lost"].includes(l.status)).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Converted</span>
                <Badge className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.filter((l) => l.status === "closed-won").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lost</span>
                <Badge className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {leads.filter((l) => l.status === "closed-lost").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border border-purple-200/50 dark:border-purple-900/50">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Total Leads</span>
                <Badge className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {totalLeads}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="group border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-transparent dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Revenue Metrics
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Revenue performance indicators
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Won Deals</span>
                <Badge className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {deals.filter((d) => d.status === "won").length}
                </Badge>
              </div>
               <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Avg Deal Size</span>
                <Badge className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {formatCurrency(avgDealValue)}
                </Badge> 
              </div> 
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-amber-200 dark:hover:border-amber-900/50 transition-all duration-200">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Revenue</span>
                <Badge className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {formatCurrency(totalRevenue)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/50 dark:to-violet-900/30 border border-violet-200/50 dark:border-violet-900/50">
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Win Rate</span>
                <Badge className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 shadow-md px-3 py-1 text-sm font-bold">
                  {deals.length > 0
                    ? ((deals.filter((d) => d.status === "won").length / deals.length) * 100).toFixed(1)
                    : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}