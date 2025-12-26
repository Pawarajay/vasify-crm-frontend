// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { useCRM } from "@/contexts/crm-context"
// import { RenewalDialog } from "./renewal-dialog"
// import { WhatsAppSettingsDialog } from "./whatsapp-settings-dialog"
// import { MessageTemplateDialog } from "./message-template-dialog"
// import {
//   MessageSquare,
//   Calendar,
//   Clock,
//   AlertTriangle,
//   CheckCircle,
//   Settings,
//   Send,
//   Search,
//   Filter,
//   Plus,
// } from "lucide-react"

// export function RenewalsContent() {
//   const { customers, renewals, addRenewal, updateRenewal, deleteRenewal } = useCRM()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false)
//   const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
//   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
//   const [selectedRenewal, setSelectedRenewal] = useState(null)

//   // Filter renewals
//   const filteredRenewals = renewals.filter((renewal) => {
//     const customer = customers.find((c) => c.id === renewal.customerId)
//     const matchesSearch =
//       customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       renewal.service.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesFilter = filterStatus === "all" || renewal.status === filterStatus
//     return matchesSearch && matchesFilter
//   })

//   // Calculate renewal statistics
//   const upcomingRenewals = renewals.filter((r) => {
//     const daysUntilExpiry = Math.ceil((new Date(r.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
//     return daysUntilExpiry <= 30 && daysUntilExpiry > 0
//   }).length

//   const expiredRenewals = renewals.filter((r) => {
//     const daysUntilExpiry = Math.ceil((new Date(r.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
//     return daysUntilExpiry <= 0
//   }).length

//   const renewedThisMonth = renewals.filter((r) => r.status === "renewed").length

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge className="bg-green-100 text-green-800">Active</Badge>
//       case "expiring":
//         return <Badge className="bg-yellow-100 text-yellow-800">Expiring</Badge>
//       case "expired":
//         return <Badge className="bg-red-100 text-red-800">Expired</Badge>
//       case "renewed":
//         return <Badge className="bg-blue-100 text-blue-800">Renewed</Badge>
//       default:
//         return <Badge variant="secondary">{status}</Badge>
//     }
//   }

//   const getDaysUntilExpiry = (expiryDate: string) => {
//     const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
//     return days
//   }

//   const sendWhatsAppReminder = (renewalId: string) => {
//     // Mock WhatsApp sending functionality
//     alert(`WhatsApp reminder sent for renewal ${renewalId}`)
//     // In real implementation, this would integrate with WhatsApp Business API
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Renewal Management</h1>
//           <p className="text-gray-600 mt-1">Automated WhatsApp reminders for expiring services</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)} className="border-gray-300">
//             <Settings className="w-4 h-4 mr-2" />
//             WhatsApp Settings
//           </Button>
//           <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)} className="border-gray-300">
//             <MessageSquare className="w-4 h-4 mr-2" />
//             Message Templates
//           </Button>
//           <Button onClick={() => setIsRenewalDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Renewal
//           </Button>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{upcomingRenewals}</div>
//             <p className="text-xs text-muted-foreground">Next 30 days</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Expired Services</CardTitle>
//             <AlertTriangle className="h-4 w-4 text-red-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">{expiredRenewals}</div>
//             <p className="text-xs text-muted-foreground">Require immediate attention</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Renewed This Month</CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{renewedThisMonth}</div>
//             <p className="text-xs text-muted-foreground">Successfully renewed</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Services</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{renewals.length}</div>
//             <p className="text-xs text-muted-foreground">Under management</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             placeholder="Search renewals..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-gray-500" />
//           <Button
//             variant={filterStatus === "all" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("all")}
//           >
//             All
//           </Button>
//           <Button
//             variant={filterStatus === "expiring" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("expiring")}
//           >
//             Expiring
//           </Button>
//           <Button
//             variant={filterStatus === "expired" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("expired")}
//           >
//             Expired
//           </Button>
//           <Button
//             variant={filterStatus === "renewed" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("renewed")}
//           >
//             Renewed
//           </Button>
//         </div>
//       </div>

//       {/* Renewals Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Service Renewals</CardTitle>
//           <CardDescription>Manage and track all service renewals</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {filteredRenewals.map((renewal) => {
//               const customer = customers.find((c) => c.id === renewal.customerId)
//               const daysUntilExpiry = getDaysUntilExpiry(renewal.expiryDate)

//               return (
//                 <div
//                   key={renewal.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-medium">{customer?.name}</h3>
//                         {getStatusBadge(renewal.status)}
//                       </div>
//                       <p className="text-sm text-gray-600">{renewal.service}</p>
//                       <div className="flex items-center gap-4 mt-1">
//                         <span className="text-xs text-gray-500">
//                           Expires: {new Date(renewal.expiryDate).toLocaleDateString()}
//                         </span>
//                         <span className="text-xs text-gray-500">Amount: {renewal.amount}</span>
//                         {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
//                           <span className="text-xs text-yellow-600 font-medium">{daysUntilExpiry} days left</span>
//                         )}
//                         {daysUntilExpiry <= 0 && (
//                           <span className="text-xs text-red-600 font-medium">
//                             Expired {Math.abs(daysUntilExpiry)} days ago
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => sendWhatsAppReminder(renewal.id)}
//                       className="border-green-300 text-green-700 hover:bg-green-50"
//                     >
//                       <Send className="w-4 h-4 mr-1" />
//                       Send Reminder
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedRenewal(renewal)
//                         setIsRenewalDialogOpen(true)
//                       }}
//                     >
//                       Edit
//                     </Button>
//                   </div>
//                 </div>
//               )
//             })}
//             {filteredRenewals.length === 0 && (
//               <div className="text-center py-8 text-gray-500">No renewals found matching your criteria.</div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Dialogs */}
//       <RenewalDialog
//         isOpen={isRenewalDialogOpen}
//         onClose={() => {
//           setIsRenewalDialogOpen(false)
//           setSelectedRenewal(null)
//         }}
//         renewal={selectedRenewal}
//         onSave={(renewalData) => {
//           if (selectedRenewal) {
//             updateRenewal(selectedRenewal.id, renewalData)
//           } else {
//             addRenewal(renewalData)
//           }
//           setIsRenewalDialogOpen(false)
//           setSelectedRenewal(null)
//         }}
//       />

//       <WhatsAppSettingsDialog isOpen={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)} />

//       <MessageTemplateDialog isOpen={isTemplateDialogOpen} onClose={() => setIsTemplateDialogOpen(false)} />
//     </div>
//   )
// }

//testing  (23-12-2025)



// "use client";

// import { useMemo, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { useCRM } from "@/contexts/crm-context";
// import { RenewalDialog } from "./renewal-dialog";
// import { WhatsAppSettingsDialog } from "./whatsapp-settings-dialog";
// import { MessageTemplateDialog } from "./message-template-dialog";
// import {
//   MessageSquare,
//   Calendar,
//   Clock,
//   AlertTriangle,
//   CheckCircle,
//   Settings,
//   Send,
//   Search,
//   Filter,
//   Plus,
//   CalendarClock,
// } from "lucide-react";

// type CustomerRenewalRow = {
//   customerId: string;
//   customerName: string;
//   service: string;
//   expiryDate: string | null;
//   amount: number;
//   status: string;
//   renewalId: string | null;
//   baseDate: string | null;
// };

// // Calculate status based on expiry date
// // const calculateRenewalStatus = (expiryDate: string | null): string => {
// //   if (!expiryDate) return "active";
  
// //   const expiry = new Date(expiryDate);
// //   const today = new Date();
// //   const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

// //   if (daysUntilExpiry < 0) {
// //     return "expired";
// //   } else if (daysUntilExpiry <= 30) {
// //     return "expiring";
// //   } else {
// //     return "active";
// //   }
// // };

// //testing 24-12-2025

// // Calculate status based on expiry date
// const calculateRenewalStatus = (expiryDate: string | null): string => {
//   if (!expiryDate) return "active";

//   const expiry = new Date(expiryDate);
//   const today = new Date();
//   const daysUntilExpiry = Math.ceil(
//     (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//   );

//   if (daysUntilExpiry < 0) return "expired";
//   if (daysUntilExpiry <= 30) return "expiring";
//   return "active";
// };


// export function RenewalsContent() {
//   const { customers, renewals, addRenewal, updateRenewal } = useCRM();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
//   const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
//   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<CustomerRenewalRow | null>(null);

//   // Join customers + renewals
//   const customerRenewals: CustomerRenewalRow[] = useMemo(
//     () =>
//       customers.map((c) => {
//         const r = renewals.find((x) => x.customerId === c.id);

//         const service =
//           r?.service ??
//           (c as any).recurringService ??
//           (c as any).service ??
//           "";
        
//         const expiryDate =
//           (r?.expiryDate as any) ??
//           (c as any).nextRenewalDate ??
//           null;
        
//         const amount =
//           typeof r?.amount === "number"
//             ? r.amount
//             : typeof (c as any).recurringAmount === "number"
//             ? (c as any).recurringAmount
//             : 0;
        
//         // Calculate status dynamically based on expiry date
//         const calculatedStatus = calculateRenewalStatus(expiryDate);
//         // const status = r?.status ?? calculatedStatus;
//         const status =
//   r?.status === "renewed" ? "renewed" : calculatedStatus;

//         // Get base date (customer creation date)
//         const baseDate = 
//           r?.baseDate ??
//           (c.createdAt instanceof Date 
//             ? c.createdAt.toISOString() 
//             : c.createdAt) ??
//           null;

//         return {
//           customerId: c.id,
//           customerName: c.name,
//           service,
//           expiryDate: expiryDate
//             ? new Date(expiryDate as any).toISOString()
//             : null,
//           amount,
//           status,
//           renewalId: r?.id ?? null,
//           baseDate,
//         };
//       }),
//     [customers, renewals]
//   );

//   // Filter rows by search + status
//   const filteredRows = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();

//     return customerRenewals.filter((row) => {
//       const matchesSearch =
//         !term ||
//         row.customerName.toLowerCase().includes(term) ||
//         row.service.toLowerCase().includes(term);

//       const matchesStatus =
//         filterStatus === "all" ||
//         row.status.toLowerCase() === filterStatus.toLowerCase();

//       return matchesSearch && matchesStatus;
//     });
//   }, [customerRenewals, searchTerm, filterStatus]);

//   // Stats based on actual renewals with dynamic status calculation
//   const upcomingRenewals = customerRenewals.filter((row) => {
//     if (!row.expiryDate) return false;
//     const daysUntilExpiry = Math.ceil(
//       (new Date(row.expiryDate).getTime() - new Date().getTime()) /
//         (1000 * 60 * 60 * 24)
//     );
//     return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
//   }).length;

//   const expiredRenewals = customerRenewals.filter((row) => {
//     if (!row.expiryDate) return false;
//     const daysUntilExpiry = Math.ceil(
//       (new Date(row.expiryDate).getTime() - new Date().getTime()) /
//         (1000 * 60 * 60 * 24)
//     );
//     return daysUntilExpiry <= 0;
//   }).length;

//   const renewedThisMonth = renewals.filter((r) => r.status === "renewed").length || 0;

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return (
//           <Badge className="bg-green-100 text-green-800 border-green-200">
//             <CheckCircle className="w-3 h-3 mr-1" />
//             Active
//           </Badge>
//         );
//       case "expiring":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
//             <Clock className="w-3 h-3 mr-1" />
//             Expiring Soon
//           </Badge>
//         );
//       case "expired":
//         return (
//           <Badge className="bg-red-100 text-red-800 border-red-200">
//             <AlertTriangle className="w-3 h-3 mr-1" />
//             Expired
//           </Badge>
//         );
//       case "renewed":
//         return (
//           <Badge className="bg-blue-100 text-blue-800 border-blue-200">
//             <CheckCircle className="w-3 h-3 mr-1" />
//             Renewed
//           </Badge>
//         );
//       default:
//         return <Badge variant="secondary">{status}</Badge>;
//     }
//   };

//   const getDaysUntilExpiry = (expiryDate: string | null) => {
//     if (!expiryDate) return NaN;
//     const days = Math.ceil(
//       (new Date(expiryDate).getTime() - new Date().getTime()) /
//         (1000 * 60 * 60 * 24)
//     );
//     return days;
//   };

//   const sendWhatsAppReminder = (renewalId: string | null) => {
//     if (!renewalId) {
//       alert("Create a renewal record before sending reminders.");
//       return;
//     }
//     alert(`WhatsApp reminder sent for renewal ${renewalId}`);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Renewal Management
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Automated tracking and WhatsApp reminders for expiring services
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             onClick={() => setIsSettingsDialogOpen(true)}
//             className="border-gray-300"
//           >
//             <Settings className="w-4 h-4 mr-2" />
//             WhatsApp Settings
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => setIsTemplateDialogOpen(true)}
//             className="border-gray-300"
//           >
//             <MessageSquare className="w-4 h-4 mr-2" />
//             Message Templates
//           </Button>
//           <Button
//             onClick={() => {
//               setSelectedRow(null);
//               setIsRenewalDialogOpen(true);
//             }}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Renewal
//           </Button>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Upcoming Renewals
//             </CardTitle>
//             <Clock className="h-4 w-4 text-yellow-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-600">{upcomingRenewals}</div>
//             <p className="text-xs text-muted-foreground">Expiring in next 30 days</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Expired Services
//             </CardTitle>
//             <AlertTriangle className="h-4 w-4 text-red-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">
//               {expiredRenewals}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Require immediate attention
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Renewed This Month
//             </CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">
//               {renewedThisMonth}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Successfully renewed
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Customers
//             </CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{customerRenewals.length}</div>
//             <p className="text-xs text-muted-foreground">
//               Under renewal tracking
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             placeholder="Search renewals..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-gray-500" />
//           <Button
//             variant={filterStatus === "all" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("all")}
//           >
//             All
//           </Button>
//           <Button
//             variant={filterStatus === "active" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("active")}
//           >
//             Active
//           </Button>
//           <Button
//             variant={filterStatus === "expiring" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("expiring")}
//           >
//             Expiring
//           </Button>
//           <Button
//             variant={filterStatus === "expired" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("expired")}
//           >
//             Expired
//           </Button>
//           <Button
//             variant={filterStatus === "renewed" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFilterStatus("renewed")}
//           >
//             Renewed
//           </Button>
//         </div>
//       </div>

//       {/* Renewals Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Service Renewals</CardTitle>
//           <CardDescription>
//             Manage and track all service renewals with automatic status updates
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {filteredRows.map((row) => {
//               const daysUntilExpiry = getDaysUntilExpiry(row.expiryDate);

//               return (
//                 <div
//                   key={row.customerId}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center space-x-4 flex-1">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <h3 className="font-medium text-gray-900">{row.customerName}</h3>
//                         {getStatusBadge(row.status)}
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">
//                         {row.service || "No service set"}
//                       </p>
//                       <div className="flex items-center gap-4 text-xs text-gray-500">
//                         {row.baseDate && (
//                           <div className="flex items-center gap-1">
//                             <CalendarClock className="w-3 h-3" />
//                             <span>Started: {new Date(row.baseDate).toLocaleDateString()}</span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           <span>
//                             Expires:{" "}
//                             {row.expiryDate
//                               ? new Date(row.expiryDate).toLocaleDateString()
//                               : "Not set"}
//                           </span>
//                         </div>
//                         <span className="font-medium">
//                           Amount: ₹{row.amount || 0}
//                         </span>
//                         {!Number.isNaN(daysUntilExpiry) &&
//                           daysUntilExpiry <= 30 &&
//                           daysUntilExpiry > 0 && (
//                             <span className="text-yellow-600 font-medium">
//                               {daysUntilExpiry} days left
//                             </span>
//                           )}
//                         {!Number.isNaN(daysUntilExpiry) &&
//                           daysUntilExpiry <= 0 &&
//                           row.expiryDate && (
//                             <span className="text-red-600 font-medium">
//                               Expired {Math.abs(daysUntilExpiry)} days ago
//                             </span>
//                           )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => sendWhatsAppReminder(row.renewalId)}
//                       className="border-green-300 text-green-700 hover:bg-green-50"
//                     >
//                       <Send className="w-4 h-4 mr-1" />
//                       Send Reminder
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedRow(row);
//                         setIsRenewalDialogOpen(true);
//                       }}
//                     >
//                       {row.renewalId ? "Edit" : "Create"} Renewal
//                     </Button>
//                   </div>
//                 </div>
//               );
//             })}
//             {filteredRows.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                 <p className="text-lg font-medium mb-1">No renewals found</p>
//                 <p className="text-sm">
//                   {searchTerm || filterStatus !== "all"
//                     ? "Try adjusting your search or filters"
//                     : "Add your first renewal to get started"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Dialogs */}
//       <RenewalDialog
//         isOpen={isRenewalDialogOpen}
//         onClose={() => {
//           setIsRenewalDialogOpen(false);
//           setSelectedRow(null);
//         }}
//         renewal={
//           selectedRow?.renewalId
//             ? renewals.find((r) => r.id === selectedRow.renewalId) || null
//             : null
//         }
//         customerId={selectedRow?.customerId}
//         onSave={async (renewalData: any) => {
//           try {
//             if (selectedRow?.renewalId) {
//               await updateRenewal(selectedRow.renewalId, renewalData);
//             } else {
//               const payload = {
//                 ...renewalData,
//                 customerId: selectedRow?.customerId ?? renewalData.customerId,
//               };
//               await addRenewal(payload);
//             }
//           } finally {
//             setIsRenewalDialogOpen(false);
//             setSelectedRow(null);
//           }
//         }}
//       />

//       <WhatsAppSettingsDialog
//         isOpen={isSettingsDialogOpen}
//         onClose={() => setIsSettingsDialogOpen(false)}
//       />

//       <MessageTemplateDialog
//         isOpen={isTemplateDialogOpen}
//         onClose={() => setIsTemplateDialogOpen(false)}
//       />
//     </div>
//   );
// }


//testing 24-12-2025




"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCRM } from "@/contexts/crm-context";
import { RenewalDialog } from "./renewal-dialog";
import { WhatsAppSettingsDialog } from "./whatsapp-settings-dialog";
import { MessageTemplateDialog } from "./message-template-dialog";
import {
  MessageSquare,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Send,
  Search,
  Filter,
  Plus,
  CalendarClock,
  RefreshCcw,
} from "lucide-react";

type CustomerRenewalRow = {
  customerId: string;
  customerName: string;
  service: string;
  expiryDate: string | null;
  amount: number;
  status: string;
  renewalId: string | null;
  baseDate: string | null;
};

// Calculate status based on expiry date
const calculateRenewalStatus = (expiryDate: string | null): string => {
  if (!expiryDate) return "active";

  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 30) return "expiring";
  return "active";
};

export function RenewalsContent() {
  const { customers, renewals, addRenewal, updateRenewal } = useCRM();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CustomerRenewalRow | null>(
    null,
  );

  // Join customers + renewals
  const customerRenewals: CustomerRenewalRow[] = useMemo(
    () =>
      customers.map((c) => {
        const r = renewals.find((x) => x.customerId === c.id);

        const service =
          r?.service ??
          (c as any).recurringService ??
          (c as any).service ??
          "";

        // Prefer normalized expiryDate from context, then raw snake_case, then customer-level fields
        const rawExpiry =
          (r as any)?.expiryDate ??
          (r as any)?.expiry_date ??
          (c as any).nextRenewalDate ??
          null;

        const expiryDate = rawExpiry;

        const amount =
          typeof r?.amount === "number"
            ? r.amount
            : typeof (c as any).recurringAmount === "number"
            ? (c as any).recurringAmount
            : 0;

        const statusFromExpiry = calculateRenewalStatus(expiryDate);
        const status =
          r?.status === "renewed" ? "renewed" : statusFromExpiry;

        const baseDate =
          (r as any)?.baseDate ??
          (c.createdAt instanceof Date
            ? c.createdAt.toISOString()
            : (c as any).createdAt) ??
          null;

        return {
          customerId: c.id,
          customerName: c.name,
          service,
          expiryDate: expiryDate
            ? new Date(expiryDate as any).toISOString()
            : null,
          amount,
          status,
          renewalId: r?.id ?? null,
          baseDate,
        };
      }),
    [customers, renewals],
  );

  // Filter rows by search + status
  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return customerRenewals.filter((row) => {
      const matchesSearch =
        !term ||
        row.customerName.toLowerCase().includes(term) ||
        row.service.toLowerCase().includes(term);

      const matchesStatus =
        filterStatus === "all" ||
        row.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [customerRenewals, searchTerm, filterStatus]);

  // Stats
  const upcomingRenewals = customerRenewals.filter((row) => {
    if (!row.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(row.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;

  const expiredRenewals = customerRenewals.filter((row) => {
    if (!row.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(row.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 0;
  }).length;

  const renewedThisMonth =
    renewals.filter((r) => r.status === "renewed").length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "expiring":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case "renewed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Renewed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return NaN;
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  const sendWhatsAppReminder = (renewalId: string | null) => {
    if (!renewalId) {
      alert("Create a renewal record before sending reminders.");
      return;
    }
    alert(`WhatsApp reminder sent for renewal ${renewalId}`);
  };

  const handleMarkRenewed = async (row: CustomerRenewalRow) => {
    if (!row.renewalId) {
      alert("Create a renewal record before marking as renewed.");
      return;
    }
    await updateRenewal(row.renewalId, { status: "renewed" });
  };

  const handleMarkActive = async (row: CustomerRenewalRow) => {
    if (!row.renewalId) {
      alert("Create a renewal record before changing status.");
      return;
    }
    await updateRenewal(row.renewalId, { status: "active" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Renewal Management
          </h1>
          <p className="text-gray-600 mt-1">
            Automated tracking and WhatsApp reminders for expiring services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsSettingsDialogOpen(true)}
            className="border-gray-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            WhatsApp Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsTemplateDialogOpen(true)}
            className="border-gray-300"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Templates
          </Button>
          <Button
            onClick={() => {
              setSelectedRow(null);
              setIsRenewalDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Renewal
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Renewals
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {upcomingRenewals}
            </div>
            <p className="text-xs text-muted-foreground">
              Expiring in next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expired Services
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {expiredRenewals}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Renewed This Month
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {renewedThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully renewed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerRenewals.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Under renewal tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search renewals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "expiring" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("expiring")}
          >
            Expiring
          </Button>
          <Button
            variant={filterStatus === "expired" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("expired")}
          >
            Expired
          </Button>
          <Button
            variant={filterStatus === "renewed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("renewed")}
          >
            Renewed
          </Button>
        </div>
      </div>

      {/* Renewals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Renewals</CardTitle>
          <CardDescription>
            Manage and track all service renewals with automatic status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRows.map((row) => {
              const daysUntilExpiry = getDaysUntilExpiry(row.expiryDate);

              return (
                <div
                  key={row.customerId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {row.customerName}
                        </h3>
                        {getStatusBadge(row.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {row.service || "No service set"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {row.baseDate && (
                          <div className="flex items-center gap-1">
                            <CalendarClock className="w-3 h-3" />
                            <span>
                              Started:{" "}
                              {new Date(row.baseDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Expires:{" "}
                            {row.expiryDate
                              ? new Date(
                                  row.expiryDate,
                                ).toLocaleDateString()
                              : "Not set"}
                          </span>
                        </div>
                        <span className="font-medium">
                          Amount: ₹{row.amount || 0}
                        </span>
                        {!Number.isNaN(daysUntilExpiry) &&
                          daysUntilExpiry <= 30 &&
                          daysUntilExpiry > 0 && (
                            <span className="text-yellow-600 font-medium">
                              {daysUntilExpiry} days left
                            </span>
                          )}
                        {!Number.isNaN(daysUntilExpiry) &&
                          daysUntilExpiry <= 0 &&
                          row.expiryDate && (
                            <span className="text-red-600 font-medium">
                              Expired {Math.abs(daysUntilExpiry)} days ago
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendWhatsAppReminder(row.renewalId)}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send Reminder
                    </Button>

                    {row.status !== "renewed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkRenewed(row)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        disabled={!row.renewalId}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Renewed
                      </Button>
                    )}
                    {row.status === "renewed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkActive(row)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={!row.renewalId}
                      >
                        <RefreshCcw className="w-4 h-4 mr-1" />
                        Mark Active
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRow(row);
                        setIsRenewalDialogOpen(true);
                      }}
                    >
                      {row.renewalId ? "Edit" : "Create"} Renewal
                    </Button>
                  </div>
                </div>
              );
            })}
            {filteredRows.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-1">No renewals found</p>
                <p className="text-sm">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Add your first renewal to get started"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RenewalDialog
        isOpen={isRenewalDialogOpen}
        onClose={() => {
          setIsRenewalDialogOpen(false);
          setSelectedRow(null);
        }}
        renewal={
          selectedRow?.renewalId
            ? renewals.find((r) => r.id === selectedRow.renewalId) || null
            : null
        }
        customerId={selectedRow?.customerId}
        onSave={async (renewalData: any) => {
          try {
            if (selectedRow?.renewalId) {
              await updateRenewal(selectedRow.renewalId, renewalData);
            } else {
              const payload = {
                ...renewalData,
                customerId:
                  selectedRow?.customerId ?? renewalData.customerId,
              };
              await addRenewal(payload);
            }
          } finally {
            setIsRenewalDialogOpen(false);
            setSelectedRow(null);
          }
        }}
      />

      <WhatsAppSettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
      />

      <MessageTemplateDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
      />
    </div>
  );
}
