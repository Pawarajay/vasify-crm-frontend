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
//   RefreshCcw,
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
// const calculateRenewalStatus = (expiryDate: string | null): string => {
//   if (!expiryDate) return "active";

//   const expiry = new Date(expiryDate);
//   const today = new Date();
//   const daysUntilExpiry = Math.ceil(
//     (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
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
//   const [selectedRow, setSelectedRow] = useState<CustomerRenewalRow | null>(
//     null,
//   );

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

//         // Prefer normalized expiryDate from context, then raw snake_case, then customer-level fields
//         const rawExpiry =
//           (r as any)?.expiryDate ??
//           (r as any)?.expiry_date ??
//           (c as any).nextRenewalDate ??
//           null;

//         const expiryDate = rawExpiry;

//         const amount =
//           typeof r?.amount === "number"
//             ? r.amount
//             : typeof (c as any).recurringAmount === "number"
//             ? (c as any).recurringAmount
//             : 0;

//         const statusFromExpiry = calculateRenewalStatus(expiryDate);
//         const status =
//           r?.status === "renewed" ? "renewed" : statusFromExpiry;

//         const baseDate =
//           (r as any)?.baseDate ??
//           (c.createdAt instanceof Date
//             ? c.createdAt.toISOString()
//             : (c as any).createdAt) ??
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
//     [customers, renewals],
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

//   // Stats
//   const upcomingRenewals = customerRenewals.filter((row) => {
//     if (!row.expiryDate) return false;
//     const daysUntilExpiry = Math.ceil(
//       (new Date(row.expiryDate).getTime() - new Date().getTime()) /
//         (1000 * 60 * 60 * 24),
//     );
//     return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
//   }).length;

//   const expiredRenewals = customerRenewals.filter((row) => {
//     if (!row.expiryDate) return false;
//     const daysUntilExpiry = Math.ceil(
//       (new Date(row.expiryDate).getTime() - new Date().getTime()) /
//         (1000 * 60 * 60 * 24),
//     );
//     return daysUntilExpiry <= 0;
//   }).length;

//   const renewedThisMonth =
//     renewals.filter((r) => r.status === "renewed").length || 0;

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
//         (1000 * 60 * 60 * 24),
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

//   const handleMarkRenewed = async (row: CustomerRenewalRow) => {
//     if (!row.renewalId) {
//       alert("Create a renewal record before marking as renewed.");
//       return;
//     }
//     await updateRenewal(row.renewalId, { status: "renewed" });
//   };

//   const handleMarkActive = async (row: CustomerRenewalRow) => {
//     if (!row.renewalId) {
//       alert("Create a renewal record before changing status.");
//       return;
//     }
//     await updateRenewal(row.renewalId, { status: "active" });
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
//             <div className="text-2xl font-bold text-yellow-600">
//               {upcomingRenewals}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Expiring in next 30 days
//             </p>
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
//             <div className="text-2xl font-bold">
//               {customerRenewals.length}
//             </div>
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
//                         <h3 className="font-medium text-gray-900">
//                           {row.customerName}
//                         </h3>
//                         {getStatusBadge(row.status)}
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">
//                         {row.service || "No service set"}
//                       </p>
//                       <div className="flex items-center gap-4 text-xs text-gray-500">
//                         {row.baseDate && (
//                           <div className="flex items-center gap-1">
//                             <CalendarClock className="w-3 h-3" />
//                             <span>
//                               Started:{" "}
//                               {new Date(row.baseDate).toLocaleDateString()}
//                             </span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           <span>
//                             Expires:{" "}
//                             {row.expiryDate
//                               ? new Date(
//                                   row.expiryDate,
//                                 ).toLocaleDateString()
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

//                     {row.status !== "renewed" && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleMarkRenewed(row)}
//                         className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                         disabled={!row.renewalId}
//                       >
//                         <CheckCircle className="w-4 h-4 mr-1" />
//                         Mark Renewed
//                       </Button>
//                     )}
//                     {row.status === "renewed" && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleMarkActive(row)}
//                         className="border-gray-300 text-gray-700 hover:bg-gray-50"
//                         disabled={!row.renewalId}
//                       >
//                         <RefreshCcw className="w-4 h-4 mr-1" />
//                         Mark Active
//                       </Button>
//                     )}

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
//                 customerId:
//                   selectedRow?.customerId ?? renewalData.customerId,
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

//31-12-2025
//testing 

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

// Safely add months to a date string
const addMonths = (dateStr: string, months: number): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d.toISOString().slice(0, 10);
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

  // Statistics cards

  // Upcoming renewals (same logic, but with safe date parse)
  const upcomingRenewals = customerRenewals.filter((row) => {
    if (!row.expiryDate) return false;
    const d = new Date(row.expiryDate);
    if (Number.isNaN(d.getTime())) return false;
    const daysUntilExpiry = Math.ceil(
      (d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;

  // ✅ FIXED: Expired services with safe date handling
  const expiredRenewals = customerRenewals.filter((row) => {
    if (!row.expiryDate) return false;
    const d = new Date(row.expiryDate);
    if (Number.isNaN(d.getTime())) return false;
    const daysUntilExpiry = Math.ceil(
      (d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 0;
  }).length;

  // ✅ FIXED: Renewed this month (status + current month/year)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const renewedThisMonth =
    renewals.filter((r) => {
      if (r.status !== "renewed") return false;

      const raw =
        (r as any).updatedAt ??
        (r as any).updated_at ??
        (r as any).expiryDate ??
        (r as any).expiry_date;

      if (!raw) return false;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return false;

      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }).length || 0;

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
    const d = new Date(expiryDate);
    if (Number.isNaN(d.getTime())) return NaN;
    const days = Math.ceil(
      (d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
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

  // Save handler with expiry auto-calc
  const handleRenewalSave = async (renewalData: any) => {
    try {
      const finalData = {
        ...renewalData,
        customerId: selectedRow?.customerId ?? renewalData.customerId,
      };

      if (!finalData.expiryDate || finalData.expiryDate === "Expiry Not Set") {
        const baseDate =
          finalData.baseDate ||
          selectedRow?.baseDate ||
          new Date().toISOString().slice(0, 10);
        const intervalMonths = finalData.intervalMonths || 1;
        finalData.expiryDate = addMonths(baseDate, intervalMonths);
      }

      if (selectedRow?.renewalId) {
        await updateRenewal(selectedRow.renewalId, finalData);
      } else {
        await addRenewal(finalData);
      }
    } finally {
      setIsRenewalDialogOpen(false);
      setSelectedRow(null);
    }
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
        onSave={handleRenewalSave}
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

// //testing 2 For ui
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
//   Plus,
//   CalendarClock,
//   RefreshCcw,
//   Sparkles,
//   ArrowUpRight,
//   IndianRupee,  // ← Added this import to fix the error
// } from "lucide-react"

// type CustomerRenewalRow = {
//   customerId: string
//   customerName: string
//   service: string
//   expiryDate: string | null
//   amount: number
//   status: string
//   renewalId: string | null
//   baseDate: string | null
// }

// const addMonths = (dateStr: string, months: number): string => {
//   const d = new Date(dateStr)
//   if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
//   const day = d.getDate()
//   d.setMonth(d.getMonth() + months)
//   if (d.getDate() < day) d.setDate(0)
//   return d.toISOString().slice(0, 10)
// }

// const calculateRenewalStatus = (expiryDate: string | null): string => {
//   if (!expiryDate) return "active"
//   const expiry = new Date(expiryDate)
//   const today = new Date()
//   const daysUntilExpiry = Math.ceil(
//     (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
//   )
//   if (daysUntilExpiry < 0) return "expired"
//   if (daysUntilExpiry <= 30) return "expiring"
//   return "active"
// }

// const getStatusConfig = (status: string) => {
//   switch (status) {
//     case "active":
//       return {
//         bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30",
//         text: "text-emerald-700 dark:text-emerald-400",
//         border: "border-emerald-200/50 dark:border-emerald-900/50",
//         icon: <CheckCircle className="h-3 w-3" />,
//       }
//     case "expiring":
//       return {
//         bg: "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30",
//         text: "text-amber-700 dark:text-amber-400",
//         border: "border-amber-200/50 dark:border-amber-900/50",
//         icon: <Clock className="h-3 w-3" />,
//       }
//     case "expired":
//       return {
//         bg: "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/50 dark:to-rose-900/30",
//         text: "text-rose-700 dark:text-rose-400",
//         border: "border-rose-200/50 dark:border-rose-900/50",
//         icon: <AlertTriangle className="h-3 w-3" />,
//       }
//     case "renewed":
//       return {
//         bg: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30",
//         text: "text-blue-700 dark:text-blue-400",
//         border: "border-blue-200/50 dark:border-blue-900/50",
//         icon: <CheckCircle className="h-3 w-3" />,
//       }
//     default:
//       return {
//         bg: "bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30",
//         text: "text-slate-700 dark:text-slate-300",
//         border: "border-slate-200/50 dark:border-slate-700/50",
//         icon: <CheckCircle className="h-3 w-3" />,
//       }
//   }
// }

// export function RenewalsContent() {
//   const { customers, renewals, addRenewal, updateRenewal } = useCRM()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false)
//   const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
//   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
//   const [selectedRow, setSelectedRow] = useState<CustomerRenewalRow | null>(null)

//   const customerRenewals: CustomerRenewalRow[] = useMemo(
//     () =>
//       customers.map((c) => {
//         const r = renewals.find((x) => x.customerId === c.id)
//         const service =
//           r?.service ??
//           (c as any).recurringService ??
//           (c as any).service ??
//           ""
//         const rawExpiry =
//           (r as any)?.expiryDate ??
//           (r as any)?.expiry_date ??
//           (c as any).nextRenewalDate ??
//           null
//         const expiryDate = rawExpiry
//         const amount =
//           typeof r?.amount === "number"
//             ? r.amount
//             : typeof (c as any).recurringAmount === "number"
//             ? (c as any).recurringAmount
//             : 0
//         const statusFromExpiry = calculateRenewalStatus(expiryDate)
//         const status = r?.status === "renewed" ? "renewed" : statusFromExpiry
//         const baseDate =
//           (r as any)?.baseDate ??
//           (c.createdAt instanceof Date ? c.createdAt.toISOString() : (c as any).createdAt) ??
//           null

//         return {
//           customerId: c.id,
//           customerName: c.name,
//           service,
//           expiryDate: expiryDate ? new Date(expiryDate as any).toISOString() : null,
//           amount,
//           status,
//           renewalId: r?.id ?? null,
//           baseDate,
//         }
//       }),
//     [customers, renewals],
//   )

//   const filteredRows = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase()
//     return customerRenewals.filter((row) => {
//       const matchesSearch =
//         !term ||
//         row.customerName.toLowerCase().includes(term) ||
//         row.service.toLowerCase().includes(term)
//       const matchesStatus =
//         filterStatus === "all" ||
//         row.status.toLowerCase() === filterStatus.toLowerCase()
//       return matchesSearch && matchesStatus
//     })
//   }, [customerRenewals, searchTerm, filterStatus])

//   const upcomingRenewals = customerRenewals.filter((row) => {
//     if (!row.expiryDate) return false
//     const d = new Date(row.expiryDate)
//     if (isNaN(d.getTime())) return false
//     const daysUntilExpiry = Math.ceil(
//       (d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
//     )
//     return daysUntilExpiry <= 30 && daysUntilExpiry > 0
//   }).length

//   const expiredRenewals = customerRenewals.filter((row) => {
//     if (!row.expiryDate) return false
//     const d = new Date(row.expiryDate)
//     if (isNaN(d.getTime())) return false
//     const daysUntilExpiry = Math.ceil(
//       (d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
//     )
//     return daysUntilExpiry <= 0
//   }).length

//   const renewedThisMonth = renewals.filter((r) => {
//     if (r.status !== "renewed") return false
//     const raw =
//       (r as any).updatedAt ??
//       (r as any).updated_at ??
//       (r as any).expiryDate ??
//       (r as any).expiry_date
//     if (!raw) return false
//     const d = new Date(raw)
//     if (isNaN(d.getTime())) return false
//     const now = new Date()
//     return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
//   }).length

//   const getDaysUntilExpiry = (expiryDate: string | null) => {
//     if (!expiryDate) return NaN
//     const d = new Date(expiryDate)
//     if (isNaN(d.getTime())) return NaN
//     return Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
//   }

//   const sendWhatsAppReminder = (renewalId: string | null) => {
//     if (!renewalId) {
//       alert("Create a renewal record before sending reminders.")
//       return
//     }
//     alert(`WhatsApp reminder sent for renewal ${renewalId}`)
//   }

//   const handleMarkRenewed = async (row: CustomerRenewalRow) => {
//     if (!row.renewalId) {
//       alert("Create a renewal record before marking as renewed.")
//       return
//     }
//     await updateRenewal(row.renewalId, { status: "renewed" })
//   }

//   const handleMarkActive = async (row: CustomerRenewalRow) => {
//     if (!row.renewalId) {
//       alert("Create a renewal record before changing status.")
//       return
//     }
//     await updateRenewal(row.renewalId, { status: "active" })
//   }

//   const handleRenewalSave = async (renewalData: any) => {
//     try {
//       const finalData = {
//         ...renewalData,
//         customerId: selectedRow?.customerId ?? renewalData.customerId,
//       }
//       if (!finalData.expiryDate || finalData.expiryDate === "Expiry Not Set") {
//         const baseDate =
//           finalData.baseDate ||
//           selectedRow?.baseDate ||
//           new Date().toISOString().slice(0, 10)
//         const intervalMonths = finalData.intervalMonths || 1
//         finalData.expiryDate = addMonths(baseDate, intervalMonths)
//       }
//       if (selectedRow?.renewalId) {
//         await updateRenewal(selectedRow.renewalId, finalData)
//       } else {
//         await addRenewal(finalData)
//       }
//     } finally {
//       setIsRenewalDialogOpen(false)
//       setSelectedRow(null)
//     }
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
//                   Live Tracking
//                 </span>
//               </div>
//               <div>
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
//                   Renewals
//                 </h1>
//                 <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
//                   Automated tracking and WhatsApp reminders for expiring services
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsSettingsDialogOpen(true)}
//                 className="border-slate-200 dark:border-slate-700"
//               >
//                 <Settings className="w-4 h-4 mr-2" />
//                 WhatsApp Settings
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsTemplateDialogOpen(true)}
//                 className="border-slate-200 dark:border-slate-700"
//               >
//                 <MessageSquare className="w-4 h-4 mr-2" />
//                 Message Templates
//               </Button>
//               <Button
//                 onClick={() => {
//                   setSelectedRow(null)
//                   setIsRenewalDialogOpen(true)
//                 }}
//                 className="h-11 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Renewal
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Premium Stats Cards */}
//         <div className="flex items-center gap-2 mb-6">
//           <Sparkles className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             Renewal Overview
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-10 sm:mb-12">
//           {/* Upcoming Renewals */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/50 dark:to-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <Clock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
//                 </div>
//                 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
//                   <ArrowUpRight className="h-3.5 w-3.5" />
//                   <span>+12.5%</span>
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Upcoming Renewals
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
//                 {upcomingRenewals}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
//                 Expiring in next 30 days
//               </p>
//             </CardContent>
//           </Card>

//           {/* Expired Services */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-rose-50/50 dark:to-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-400/5 to-pink-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Expired Services
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
//                 {expiredRenewals}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
//                 Require immediate attention
//               </p>
//             </CardContent>
//           </Card>

//           {/* Renewed This Month */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-50/50 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Renewed This Month
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
//                 {renewedThisMonth}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
//                 Successfully renewed
//               </p>
//             </CardContent>
//           </Card>

//           {/* Total Customers */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-cyan-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <Calendar className="h-7 w-7 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Total Customers
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
//                 {customerRenewals.length}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
//                 Under renewal tracking
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search & Filter */}
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
//                   placeholder="Search by customer or service..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 bg-white dark:bg-slate-900"
//                 />
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {["all", "active", "expiring", "expired", "renewed"].map((status) => (
//                   <Button
//                     key={status}
//                     variant={filterStatus === status ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setFilterStatus(status)}
//                     className="border-slate-200 dark:border-slate-700"
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Renewals List */}
//         <div className="flex items-center gap-2 mb-6 mt-8">
//           <CalendarClock className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             All Renewals ({filteredRows.length})
//           </h2>
//         </div>

//         <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
//           <CardContent className="p-0">
//             <div className="space-y-4 p-6">
//               {filteredRows.map((row) => {
//                 const daysUntilExpiry = getDaysUntilExpiry(row.expiryDate)
//                 const statusConfig = getStatusConfig(row.status)

//                 return (
//                   <div
//                     key={row.customerId}
//                     className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-md transition-all duration-300"
//                   >
//                     <div className="flex-1 mb-4 sm:mb-0">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
//                           {row.customerName}
//                         </h3>
//                         <Badge
//                           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shadow-sm ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
//                         >
//                           {statusConfig.icon}
//                           {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
//                         {row.service || "No service set"}
//                       </p>
//                       <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
//                         {row.baseDate && (
//                           <div className="flex items-center gap-1.5">
//                             <CalendarClock className="h-4 w-4" />
//                             <span>
//                               Started: {new Date(row.baseDate).toLocaleDateString()}
//                             </span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-1.5">
//                           <Calendar className="h-4 w-4" />
//                           <span>
//                             Expires:{" "}
//                             {row.expiryDate
//                               ? new Date(row.expiryDate).toLocaleDateString()
//                               : "Not set"}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1.5 font-medium">
//                           <IndianRupee className="h-4 w-4" />
//                           <span>₹{row.amount.toLocaleString("en-IN")}</span>
//                         </div>
//                         {!isNaN(daysUntilExpiry) && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
//                           <span className="text-amber-600 dark:text-amber-400 font-medium">
//                             {daysUntilExpiry} days left
//                           </span>
//                         )}
//                         {!isNaN(daysUntilExpiry) && daysUntilExpiry <= 0 && row.expiryDate && (
//                           <span className="text-rose-600 dark:text-rose-400 font-medium">
//                             Expired {Math.abs(daysUntilExpiry)} days ago
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => sendWhatsAppReminder(row.renewalId)}
//                         className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
//                       >
//                         <Send className="h-4 w-4 mr-2" />
//                         Send Reminder
//                       </Button>

//                       {row.status !== "renewed" && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleMarkRenewed(row)}
//                           className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
//                           disabled={!row.renewalId}
//                         >
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Mark Renewed
//                         </Button>
//                       )}

//                       {row.status === "renewed" && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleMarkActive(row)}
//                           className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                           disabled={!row.renewalId}
//                         >
//                           <RefreshCcw className="h-4 w-4 mr-2" />
//                           Mark Active
//                         </Button>
//                       )}

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedRow(row)
//                           setIsRenewalDialogOpen(true)
//                         }}
//                         className="border-slate-200 dark:border-slate-700"
//                       >
//                         {row.renewalId ? "Edit" : "Create"} Renewal
//                       </Button>
//                     </div>
//                   </div>
//                 )
//               })}

//               {filteredRows.length === 0 && (
//                 <div className="text-center py-16">
//                   <CalendarClock className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
//                   <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
//                     No renewals found
//                   </p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">
//                     {searchTerm || filterStatus !== "all"
//                       ? "Try adjusting your search or filters"
//                       : "Add your first renewal to get started"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Dialogs */}
//         <RenewalDialog
//           isOpen={isRenewalDialogOpen}
//           onClose={() => {
//             setIsRenewalDialogOpen(false)
//             setSelectedRow(null)
//           }}
//           renewal={
//             selectedRow?.renewalId
//               ? renewals.find((r) => r.id === selectedRow.renewalId) || null
//               : null
//           }
//           customerId={selectedRow?.customerId}
//           onSave={handleRenewalSave}
//         />

//         <WhatsAppSettingsDialog
//           isOpen={isSettingsDialogOpen}
//           onClose={() => setIsSettingsDialogOpen(false)}
//         />

//         <MessageTemplateDialog
//           isOpen={isTemplateDialogOpen}
//           onClose={() => setIsTemplateDialogOpen(false)}
//         />
//       </div>
//     </div>
//   )
// }