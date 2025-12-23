// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
// import { TrendingUp, TrendingDown, Users, Target, DollarSign, Download } from "lucide-react"

// const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

// export function ReportsContent() {
//   const { customers, leads, deals, tasks } = useCRM()
//   const [dateRange, setDateRange] = useState("30")

//   // Calculate KPIs
//   const totalCustomers = customers.length
//   const totalLeads = leads.length
//   const totalDeals = deals.length
//   const totalRevenue = deals.filter((d) => d.status === "won").reduce((sum, d) => sum + d.value, 0)
//   const avgDealValue = totalRevenue / deals.filter((d) => d.status === "won").length || 0
//   const conversionRate = totalCustomers > 0 ? (totalCustomers / (totalCustomers + totalLeads)) * 100 : 0
//   const completedTasks = tasks.filter((t) => t.status === "completed").length
//   const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

//   // Sales Pipeline Data
//   const pipelineData = [
//     {
//       stage: "Prospecting",
//       count: deals.filter((d) => d.stage === "prospecting").length,
//       value: deals.filter((d) => d.stage === "prospecting").reduce((sum, d) => sum + d.value, 0),
//     },
//     {
//       stage: "Qualification",
//       count: deals.filter((d) => d.stage === "qualification").length,
//       value: deals.filter((d) => d.stage === "qualification").reduce((sum, d) => sum + d.value, 0),
//     },
//     {
//       stage: "Proposal",
//       count: deals.filter((d) => d.stage === "proposal").length,
//       value: deals.filter((d) => d.stage === "proposal").reduce((sum, d) => sum + d.value, 0),
//     },
//     {
//       stage: "Negotiation",
//       count: deals.filter((d) => d.stage === "negotiation").length,
//       value: deals.filter((d) => d.stage === "negotiation").reduce((sum, d) => sum + d.value, 0),
//     },
//     {
//       stage: "Closed Won",
//       count: deals.filter((d) => d.stage === "closed-won").length,
//       value: deals.filter((d) => d.stage === "closed-won").reduce((sum, d) => sum + d.value, 0),
//     },
//   ]

//   // Lead Source Data
//   const leadSourceData = [
//     { source: "Website", count: leads.filter((l) => l.source === "website").length },
//     { source: "Referral", count: leads.filter((l) => l.source === "referral").length },
//     { source: "Social Media", count: leads.filter((l) => l.source === "social-media").length },
//     { source: "Email Campaign", count: leads.filter((l) => l.source === "email-campaign").length },
//     { source: "Cold Call", count: leads.filter((l) => l.source === "cold-call").length },
//   ]

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
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
//           <p className="text-gray-600 mt-1">Comprehensive business insights and performance metrics</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Select value={dateRange} onValueChange={setDateRange}>
//             <SelectTrigger className="w-40">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7">Last 7 days</SelectItem>
//               <SelectItem value="30">Last 30 days</SelectItem>
//               <SelectItem value="90">Last 90 days</SelectItem>
//               <SelectItem value="365">Last year</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button onClick={exportReport} className="bg-blue-600 hover:bg-blue-700">
//             <Download className="w-4 h-4 mr-2" />
//             Export Report
//           </Button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
//               +12.5% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalCustomers}</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
//               +8.2% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
//               -2.1% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg Deal Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${avgDealValue.toLocaleString()}</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
//               +5.7% from last month
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Sales Pipeline</CardTitle>
//             <CardDescription>Deals by stage and value</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={pipelineData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="stage" />
//                 <YAxis />
//                 <Tooltip
//                   formatter={(value, name) => [
//                     name === "value" ? `$${value.toLocaleString()}` : value,
//                     name === "value" ? "Value" : "Count",
//                   ]}
//                 />
//                 <Bar dataKey="count" fill="#3b82f6" name="count" />
//                 <Bar dataKey="value" fill="#10b981" name="value" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Lead Sources</CardTitle>
//             <CardDescription>Distribution of lead sources</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={leadSourceData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="count"
//                 >
//                   {leadSourceData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Revenue Trend</CardTitle>
//             <CardDescription>Monthly revenue and deal count</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip
//                   formatter={(value, name) => [
//                     name === "revenue" ? `$${value.toLocaleString()}` : value,
//                     name === "revenue" ? "Revenue" : "Deals",
//                   ]}
//                 />
//                 <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
//                 <Line type="monotone" dataKey="deals" stroke="#10b981" strokeWidth={2} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Growth</CardTitle>
//             <CardDescription>Customer and lead acquisition over time</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={customerGrowthData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} name="Customers" />
//                 <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} name="Leads" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Performance Metrics */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Task Performance</CardTitle>
//             <CardDescription>Task completion metrics</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Completed Tasks</span>
//               <Badge variant="secondary">{completedTasks}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Total Tasks</span>
//               <Badge variant="outline">{tasks.length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Completion Rate</span>
//               <Badge variant={taskCompletionRate >= 80 ? "default" : "destructive"}>
//                 {taskCompletionRate.toFixed(1)}%
//               </Badge>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${taskCompletionRate}%` }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Deal Status</CardTitle>
//             <CardDescription>Current deal distribution</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Won Deals</span>
//               <Badge className="bg-green-100 text-green-800">{deals.filter((d) => d.status === "won").length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Active Deals</span>
//               <Badge className="bg-blue-100 text-blue-800">{deals.filter((d) => d.status === "active").length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Lost Deals</span>
//               <Badge className="bg-red-100 text-red-800">{deals.filter((d) => d.status === "lost").length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Win Rate</span>
//               <Badge variant="secondary">
//                 {deals.length > 0
//                   ? ((deals.filter((d) => d.status === "won").length / deals.length) * 100).toFixed(1)
//                   : 0}
//                 %
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Lead Quality</CardTitle>
//             <CardDescription>Lead scoring and quality metrics</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Hot Leads</span>
//               <Badge className="bg-red-100 text-red-800">{leads.filter((l) => l.score >= 80).length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Warm Leads</span>
//               <Badge className="bg-yellow-100 text-yellow-800">
//                 {leads.filter((l) => l.score >= 50 && l.score < 80).length}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Cold Leads</span>
//               <Badge className="bg-gray-100 text-gray-800">{leads.filter((l) => l.score < 50).length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Avg Score</span>
//               <Badge variant="secondary">
//                 {leads.length > 0 ? (leads.reduce((sum, l) => sum + l.score, 0) / leads.length).toFixed(1) : 0}
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



//testing

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
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Reports & Analytics
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Comprehensive business insights and performance metrics
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Select value={dateRange} onValueChange={setDateRange}>
//             <SelectTrigger className="w-40">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7">Last 7 days</SelectItem>
//               <SelectItem value="30">Last 30 days</SelectItem>
//               <SelectItem value="90">Last 90 days</SelectItem>
//               <SelectItem value="365">Last year</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button
//             onClick={exportReport}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             Export Report
//           </Button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatCurrency(totalRevenue)}
//             </div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
//               +12.5% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalCustomers}</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
//               +8.2% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Conversion Rate
//             </CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {conversionRate.toFixed(1)}%
//             </div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
//               -2.1% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Avg Deal Value
//             </CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatCurrency(avgDealValue)}
//             </div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
//               +5.7% from last month
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Sales Pipeline</CardTitle>
//             <CardDescription>Deals by stage and value</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={pipelineData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="stage" />
//                 <YAxis />
//                 <Tooltip
//                   formatter={(value: any, name: string) => [
//                     name === "value"
//                       ? formatCurrency(Number(value || 0))
//                       : value,
//                     name === "value" ? "Value" : "Count",
//                   ]}
//                 />
//                 <Bar dataKey="count" fill="#3b82f6" name="count" />
//                 <Bar dataKey="value" fill="#10b981" name="value" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Lead Sources</CardTitle>
//             <CardDescription>Distribution of lead sources</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={leadSourceData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ source, percent }) =>
//                     `${source} ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="count"
//                 >
//                   {leadSourceData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Revenue Trend</CardTitle>
//             <CardDescription>Monthly revenue and deal count</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip
//                   formatter={(value: any, name: string) => [
//                     name === "revenue"
//                       ? formatCurrency(Number(value || 0))
//                       : value,
//                     name === "revenue" ? "Revenue" : "Deals",
//                   ]}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stackId="1"
//                   stroke="#3b82f6"
//                   fill="#3b82f6"
//                   fillOpacity={0.6}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="deals"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Growth</CardTitle>
//             <CardDescription>
//               Customer and lead acquisition over time
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={customerGrowthData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="customers"
//                   stroke="#3b82f6"
//                   strokeWidth={2}
//                   name="Customers"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="leads"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                   name="Leads"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Performance Metrics */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Task Performance</CardTitle>
//             <CardDescription>Task completion metrics</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Completed Tasks</span>
//               <Badge variant="secondary">{completedTasks}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Total Tasks</span>
//               <Badge variant="outline">{tasks.length}</Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Completion Rate</span>
//               <Badge
//                 variant={taskCompletionRate >= 80 ? "default" : "destructive"}
//               >
//                 {taskCompletionRate.toFixed(1)}%
//               </Badge>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${taskCompletionRate}%` }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Deal Status</CardTitle>
//             <CardDescription>Current deal distribution</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Won Deals</span>
//               <Badge className="bg-green-100 text-green-800">
//                 {deals.filter((d) => d.status === "won").length}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Active Deals</span>
//               <Badge className="bg-blue-100 text-blue-800">
//                 {deals.filter((d) => d.status === "active").length}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Lost Deals</span>
//               <Badge className="bg-red-100 text-red-800">
//                 {deals.filter((d) => d.status === "lost").length}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Win Rate</span>
//               <Badge variant="secondary">
//                 {deals.length > 0
//                   ? (
//                       (deals.filter((d) => d.status === "won").length /
//                         deals.length) *
//                       100
//                     ).toFixed(1)
//                   : 0}
//                 %
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Lead Quality</CardTitle>
//             <CardDescription>Lead scoring and quality metrics</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Hot Leads</span>
//               <Badge className="bg-red-100 text-red-800">
//                 {leads.filter((l) => l.score >= 80).length}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Warm Leads</span>
//               <Badge className="bg-yellow-100 text-yellow-800">
//                 {
//                   leads.filter(
//                     (l) => l.score >= 50 && l.score < 80,
//                   ).length
//                 }
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Cold Leads</span>
//               <Badge className="bg-gray-100 text-gray-800">
//                 {leads.filter((l) => l.score < 50).length}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Avg Score</span>
//               <Badge variant="secondary">
//                 {leads.length > 0
//                   ? (
//                       leads.reduce((sum, l) => sum + l.score, 0) / leads.length
//                     ).toFixed(1)
//                   : 0}
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

//testing Improve Ui (17-12-2025)
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
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle2,
} from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

export function ReportsContent() {
  const { customers, leads, deals, tasks } = useCRM()
  const [dateRange, setDateRange] = useState("30")

  const {
    totalCustomers,
    totalLeads,
    totalDeals,
    totalRevenue,
    avgDealValue,
    conversionRate,
    completedTasks,
    taskCompletionRate,
    pipelineData,
    leadSourceData,
  } = useMemo(() => {
    const totalCustomers = customers.length
    const totalLeads = leads.length
    const totalDeals = deals.length

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

    const completedTasks = tasks.filter((t) => t.status === "completed").length
    const taskCompletionRate =
      tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

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
      totalDeals,
      totalRevenue,
      avgDealValue,
      conversionRate,
      completedTasks,
      taskCompletionRate,
      pipelineData,
      leadSourceData,
    }
  }, [customers, leads, deals, tasks])

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
    // Mock export functionality
    alert("Report exported successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Premium Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white">
                  Live Analytics
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Reports & Analytics
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl">
                Comprehensive business insights and performance metrics to drive growth
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-40 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
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
                className="w-full sm:w-auto bg-white text-slate-900 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Key Performance Indicators
          </h2>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Total Revenue
                  </CardTitle>
                  <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {formatCurrency(totalRevenue)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  From closed deals
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Total Customers
                  </CardTitle>
                  <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {totalCustomers}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Active customers
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +8.2%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Conversion Rate
                  </CardTitle>
                  <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {conversionRate.toFixed(1)}%
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Lead to customer
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <ArrowDownRight className="h-3 w-3" />
                  -2.1%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Avg Deal Value
                  </CardTitle>
                  <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {formatCurrency(avgDealValue)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md group-hover:scale-110 transition-transform duration-500">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Per closed deal
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +5.7%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Sales Analytics
          </h2>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Sales Pipeline</CardTitle>
                  <CardDescription>Deals by stage and value</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      name === "value"
                        ? formatCurrency(Number(value || 0))
                        : value,
                      name === "value" ? "Value" : "Count",
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="count" />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} name="value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Lead Sources</CardTitle>
                  <CardDescription>Distribution of lead sources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percent }) =>
                      `${source} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
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
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Growth Trends
          </h2>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue and deal count</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      name === "revenue"
                        ? formatCurrency(Number(value || 0))
                        : value,
                      name === "revenue" ? "Revenue" : "Deals",
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
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

          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-indigo-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Customer Growth</CardTitle>
                  <CardDescription>
                    Customer and lead acquisition over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Customers"
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Leads"
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Performance Metrics
          </h2>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Task Performance</CardTitle>
                  <CardDescription>Task completion metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed Tasks</span>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">{completedTasks}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Tasks</span>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">{tasks.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
                <Badge
                  className={`border-0 ${
                    taskCompletionRate >= 80
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                  }`}
                >
                  {taskCompletionRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Progress</span>
                  <span className="font-semibold">{taskCompletionRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${taskCompletionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Deal Status</CardTitle>
                  <CardDescription>Current deal distribution</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Won Deals</span>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md">
                  {deals.filter((d) => d.status === "won").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Deals</span>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md">
                  {deals.filter((d) => d.status === "active").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lost Deals</span>
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-md">
                  {deals.filter((d) => d.status === "lost").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Win Rate</span>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                  {deals.length > 0
                    ? (
                        (deals.filter((d) => d.status === "won").length /
                          deals.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-transparent to-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Lead Quality</CardTitle>
                  <CardDescription>Lead scoring and quality metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hot Leads</span>
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-md">
                  {leads.filter((l) => l.score >= 80).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Warm Leads</span>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                  {leads.filter((l) => l.score >= 50 && l.score < 80).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cold Leads</span>
                <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-md">
                  {leads.filter((l) => l.score < 50).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Score</span>
                <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 shadow-md">
                  {leads.length > 0
                    ? (
                        leads.reduce((sum, l) => sum + l.score, 0) / leads.length
                      ).toFixed(1)
                    : 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}