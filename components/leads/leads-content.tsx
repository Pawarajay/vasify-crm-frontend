//testing 2 

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useCRM } from "@/contexts/crm-context";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { LeadDialog } from "./lead-dialog";
// import { LeadDetailDialog } from "./lead-detail-dialog";
// import { ConvertLeadDialog } from "./convert-lead-dialog";
// import {
//   Plus,
//   Search,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Eye,
//   Phone,
//   Mail,
//   UserCheck,
//   Users,
//   UserPlus,
// } from "lucide-react";
// import type { Lead } from "@/types/crm";

// const formatDate = (value: unknown) => {
//   if (!value) return "—";
//   const date = value instanceof Date ? value : new Date(value as string);
//   if (Number.isNaN(date.getTime())) return "—";
//   return date.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// type LeadViewMode = "table" | "kanban";

// const statusColumns: { id: Lead["status"]; label: string }[] = [
//   { id: "new", label: "New" },
//   { id: "contacted", label: "Contacted" },
//   { id: "qualified", label: "Qualified" },
//   { id: "proposal", label: "Proposal" },
//   { id: "negotiation", label: "Negotiation" },
//   { id: "closed-won", label: "Closed Won" },
//   { id: "closed-lost", label: "Closed Lost" },
// ];

// export function LeadsContent() {
//   const {
//     leads,
//     deleteLead,
//     users,
//     currentUser,
//     leadFilters,
//     setLeadFilters,
//     refreshLeads,
//   } = useCRM();

//   const safeUsers = Array.isArray(users) ? users : [];
//   const isAdmin = currentUser?.role === "admin";

//   console.log("Current User:", currentUser);
//   console.log("Is Admin:", isAdmin);
//   console.log("Available Users:", safeUsers);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>(
//     leadFilters.status ?? "all",
//   );
//   const [priorityFilter, setPriorityFilter] = useState<string>(
//     leadFilters.priority ?? "all",
//   );
//   const [serviceFilter, setServiceFilter] = useState<string>(
//     leadFilters.service ?? "all",
//   );
//   const [createdByFilter, setCreatedByFilter] = useState<string>(
//     leadFilters.createdBy ?? "all",
//   );
//   const [assignedToFilter, setAssignedToFilter] = useState<string>(
//     leadFilters.assignedTo ?? "all",
//   );

//   const [viewMode, setViewMode] = useState<LeadViewMode>("table");
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
//   const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);

//   const normalizedSearch = searchTerm.trim().toLowerCase();

//   useEffect(() => {
//     const normalizedAssignedTo =
//       isAdmin && assignedToFilter !== "all"
//         ? assignedToFilter
//         : undefined;

//     const normalizedCreatedBy =
//       isAdmin && createdByFilter !== "all"
//         ? createdByFilter
//         : undefined;

//     const next = {
//       status: statusFilter !== "all" ? statusFilter : undefined,
//       priority: priorityFilter !== "all" ? priorityFilter : undefined,
//       service: serviceFilter !== "all" ? serviceFilter : undefined,
//       assignedTo: normalizedAssignedTo,
//       createdBy: normalizedCreatedBy,
//     };

//     if (
//       next.status === leadFilters.status &&
//       next.priority === leadFilters.priority &&
//       next.service === leadFilters.service &&
//       (next.assignedTo ?? "all") === (leadFilters.assignedTo ?? "all") &&
//       (next.createdBy ?? "all") === (leadFilters.createdBy ?? "all")
//     ) {
//       return;
//     }

//     console.log("Applying filters:", next);
//     setLeadFilters(next);
//     void refreshLeads();
//   }, [
//     statusFilter,
//     priorityFilter,
//     serviceFilter,
//     createdByFilter,
//     assignedToFilter,
//     isAdmin,
//     leadFilters.status,
//     leadFilters.priority,
//     leadFilters.service,
//     leadFilters.assignedTo,
//     leadFilters.createdBy,
//     setLeadFilters,
//     refreshLeads,
//   ]);

//   const getCreatorName = (lead: Lead) => {
//     if ((lead as any).created_user_name) {
//       return (lead as any).created_user_name as string;
//     }

//     const creatorId =
//       (lead as any).createdBy ?? (lead as any).created_by ?? null;
//     if (!creatorId) return "Unknown";

//     const user = safeUsers.find((u) => String(u.id) === String(creatorId));
//     return user?.name || "Unknown";
//   };

//   const getAssignedToName = (lead: Lead) => {
//     if ((lead as any).assigned_user_name) {
//       return (lead as any).assigned_user_name as string;
//     }

//     const assignedId = (lead as any).assignedTo ?? (lead as any).assigned_to ?? null;
//     if (!assignedId) return "Unassigned";

//     const user = safeUsers.find((u) => String(u.id) === String(assignedId));
//     return user?.name || "Unknown";
//   };

//   const filteredLeads = useMemo(
//     () =>
//       leads.filter((lead) => {
//         const matchesSearch =
//           !normalizedSearch ||
//           (lead.name?.toLowerCase() ?? "").includes(normalizedSearch) ||
//           (lead.email?.toLowerCase() ?? "").includes(normalizedSearch) ||
//           (lead.company?.toLowerCase() ?? "").includes(normalizedSearch) ||
//           (lead.phone ?? "").includes(searchTerm);

//         return matchesSearch;
//       }),
//     [leads, normalizedSearch, searchTerm],
//   );

//   const visibleLeads = useMemo(
//     () =>
//       filteredLeads.filter(
//         (lead) =>
//           !(lead.status === "closed-won" && (lead as any).isConverted),
//       ),
//     [filteredLeads],
//   );

//   const handleEdit = (lead: Lead) => {
//     setSelectedLead(lead);
//     setIsEditDialogOpen(true);
//   };

//   const handleDelete = async (leadId: string) => {
//     if (window.confirm("Are you sure you want to delete this lead?")) {
//       void deleteLead(leadId);
//     }
//   };

//   const handleViewDetails = (lead: Lead) => {
//     setSelectedLead(lead);
//     setIsDetailDialogOpen(true);
//   };

//   const handleConvert = (lead: Lead) => {
//     setSelectedLead(lead);
//     setIsConvertDialogOpen(true);
//   };

//   const handleCallLead = (lead: Lead) => {
//     if (!lead.phone) return;
//     window.open(`tel:${lead.phone}`, "_self");
//   };

//   const handleEmailLead = (lead: Lead) => {
//     if (!lead.email) return;
//     window.location.href = `mailto:${lead.email}`;
//   };

//   const handleWhatsAppLead = (lead: Lead) => {
//     const number = lead.whatsappNumber || lead.phone;
//     if (!number) return;
//     const text = encodeURIComponent(
//       "Hi, I'd like to follow up regarding our discussion.",
//     );
//     window.open(
//       `https://wa.me/${number}?text=${text}`,
//       "_blank",
//       "noopener,noreferrer",
//     );
//   };

//   const handleScheduleMeeting = (lead: Lead) => {
//     console.log("Schedule meeting for lead:", lead.id);
//   };

//   const handleCreateDeal = (lead: Lead) => {
//     console.log("Create deal from lead:", lead.id);
//   };

//   const getStatusBadge = (status: Lead["status"]) => {
//     const variants: Record<Lead["status"], string> = {
//       new: "bg-blue-100 text-blue-800 hover:bg-blue-100",
//       contacted: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
//       qualified: "bg-green-100 text-green-800 hover:bg-green-100",
//       proposal: "bg-purple-100 text-purple-800 hover:bg-purple-100",
//       negotiation: "bg-orange-100 text-orange-800 hover:bg-orange-100",
//       "closed-won": "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
//       "closed-lost": "bg-red-100 text-red-800 hover:bg-red-100",
//     };
//     return variants[status] ?? variants.new;
//   };

//   const getPriorityBadge = (priority: Lead["priority"]) => {
//     const variants: Record<Lead["priority"], string> = {
//       low: "bg-gray-100 text-gray-800 hover:bg-gray-100",
//       medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
//       high: "bg-red-100 text-red-800 hover:bg-red-100",
//     };
//     return variants[priority] ?? variants.medium;
//   };

//   const stats = useMemo(() => {
//     const total = leads.length;
//     const byStatus = {
//       new: leads.filter((l) => l.status === "new").length,
//       qualified: leads.filter((l) => l.status === "qualified").length,
//       won: leads.filter((l) => l.status === "closed-won").length,
//     };
//     const totalValue = leads.reduce(
//       (sum, lead) =>
//         sum +
//         (typeof lead.estimatedValue === "number"
//           ? lead.estimatedValue
//           : Number(lead.estimatedValue ?? 0) || 0),
//       0,
//     );

//     return {
//       total,
//       new: byStatus.new,
//       qualified: byStatus.qualified,
//       won: byStatus.won,
//       totalValue,
//     };
//   }, [leads]);

//   const groupedByStatus = useMemo(() => {
//     const map: Record<Lead["status"], Lead[]> = {
//       new: [],
//       contacted: [],
//       qualified: [],
//       proposal: [],
//       negotiation: [],
//       "closed-won": [],
//       "closed-lost": [],
//     };
//     visibleLeads.forEach((lead) => {
//       map[lead.status]?.push(lead);
//     });
//     return map;
//   }, [visibleLeads]);

//   const renderLeadCard = (lead: Lead) => {
//     const valueNumber =
//       typeof lead.estimatedValue === "number"
//         ? lead.estimatedValue
//         : Number(lead.estimatedValue ?? 0);

//     return (
//       <Card
//         key={lead.id}
//         className="mb-3 cursor-pointer hover:border-primary/60"
//         onDoubleClick={() => handleViewDetails(lead)}
//       >
//         <CardContent className="p-3 space-y-2">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="font-medium">{lead.name}</div>
//               <div className="text-xs text-muted-foreground">
//                 {lead.company || "—"}
//               </div>
//             </div>
//             <Badge className={getPriorityBadge(lead.priority)}>
//               {lead.priority}
//             </Badge>
//           </div>
//           {lead.service && (
//             <div className="text-xs capitalize text-muted-foreground">
//               Service: {lead.service.replace(/-/g, " ")}
//             </div>
//           )}
//           <div className="flex items-center justify-between text-xs">
//             <span>
//               Value:{" "}
//               {valueNumber ? `₹${valueNumber.toLocaleString()}` : "—"}
//             </span>
//             <span>
//               Close:{" "}
//               {lead.expectedCloseDate
//                 ? formatDate(lead.expectedCloseDate)
//                 : "—"}
//             </span>
//           </div>
//           <div className="text-xs text-muted-foreground">
//             Created by: {getCreatorName(lead)}
//           </div>
//           {isAdmin && (
//             <div className="text-xs text-muted-foreground">
//               Assigned to: {getAssignedToName(lead)}
//             </div>
//           )}
//           <div className="flex justify-end">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   className="h-7 w-7 p-0"
//                   aria-label="Open actions"
//                 >
//                   <MoreHorizontal className="h-3 w-3" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
//                   <Eye className="mr-2 h-4 w-4" />
//                   View Details
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleEdit(lead)}>
//                   <Edit className="mr-2 h-4 w-4" />
//                   Edit
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() =>
//                     lead.status === "closed-won" && handleConvert(lead)
//                   }
//                   disabled={lead.status !== "closed-won"}
//                 >
//                   <UserCheck className="mr-2 h-4 w-4" />
//                   Convert to Customer
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => handleCallLead(lead)}>
//                   <Phone className="mr-2 h-4 w-4" />
//                   Call
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleEmailLead(lead)}>
//                   <Mail className="mr-2 h-4 w-4" />
//                   Email
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => handleDelete(lead.id)}
//                   className="text-destructive"
//                 >
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Delete
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold font-serif">Leads</h1>
//           <p className="text-muted-foreground">
//             Manage and track your sales leads
//           </p>
//         </div>
//         <Button onClick={() => setIsAddDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Lead
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold">{stats.total}</div>
//             <p className="text-xs text-muted-foreground">Total Leads</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-blue-600">
//               {stats.new}
//             </div>
//             <p className="text-xs text-muted-foreground">New Leads</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-green-600">
//               {stats.qualified}
//             </div>
//             <p className="text-xs text-muted-foreground">Qualified</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-emerald-600">
//               {stats.won}
//             </div>
//             <p className="text-xs text-muted-foreground">Closed Won</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold">
//               ₹{stats.totalValue.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">Total Value</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Lead Pipeline</CardTitle>
//           <CardDescription>Track and manage your sales leads</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap items-center gap-4 mb-6">
//             <div className="relative flex-1 min-w-[220px] max-w-sm">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Search leads..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-36">
//                 <SelectValue placeholder="All Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="new">New</SelectItem>
//                 <SelectItem value="contacted">Contacted</SelectItem>
//                 <SelectItem value="qualified">Qualified</SelectItem>
//                 <SelectItem value="proposal">Proposal</SelectItem>
//                 <SelectItem value="negotiation">Negotiation</SelectItem>
//                 <SelectItem value="closed-won">Closed Won</SelectItem>
//                 <SelectItem value="closed-lost">Closed Lost</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={priorityFilter} onValueChange={setPriorityFilter}>
//               <SelectTrigger className="w-32">
//                 <SelectValue placeholder="All Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Priority</SelectItem>
//                 <SelectItem value="high">High</SelectItem>
//                 <SelectItem value="medium">Medium</SelectItem>
//                 <SelectItem value="low">Low</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={serviceFilter} onValueChange={setServiceFilter}>
//               <SelectTrigger className="w-44">
//                 <SelectValue placeholder="All Services" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Services</SelectItem>
//                 <SelectItem value="whatsapp-business-api">
//                   WhatsApp Business API
//                 </SelectItem>
//                 <SelectItem value="website-development">
//                   Website Development
//                 </SelectItem>
//                 <SelectItem value="ai-agent">AI Agent</SelectItem>
//                 <SelectItem value="other">Other</SelectItem>
//               </SelectContent>
//             </Select>

//             {isAdmin && (
//               <Select
//                 value={createdByFilter}
//                 onValueChange={setCreatedByFilter}
//               >
//                 <SelectTrigger className="w-48">
//                   <SelectValue placeholder="Filter by Creator">
//                     {createdByFilter === "all" ? (
//                       <span className="flex items-center gap-2">
//                         <UserPlus className="h-4 w-4" />
//                         All Creators
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         <UserPlus className="h-4 w-4" />
//                         {safeUsers.find(u => String(u.id) === createdByFilter)?.name || "Creator"}
//                       </span>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     <span className="flex items-center gap-2">
//                       <UserPlus className="h-4 w-4" />
//                       All Creators
//                     </span>
//                   </SelectItem>
//                   {safeUsers.map((user) => (
//                     <SelectItem key={user.id} value={String(user.id)}>
//                       {user.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}

//             {isAdmin && (
//               <Select
//                 value={assignedToFilter}
//                 onValueChange={setAssignedToFilter}
//               >
//                 <SelectTrigger className="w-48">
//                   <SelectValue placeholder="Filter by Owner">
//                     {assignedToFilter === "all" ? (
//                       <span className="flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         All Owners
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         {safeUsers.find(u => String(u.id) === assignedToFilter)?.name || "Owner"}
//                       </span>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     <span className="flex items-center gap-2">
//                       <Users className="h-4 w-4" />
//                       All Owners
//                     </span>
//                   </SelectItem>
//                   {safeUsers.map((user) => (
//                     <SelectItem key={user.id} value={String(user.id)}>
//                       {user.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}

//             <div className="flex items-center gap-2 ml-auto">
//               <span className="text-xs text-muted-foreground">View:</span>
//               <Button
//                 type="button"
//                 variant={viewMode === "table" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("table")}
//               >
//                 Table
//               </Button>
//               <Button
//                 type="button"
//                 variant={viewMode === "kanban" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("kanban")}
//               >
//                 Kanban
//               </Button>
//             </div>

//             <div className="text-sm text-muted-foreground">
//               {visibleLeads.length} of {leads.length} leads
//             </div>
//           </div>

//           {viewMode === "table" ? (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Lead</TableHead>
//                     <TableHead>Company</TableHead>
//                     <TableHead>Contact</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Priority</TableHead>
//                     <TableHead>Service</TableHead>
//                     <TableHead>Value</TableHead>
//                     <TableHead>Expected Close</TableHead>
//                     <TableHead>Created By</TableHead>
//                     {isAdmin && <TableHead>Assigned To</TableHead>}
//                     <TableHead className="w-[70px]">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {visibleLeads.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={isAdmin ? 11 : 10}
//                         className="text-center py-8 text-muted-foreground"
//                       >
//                         {searchTerm ||
//                         statusFilter !== "all" ||
//                         priorityFilter !== "all" ||
//                         serviceFilter !== "all" ||
//                         createdByFilter !== "all" ||
//                         assignedToFilter !== "all"
//                           ? "No leads found matching your filters."
//                           : "No leads yet. Add your first lead!"}
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     visibleLeads.map((lead) => {
//                       const valueNumber =
//                         typeof lead.estimatedValue === "number"
//                           ? lead.estimatedValue
//                           : Number(lead.estimatedValue ?? 0);

//                       return (
//                         <TableRow
//                           key={lead.id}
//                           className="hover:bg-muted/50 cursor-pointer"
//                           onDoubleClick={() => handleViewDetails(lead)}
//                         >
//                           <TableCell>
//                             <div className="flex items-center space-x-3">
//                               <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                                 <span className="text-sm font-medium text-primary">
//                                   {lead.name?.charAt(0) ?? "L"}
//                                 </span>
//                               </div>
//                               <div>
//                                 <div className="font-medium">{lead.name}</div>
//                                 <div className="text-sm text-muted-foreground">
//                                   {lead.email}
//                                 </div>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="font-medium">
//                               {lead.company || "—"}
//                             </div>
//                             <div className="text-sm text-muted-foreground capitalize">
//                               {lead.source}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center space-x-2">
//                               <Phone className="h-3 w-3 text-muted-foreground" />
//                               <span className="text-sm">
//                                 {lead.phone || "No phone"}
//                               </span>
//                             </div>
//                             {lead.whatsappNumber && (
//                               <div className="flex items-center space-x-2 mt-1">
//                                 <Mail className="h-3 w-3 text-muted-foreground" />
//                                 <span className="text-sm text-green-600">
//                                   WhatsApp
//                                 </span>
//                               </div>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <Badge className={getStatusBadge(lead.status)}>
//                               {lead.status.replace("-", " ")}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <Badge className={getPriorityBadge(lead.priority)}>
//                               {lead.priority}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             {lead.service ? (
//                               <span className="text-xs capitalize">
//                                 {lead.service.replace(/-/g, " ")}
//                               </span>
//                             ) : (
//                               "—"
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <div className="font-medium">
//                               {valueNumber
//                                 ? `₹${valueNumber.toLocaleString()}`
//                                 : "—"}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="text-sm">
//                               {lead.expectedCloseDate
//                                 ? formatDate(lead.expectedCloseDate)
//                                 : "—"}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="text-sm">{getCreatorName(lead)}</div>
//                           </TableCell>
//                           {isAdmin && (
//                             <TableCell>
//                               <div className="text-sm">
//                                 {getAssignedToName(lead)}
//                               </div>
//                             </TableCell>
//                           )}
//                           <TableCell onClick={(e) => e.stopPropagation()}>
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   className="h-8 w-8 p-0"
//                                   aria-label="Open actions"
//                                 >
//                                   <MoreHorizontal className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                 <DropdownMenuItem
//                                   onClick={() => handleViewDetails(lead)}
//                                 >
//                                   <Eye className="mr-2 h-4 w-4" />
//                                   View Details
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => handleEdit(lead)}>
//                                   <Edit className="mr-2 h-4 w-4" />
//                                   Edit
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem
//                                   onClick={() =>
//                                     lead.status === "closed-won" &&
//                                     handleConvert(lead)
//                                   }
//                                   disabled={lead.status !== "closed-won"}
//                                 >
//                                   <UserCheck className="mr-2 h-4 w-4" />
//                                   Convert to Customer
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem
//                                   onClick={() => handleCallLead(lead)}
//                                 >
//                                   <Phone className="mr-2 h-4 w-4" />
//                                   Call
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem
//                                   onClick={() => handleEmailLead(lead)}
//                                 >
//                                   <Mail className="mr-2 h-4 w-4" />
//                                   Email
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem
//                                   onClick={() => handleDelete(lead.id)}
//                                   className="text-destructive"
//                                 >
//                                   <Trash2 className="mr-2 h-4 w-4" />
//                                   Delete
//                                 </DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//         ) : (
//             // Kanban View
//             <div className="w-full overflow-x-auto">
//               <div className="flex gap-4 min-w-max">
//                 {statusColumns.map((column) => {
//                   const columnLeads = groupedByStatus[column.id];
//                   return (
//                     <div
//                       key={column.id}
//                       className="w-64 bg-muted/40 rounded-lg border flex flex-col"
//                     >
//                       <div className="px-3 py-2 border-b flex items-center justify-between">
//                         <span className="text-sm font-medium">
//                           {column.label}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                         {columnLeads.length}
//                         </span>
//                       </div>
//                       <div className="p-2 flex-1 overflow-y-auto max-h-[540px]">
//                         {columnLeads.length === 0 ? (
//                           <p className="text-xs text-muted-foreground text-center mt-4">
//                             No leads
//                           </p>
//                         ) : (
//                           columnLeads.map((lead) => renderLeadCard(lead))
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <LeadDialog
//         open={isAddDialogOpen}
//         onOpenChange={setIsAddDialogOpen}
//         lead={null}
//         mode="add"
//       />

//       <LeadDialog
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         lead={selectedLead}
//         mode="edit"
//       />

//       <LeadDetailDialog
//         open={isDetailDialogOpen}
//         onOpenChange={setIsDetailDialogOpen}
//         lead={selectedLead}
//         onCallLead={handleCallLead}
//         onEmailLead={handleEmailLead}
//         onWhatsAppLead={handleWhatsAppLead}
//         onScheduleMeeting={handleScheduleMeeting}
//         onCreateDeal={handleCreateDeal}
//       />

//       <ConvertLeadDialog
//         open={isConvertDialogOpen}
//         onOpenChange={setIsConvertDialogOpen}
//         lead={selectedLead}
//       />
//     </div>
//   );
// }


//testing 25-12-2025

"use client";

import { useEffect, useMemo, useState } from "react";
import { useCRM } from "@/contexts/crm-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadDialog } from "./lead-dialog";
import { LeadDetailDialog } from "./lead-detail-dialog";
import { ConvertLeadDialog } from "./convert-lead-dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  UserCheck,
  Users,
  UserPlus,
} from "lucide-react";
import type { Lead } from "@/types/crm";

const formatDate = (value: unknown) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type LeadViewMode = "table" | "kanban";

const statusColumns: { id: Lead["status"]; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed-won", label: "Closed Won" },
  { id: "closed-lost", label: "Closed Lost" },
];

export function LeadsContent() {
  const {
    leads,
    deleteLead,
    users,
    currentUser,
    leadFilters,
    setLeadFilters,
    refreshLeads,
  } = useCRM();

  const safeUsers = Array.isArray(users) ? users : [];
  const isAdmin = currentUser?.role === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [creatorSearchTerm, setCreatorSearchTerm] = useState(""); // New state for creator search
  const [statusFilter, setStatusFilter] = useState<string>(
    leadFilters.status ?? "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<string>(
    leadFilters.priority ?? "all",
  );
  const [serviceFilter, setServiceFilter] = useState<string>(
    leadFilters.service ?? "all",
  );
  const [createdByFilter, setCreatedByFilter] = useState<string>(
    leadFilters.createdBy ?? "all",
  );
  const [assignedToFilter, setAssignedToFilter] = useState<string>(
    leadFilters.assignedTo ?? "all",
  );

  const [viewMode, setViewMode] = useState<LeadViewMode>("table");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const normalizedCreatorSearch = creatorSearchTerm.trim().toLowerCase();

  useEffect(() => {
    const normalizedAssignedTo =
      isAdmin && assignedToFilter !== "all"
        ? assignedToFilter
        : undefined;

    const normalizedCreatedBy =
      isAdmin && createdByFilter !== "all"
        ? createdByFilter
        : undefined;

    const next = {
      status: statusFilter !== "all" ? statusFilter : undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      service: serviceFilter !== "all" ? serviceFilter : undefined,
      assignedTo: normalizedAssignedTo,
      createdBy: normalizedCreatedBy,
    };

    if (
      next.status === leadFilters.status &&
      next.priority === leadFilters.priority &&
      next.service === leadFilters.service &&
      (next.assignedTo ?? "all") === (leadFilters.assignedTo ?? "all") &&
      (next.createdBy ?? "all") === (leadFilters.createdBy ?? "all")
    ) {
      return;
    }

    setLeadFilters(next);
    void refreshLeads();
  }, [
    statusFilter,
    priorityFilter,
    serviceFilter,
    createdByFilter,
    assignedToFilter,
    isAdmin,
    leadFilters,
    setLeadFilters,
    refreshLeads,
  ]);

  const getCreatorName = (lead: Lead) => {
    if ((lead as any).created_user_name) {
      return (lead as any).created_user_name as string;
    }

    const creatorId =
      (lead as any).createdBy ?? (lead as any).created_by ?? null;
    if (!creatorId) return "Unknown";

    const user = safeUsers.find((u) => String(u.id) === String(creatorId));
    return user?.name || "Unknown";
  };

  const getAssignedToName = (lead: Lead) => {
    if ((lead as any).assigned_user_name) {
      return (lead as any).assigned_user_name as string;
    }

    const assignedId = (lead as any).assignedTo ?? (lead as any).assigned_to ?? null;
    if (!assignedId) return "Unassigned";

    const user = safeUsers.find((u) => String(u.id) === String(assignedId));
    return user?.name || "Unknown";
  };

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        // Main search (name, email, company, phone)
        const matchesSearch =
          !normalizedSearch ||
          (lead.name?.toLowerCase() ?? "").includes(normalizedSearch) ||
          (lead.email?.toLowerCase() ?? "").includes(normalizedSearch) ||
          (lead.company?.toLowerCase() ?? "").includes(normalizedSearch) ||
          (lead.phone ?? "").includes(searchTerm);

        // Creator name search
        const matchesCreator =
          !normalizedCreatorSearch ||
          getCreatorName(lead).toLowerCase().includes(normalizedCreatorSearch);

        return matchesSearch && matchesCreator;
      }),
    [leads, normalizedSearch, searchTerm, normalizedCreatorSearch],
  );

  const visibleLeads = useMemo(
    () =>
      filteredLeads.filter(
        (lead) =>
          !(lead.status === "closed-won" && (lead as any).isConverted),
      ),
    [filteredLeads],
  );

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (leadId: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      void deleteLead(leadId);
    }
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailDialogOpen(true);
  };

  const handleConvert = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConvertDialogOpen(true);
  };

  const handleCallLead = (lead: Lead) => {
    if (!lead.phone) return;
    window.open(`tel:${lead.phone}`, "_self");
  };

  const handleEmailLead = (lead: Lead) => {
    if (!lead.email) return;
    window.location.href = `mailto:${lead.email}`;
  };

  const handleWhatsAppLead = (lead: Lead) => {
    const number = lead.whatsappNumber || lead.phone;
    if (!number) return;
    const text = encodeURIComponent(
      "Hi, I'd like to follow up regarding our discussion.",
    );
    window.open(
      `https://wa.me/${number}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleScheduleMeeting = (lead: Lead) => {
    console.log("Schedule meeting for lead:", lead.id);
  };

  const handleCreateDeal = (lead: Lead) => {
    console.log("Create deal from lead:", lead.id);
  };

  const getStatusBadge = (status: Lead["status"]) => {
    const variants: Record<Lead["status"], string> = {
      new: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      contacted: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      qualified: "bg-green-100 text-green-800 hover:bg-green-100",
      proposal: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      negotiation: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      "closed-won": "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
      "closed-lost": "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return variants[status] ?? variants.new;
  };

  const getPriorityBadge = (priority: Lead["priority"]) => {
    const variants: Record<Lead["priority"], string> = {
      low: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      high: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return variants[priority] ?? variants.medium;
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus = {
      new: leads.filter((l) => l.status === "new").length,
      qualified: leads.filter((l) => l.status === "qualified").length,
      won: leads.filter((l) => l.status === "closed-won").length,
    };
    const totalValue = leads.reduce(
      (sum, lead) =>
        sum +
        (typeof lead.estimatedValue === "number"
          ? lead.estimatedValue
          : Number(lead.estimatedValue ?? 0) || 0),
      0,
    );

    return {
      total,
      new: byStatus.new,
      qualified: byStatus.qualified,
      won: byStatus.won,
      totalValue,
    };
  }, [leads]);

  const groupedByStatus = useMemo(() => {
    const map: Record<Lead["status"], Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      "closed-won": [],
      "closed-lost": [],
    };
    visibleLeads.forEach((lead) => {
      map[lead.status]?.push(lead);
    });
    return map;
  }, [visibleLeads]);

  const renderLeadCard = (lead: Lead) => {
    const valueNumber =
      typeof lead.estimatedValue === "number"
        ? lead.estimatedValue
        : Number(lead.estimatedValue ?? 0);

    return (
      <Card
        key={lead.id}
        className="mb-3 cursor-pointer hover:border-primary/60"
        onDoubleClick={() => handleViewDetails(lead)}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{lead.name}</div>
              <div className="text-xs text-muted-foreground">
                {lead.company || "—"}
              </div>
            </div>
            <Badge className={getPriorityBadge(lead.priority)}>
              {lead.priority}
            </Badge>
          </div>
          {lead.service && (
            <div className="text-xs capitalize text-muted-foreground">
              Service: {lead.service.replace(/-/g, " ")}
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span>
              Value:{" "}
              {valueNumber ? `₹${valueNumber.toLocaleString()}` : "—"}
            </span>
            <span>
              Close:{" "}
              {lead.expectedCloseDate
                ? formatDate(lead.expectedCloseDate)
                : "—"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Created by: {getCreatorName(lead)}
          </div>
          {isAdmin && (
            <div className="text-xs text-muted-foreground">
              Assigned to: {getAssignedToName(lead)}
            </div>
          )}
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  aria-label="Open actions"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(lead)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    lead.status === "closed-won" && handleConvert(lead)
                  }
                  disabled={lead.status !== "closed-won"}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Convert to Customer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCallLead(lead)}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEmailLead(lead)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(lead.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track your sales leads
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.new}
            </div>
            <p className="text-xs text-muted-foreground">New Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.qualified}
            </div>
            <p className="text-xs text-muted-foreground">Qualified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.won}
            </div>
            <p className="text-xs text-muted-foreground">Closed Won</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ₹{stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>Track and manage your sales leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Main Search */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leads (name, email, company, phone)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* New Creator Search Bar */}
            <div className="relative min-w-[220px] max-w-sm">
              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by Creator..."
                value={creatorSearchTerm}
                onChange={(e) => setCreatorSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="whatsapp-business-api">
                  WhatsApp Business API
                </SelectItem>
                <SelectItem value="website-development">
                  Website Development
                </SelectItem>
                <SelectItem value="ai-agent">AI Agent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Select
                value={createdByFilter}
                onValueChange={setCreatedByFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Creator">
                    {createdByFilter === "all" ? (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        All Creators
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        {safeUsers.find(u => String(u.id) === createdByFilter)?.name || "Creator"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      All Creators
                    </span>
                  </SelectItem>
                  {safeUsers.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {isAdmin && (
              <Select
                value={assignedToFilter}
                onValueChange={setAssignedToFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Owner">
                    {assignedToFilter === "all" ? (
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        All Owners
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {safeUsers.find(u => String(u.id) === assignedToFilter)?.name || "Owner"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      All Owners
                    </span>
                  </SelectItem>
                  {safeUsers.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-muted-foreground">View:</span>
              <Button
                type="button"
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                Table
              </Button>
              <Button
                type="button"
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                Kanban
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {visibleLeads.length} of {leads.length} leads
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead>Created By</TableHead>
                    {isAdmin && <TableHead>Assigned To</TableHead>}
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleLeads.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 11 : 10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm ||
                        creatorSearchTerm ||
                        statusFilter !== "all" ||
                        priorityFilter !== "all" ||
                        serviceFilter !== "all" ||
                        createdByFilter !== "all" ||
                        assignedToFilter !== "all"
                          ? "No leads found matching your filters."
                          : "No leads yet. Add your first lead!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleLeads.map((lead) => {
                      const valueNumber =
                        typeof lead.estimatedValue === "number"
                          ? lead.estimatedValue
                          : Number(lead.estimatedValue ?? 0);

                      return (
                        <TableRow
                          key={lead.id}
                          className="hover:bg-muted/50 cursor-pointer"
                          onDoubleClick={() => handleViewDetails(lead)}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {lead.name?.charAt(0) ?? "L"}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {lead.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {lead.company || "—"}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {lead.source}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {lead.phone || "No phone"}
                              </span>
                            </div>
                            {lead.whatsappNumber && (
                              <div className="flex items-center space-x-2 mt-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-green-600">
                                  WhatsApp
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(lead.status)}>
                              {lead.status.replace("-", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityBadge(lead.priority)}>
                              {lead.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {lead.service ? (
                              <span className="text-xs capitalize">
                                {lead.service.replace(/-/g, " ")}
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {valueNumber
                                ? `₹${valueNumber.toLocaleString()}`
                                : "—"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {lead.expectedCloseDate
                                ? formatDate(lead.expectedCloseDate)
                                : "—"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{getCreatorName(lead)}</div>
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              <div className="text-sm">
                                {getAssignedToName(lead)}
                              </div>
                            </TableCell>
                          )}
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  aria-label="Open actions"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(lead)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(lead)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    lead.status === "closed-won" &&
                                    handleConvert(lead)
                                  }
                                  disabled={lead.status !== "closed-won"}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Convert to Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleCallLead(lead)}
                                >
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEmailLead(lead)}
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(lead.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Kanban View
            <div className="w-full overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {statusColumns.map((column) => {
                  const columnLeads = groupedByStatus[column.id];
                  return (
                    <div
                      key={column.id}
                      className="w-64 bg-muted/40 rounded-lg border flex flex-col"
                    >
                      <div className="px-3 py-2 border-b flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {column.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {columnLeads.length}
                        </span>
                      </div>
                      <div className="p-2 flex-1 overflow-y-auto max-h-[540px]">
                        {columnLeads.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center mt-4">
                            No leads
                          </p>
                        ) : (
                          columnLeads.map((lead) => renderLeadCard(lead))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <LeadDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        lead={null}
        mode="add"
      />

      <LeadDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        lead={selectedLead}
        mode="edit"
      />

      <LeadDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        lead={selectedLead}
        onCallLead={handleCallLead}
        onEmailLead={handleEmailLead}
        onWhatsAppLead={handleWhatsAppLead}
        onScheduleMeeting={handleScheduleMeeting}
        onCreateDeal={handleCreateDeal}
      />

      <ConvertLeadDialog
        open={isConvertDialogOpen}
        onOpenChange={setIsConvertDialogOpen}
        lead={selectedLead}
      />
    </div>
  );
}


//31-12-2025

//testing

// "use client"

// import { useEffect, useMemo, useState } from "react"
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
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { LeadDialog } from "./lead-dialog"
// import { LeadDetailDialog } from "./lead-detail-dialog"
// import { ConvertLeadDialog } from "./convert-lead-dialog"
// import {
//   Plus,
//   Search,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Eye,
//   Phone,
//   Mail,
//   UserCheck,
//   Users,
//   UserPlus,
//   Sparkles,
//   ArrowUpRight,
//   Activity,
//   IndianRupee,
//   CheckCircle,
// } from "lucide-react"
// import type { Lead } from "@/types/crm"

// const formatCurrency = (value: number) =>
//   `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

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

// type LeadViewMode = "table" | "kanban"

// const statusColumns: { id: Lead["status"]; label: string }[] = [
//   { id: "new", label: "New" },
//   { id: "contacted", label: "Contacted" },
//   { id: "qualified", label: "Qualified" },
//   { id: "proposal", label: "Proposal" },
//   { id: "negotiation", label: "Negotiation" },
//   { id: "closed-won", label: "Closed Won" },
//   { id: "closed-lost", label: "Closed Lost" },
// ]

// export function LeadsContent() {
//   const {
//     leads,
//     deleteLead,
//     users,
//     currentUser,
//     leadFilters,
//     setLeadFilters,
//     refreshLeads,
//   } = useCRM()

//   const safeUsers = Array.isArray(users) ? users : []
//   const isAdmin = currentUser?.role === "admin"

//   const [searchTerm, setSearchTerm] = useState("")
//   const [creatorSearchTerm, setCreatorSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>(leadFilters.status ?? "all")
//   const [priorityFilter, setPriorityFilter] = useState<string>(leadFilters.priority ?? "all")
//   const [serviceFilter, setServiceFilter] = useState<string>(leadFilters.service ?? "all")
//   const [createdByFilter, setCreatedByFilter] = useState<string>(leadFilters.createdBy ?? "all")
//   const [assignedToFilter, setAssignedToFilter] = useState<string>(leadFilters.assignedTo ?? "all")
//   const [viewMode, setViewMode] = useState<LeadViewMode>("table")
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
//   const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)

//   const normalizedSearch = searchTerm.trim().toLowerCase()
//   const normalizedCreatorSearch = creatorSearchTerm.trim().toLowerCase()

//   useEffect(() => {
//     const normalizedAssignedTo = isAdmin && assignedToFilter !== "all" ? assignedToFilter : undefined
//     const normalizedCreatedBy = isAdmin && createdByFilter !== "all" ? createdByFilter : undefined

//     const next = {
//       status: statusFilter !== "all" ? statusFilter : undefined,
//       priority: priorityFilter !== "all" ? priorityFilter : undefined,
//       service: serviceFilter !== "all" ? serviceFilter : undefined,
//       assignedTo: normalizedAssignedTo,
//       createdBy: normalizedCreatedBy,
//     }

//     if (
//       next.status === leadFilters.status &&
//       next.priority === leadFilters.priority &&
//       next.service === leadFilters.service &&
//       (next.assignedTo ?? "all") === (leadFilters.assignedTo ?? "all") &&
//       (next.createdBy ?? "all") === (leadFilters.createdBy ?? "all")
//     ) {
//       return
//     }

//     setLeadFilters(next)
//     void refreshLeads()
//   }, [
//     statusFilter,
//     priorityFilter,
//     serviceFilter,
//     createdByFilter,
//     assignedToFilter,
//     isAdmin,
//     leadFilters,
//     setLeadFilters,
//     refreshLeads,
//   ])

//   const getCreatorName = (lead: Lead) => {
//     if ((lead as any).created_user_name) return (lead as any).created_user_name as string
//     const creatorId = (lead as any).createdBy ?? (lead as any).created_by ?? null
//     if (!creatorId) return "Unknown"
//     const user = safeUsers.find((u) => String(u.id) === String(creatorId))
//     return user?.name || "Unknown"
//   }

//   const getAssignedToName = (lead: Lead) => {
//     if ((lead as any).assigned_user_name) return (lead as any).assigned_user_name as string
//     const assignedId = (lead as any).assignedTo ?? (lead as any).assigned_to ?? null
//     if (!assignedId) return "Unassigned"
//     const user = safeUsers.find((u) => String(u.id) === String(assignedId))
//     return user?.name || "Unknown"
//   }

//   const filteredLeads = useMemo(
//     () =>
//       leads.filter((lead) => {
//         const matchesSearch =
//           !normalizedSearch ||
//           (lead.name?.toLowerCase() ?? "").includes(normalizedSearch) ||
//           (lead.email?.toLowerCase() ?? "").includes(normalizedSearch) ||
//           (lead.company?.toLowerCase() ?? "").includes(normalizedSearch) ||
//           (lead.phone ?? "").includes(searchTerm)

//         const matchesCreator =
//           !normalizedCreatorSearch ||
//           getCreatorName(lead).toLowerCase().includes(normalizedCreatorSearch)

//         return matchesSearch && matchesCreator
//       }),
//     [leads, normalizedSearch, searchTerm, normalizedCreatorSearch],
//   )

//   const visibleLeads = useMemo(
//     () => filteredLeads.filter((lead) => !(lead.status === "closed-won" && (lead as any).isConverted)),
//     [filteredLeads],
//   )

//   const handleEdit = (lead: Lead) => {
//     setSelectedLead(lead)
//     setIsEditDialogOpen(true)
//   }

//   const handleDelete = async (leadId: string) => {
//     if (window.confirm("Are you sure you want to delete this lead?")) {
//       void deleteLead(leadId)
//     }
//   }

//   const handleViewDetails = (lead: Lead) => {
//     setSelectedLead(lead)
//     setIsDetailDialogOpen(true)
//   }

//   const handleConvert = (lead: Lead) => {
//     setSelectedLead(lead)
//     setIsConvertDialogOpen(true)
//   }

//   const handleCallLead = (lead: Lead) => {
//     if (!lead.phone) return
//     window.open(`tel:${lead.phone}`, "_self")
//   }

//   const handleEmailLead = (lead: Lead) => {
//     if (!lead.email) return
//     window.location.href = `mailto:${lead.email}`
//   }

//   const handleWhatsAppLead = (lead: Lead) => {
//     const number = lead.whatsappNumber || lead.phone
//     if (!number) return
//     const text = encodeURIComponent("Hi, I'd like to follow up regarding our discussion.")
//     window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer")
//   }

//   const stats = useMemo(() => {
//     const total = leads.length
//     const byStatus = {
//       new: leads.filter((l) => l.status === "new").length,
//       qualified: leads.filter((l) => l.status === "qualified").length,
//       won: leads.filter((l) => l.status === "closed-won").length,
//     }
//     const totalValue = leads.reduce(
//       (sum, lead) =>
//         sum +
//         (typeof lead.estimatedValue === "number" ? lead.estimatedValue : Number(lead.estimatedValue ?? 0) || 0),
//       0,
//     )

//     return { total, new: byStatus.new, qualified: byStatus.qualified, won: byStatus.won, totalValue }
//   }, [leads])

//   const groupedByStatus = useMemo(() => {
//     const map: Record<Lead["status"], Lead[]> = {
//       new: [],
//       contacted: [],
//       qualified: [],
//       proposal: [],
//       negotiation: [],
//       "closed-won": [],
//       "closed-lost": [],
//     }
//     visibleLeads.forEach((lead) => map[lead.status]?.push(lead))
//     return map
//   }, [visibleLeads])

//   const getStatusBadge = (status: Lead["status"]) => {
//     const colors: Record<Lead["status"], string> = {
//       new: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50",
//       contacted: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900/50",
//       qualified: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50",
//       proposal: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900/50",
//       negotiation: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900/50",
//       "closed-won": "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-900/50",
//       "closed-lost": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50",
//     }
//     return colors[status] ?? colors.new
//   }

//   const getPriorityBadge = (priority: Lead["priority"]) => {
//     const colors: Record<Lead["priority"], string> = {
//       low: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50",
//       medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50",
//       high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50",
//     }
//     return colors[priority] ?? colors.medium
//   }

//   // ← Component properly closed here
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
//               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50">
              
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
//                   Leads
//                 </h1>
//               </div>
//             </div>
//             <Button
//               onClick={() => setIsAddDialogOpen(true)}
//               className="h-11 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add Lead
//             </Button>
//           </div>
//         </div>

//         {/* Premium Stats Cards */}
//         <div className="flex items-center gap-2 mb-6">
//           <Sparkles className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             Pipeline Overview
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 sm:gap-6 mb-10 sm:mb-12">
//           {/* Total Leads */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-cyan-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Total Leads
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
//                 {stats.total}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">All leads</p>
//             </CardContent>
//           </Card>

//           {/* New Leads */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/50 dark:to-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-purple-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                 <UserPlus className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 New Leads
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
//                 {stats.new}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Fresh opportunities</p>
//             </CardContent>
//           </Card>

//           {/* Qualified */}
//           {/* <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-50/50 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Qualified
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
//                 {stats.qualified}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Ready for proposal</p>
//             </CardContent>
//           </Card> */}

//           {/* Closed Won */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-teal-50/50 dark:to-teal-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-cyan-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <UserCheck className="h-7 w-7 text-teal-600 dark:text-teal-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Closed Won
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
//                 {stats.won}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Converted leads</p>
//             </CardContent>
//           </Card>

//           {/* Pipeline Value */}
//           <Card className="group relative overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/50 dark:to-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="pb-4 relative z-10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
//                   <IndianRupee className="h-7 w-7 text-amber-600 dark:text-amber-400" />
//                 </div>
//               </div>
//               <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
//                 Pipeline Value
//               </CardTitle>
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
//                 {formatCurrency(stats.totalValue)}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0 relative z-10">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Estimated total</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters Section */}
//         <div className="flex items-center gap-2 mb-6">
//           <Search className="h-4 w-4 text-slate-400" />
//           <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//             Filters & View
//           </h2>
//         </div>

//         <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
//           <CardContent className="pt-6">
//             <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
//               <div className="flex flex-col sm:flex-row gap-4 flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                   <Input
//                     placeholder="Search by name, email, company..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 w-full sm:w-80"
//                   />
//                 </div>
//                 <div className="relative">
//                   <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                   <Input
//                     placeholder="Search by creator..."
//                     value={creatorSearchTerm}
//                     onChange={(e) => setCreatorSearchTerm(e.target.value)}
//                     className="pl-10 w-full sm:w-64"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-44">
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     {statusColumns.map((col) => (
//                       <SelectItem key={col.id} value={col.id}>
//                         {col.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={priorityFilter} onValueChange={setPriorityFilter}>
//                   <SelectTrigger className="w-36">
//                     <SelectValue placeholder="All Priority" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Priority</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="low">Low</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <Select value={serviceFilter} onValueChange={setServiceFilter}>
//                   <SelectTrigger className="w-48">
//                     <SelectValue placeholder="All Services" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Services</SelectItem>
//                     <SelectItem value="whatsapp-business-api">WhatsApp Business API</SelectItem>
//                     <SelectItem value="website-development">Website Development</SelectItem>
//                     <SelectItem value="ai-agent">AI Agent</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 {isAdmin && (
//                   <>
//                     <Select value={createdByFilter} onValueChange={setCreatedByFilter}>
//                       <SelectTrigger className="w-48">
//                         <SelectValue placeholder="All Creators" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Creators</SelectItem>
//                         {safeUsers.map((user) => (
//                           <SelectItem key={user.id} value={String(user.id)}>
//                             {user.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>

//                     <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
//                       <SelectTrigger className="w-48">
//                         <SelectValue placeholder="All Owners" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Owners</SelectItem>
//                         {safeUsers.map((user) => (
//                           <SelectItem key={user.id} value={String(user.id)}>
//                             {user.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </>
//                 )}

//                 <div className="flex items-center gap-2 ml-auto">
//                   <Button
//                     variant={viewMode === "table" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setViewMode("table")}
//                   >
//                     Table
//                   </Button>
//                   <Button
//                     variant={viewMode === "kanban" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setViewMode("kanban")}
//                   >
//                     Kanban
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Leads Table / Kanban */}
//         <div className="mt-8">
//           {viewMode === "table" ? (
//             <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-b border-slate-200 dark:border-slate-800">
//                         <TableHead>Lead</TableHead>
//                         <TableHead>Company</TableHead>
//                         <TableHead>Contact</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Priority</TableHead>
//                         <TableHead>Service</TableHead>
//                         <TableHead>Value</TableHead>
//                         <TableHead>Expected Close</TableHead>
//                         <TableHead>Created By</TableHead>
//                         {isAdmin && <TableHead>Assigned To</TableHead>}
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {visibleLeads.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={isAdmin ? 11 : 10} className="text-center py-12 text-slate-500 dark:text-slate-400">
//                             No leads found matching your filters.
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         visibleLeads.map((lead) => {
//                           const valueNumber = typeof lead.estimatedValue === "number" ? lead.estimatedValue : Number(lead.estimatedValue ?? 0) || 0
//                           return (
//                             <TableRow
//                               key={lead.id}
//                               className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
//                               onDoubleClick={() => handleViewDetails(lead)}
//                             >
//                               <TableCell>
//                                 <div className="flex items-center gap-3">
//                                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
//                                     {lead.name?.charAt(0)?.toUpperCase() || "L"}
//                                   </div>
//                                   <div>
//                                     <div className="font-medium">{lead.name}</div>
//                                     <div className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</div>
//                                   </div>
//                                 </div>
//                               </TableCell>
//                               <TableCell>{lead.company || "—"}</TableCell>
//                               <TableCell>
//                                 {lead.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4" /> {lead.phone}</div>}
//                                 {lead.whatsappNumber && <div className="text-xs text-green-600 mt-1">WhatsApp Available</div>}
//                               </TableCell>
//                               <TableCell>
//                                 <Badge className={getStatusBadge(lead.status)}>
//                                   {lead.status.replace("-", " ")}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell>
//                                 <Badge className={getPriorityBadge(lead.priority)}>
//                                   {lead.priority}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell className="capitalize">
//                                 {lead.service ? lead.service.replace(/-/g, " ") : "—"}
//                               </TableCell>
//                               <TableCell className="font-medium">
//                                 {valueNumber ? formatCurrency(valueNumber) : "—"}
//                               </TableCell>
//                               <TableCell>
//                                 {lead.expectedCloseDate ? formatDate(lead.expectedCloseDate) : "—"}
//                               </TableCell>
//                               <TableCell>{getCreatorName(lead)}</TableCell>
//                               {isAdmin && <TableCell>{getAssignedToName(lead)}</TableCell>}
//                               <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" size="sm">
//                                       <MoreHorizontal className="h-4 w-4" />
//                                     </Button>
//                                   </DropdownMenuTrigger>
//                                   <DropdownMenuContent align="end">
//                                     <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
//                                       <Eye className="h-4 w-4 mr-2" /> View
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => handleEdit(lead)}>
//                                       <Edit className="h-4 w-4 mr-2" /> Edit
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() => lead.status === "closed-won" && handleConvert(lead)}
//                                       disabled={lead.status !== "closed-won"}
//                                     >
//                                       <UserCheck className="h-4 w-4 mr-2" /> Convert
//                                     </DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem onClick={() => handleCallLead(lead)}>
//                                       <Phone className="h-4 w-4 mr-2" /> Call
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => handleEmailLead(lead)}>
//                                       <Mail className="h-4 w-4 mr-2" /> Email
//                                     </DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-red-600">
//                                       <Trash2 className="h-4 w-4 mr-2" /> Delete
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </TableCell>
//                             </TableRow>
//                           )
//                         })
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="overflow-x-auto pb-4">
//               <div className="flex gap-6 min-w-max">
//                 {statusColumns.map((column) => {
//                   const columnLeads = groupedByStatus[column.id]
//                   return (
//                     <div key={column.id} className="w-80 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-4">
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="font-semibold text-slate-900 dark:text-white">{column.label}</h3>
//                         <Badge variant="secondary">{columnLeads.length}</Badge>
//                       </div>
//                       <div className="space-y-3">
//                         {columnLeads.length === 0 ? (
//                           <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No leads</p>
//                         ) : (
//                           columnLeads.map((lead) => (
//                             <Card
//                               key={lead.id}
//                               className="cursor-pointer hover:shadow-md transition-shadow"
//                               onDoubleClick={() => handleViewDetails(lead)}
//                             >
//                               <CardContent className="p-4">
//                                 <div className="font-medium mb-1">{lead.name}</div>
//                                 <div className="text-xs text-slate-500 mb-2">{lead.company || "—"}</div>
//                                 <Badge className={getPriorityBadge(lead.priority)}>{lead.priority}</Badge>
//                                 <div className="mt-2 text-sm font-medium">
//                                   {lead.estimatedValue ? formatCurrency(lead.estimatedValue as number) : "—"}
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Dialogs */}
//         <LeadDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} lead={null} mode="add" />
//         <LeadDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} lead={selectedLead} mode="edit" />
//         <LeadDetailDialog
//           open={isDetailDialogOpen}
//           onOpenChange={setIsDetailDialogOpen}
//           lead={selectedLead}
//           onCallLead={handleCallLead}
//           onEmailLead={handleEmailLead}
//           onWhatsAppLead={handleWhatsAppLead}
//           onScheduleMeeting={() => console.log("Schedule meeting")}
//           onCreateDeal={() => console.log("Create deal")}
//         />
//         <ConvertLeadDialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen} lead={selectedLead} />
//       </div>
//     </div>
//   )
// }