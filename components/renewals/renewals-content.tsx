"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCRM } from "@/contexts/crm-context"
import { RenewalDialog } from "./renewal-dialog"
import { WhatsAppSettingsDialog } from "./whatsapp-settings-dialog"
import { MessageTemplateDialog } from "./message-template-dialog"
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
} from "lucide-react"

export function RenewalsContent() {
  const { customers, renewals, addRenewal, updateRenewal, deleteRenewal } = useCRM()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedRenewal, setSelectedRenewal] = useState(null)

  // Filter renewals
  const filteredRenewals = renewals.filter((renewal) => {
    const customer = customers.find((c) => c.id === renewal.customerId)
    const matchesSearch =
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || renewal.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Calculate renewal statistics
  const upcomingRenewals = renewals.filter((r) => {
    const daysUntilExpiry = Math.ceil((new Date(r.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }).length

  const expiredRenewals = renewals.filter((r) => {
    const daysUntilExpiry = Math.ceil((new Date(r.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 0
  }).length

  const renewedThisMonth = renewals.filter((r) => r.status === "renewed").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "expiring":
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      case "renewed":
        return <Badge className="bg-blue-100 text-blue-800">Renewed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const sendWhatsAppReminder = (renewalId: string) => {
    // Mock WhatsApp sending functionality
    alert(`WhatsApp reminder sent for renewal ${renewalId}`)
    // In real implementation, this would integrate with WhatsApp Business API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Renewal Management</h1>
          <p className="text-gray-600 mt-1">Automated WhatsApp reminders for expiring services</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)} className="border-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            WhatsApp Settings
          </Button>
          <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)} className="border-gray-300">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Templates
          </Button>
          <Button onClick={() => setIsRenewalDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Renewal
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Services</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredRenewals}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{renewedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Successfully renewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewals.length}</div>
            <p className="text-xs text-muted-foreground">Under management</p>
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
          <CardDescription>Manage and track all service renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRenewals.map((renewal) => {
              const customer = customers.find((c) => c.id === renewal.customerId)
              const daysUntilExpiry = getDaysUntilExpiry(renewal.expiryDate)

              return (
                <div
                  key={renewal.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{customer?.name}</h3>
                        {getStatusBadge(renewal.status)}
                      </div>
                      <p className="text-sm text-gray-600">{renewal.service}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Expires: {new Date(renewal.expiryDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">Amount: {renewal.amount}</span>
                        {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                          <span className="text-xs text-yellow-600 font-medium">{daysUntilExpiry} days left</span>
                        )}
                        {daysUntilExpiry <= 0 && (
                          <span className="text-xs text-red-600 font-medium">
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
                      onClick={() => sendWhatsAppReminder(renewal.id)}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send Reminder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRenewal(renewal)
                        setIsRenewalDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              )
            })}
            {filteredRenewals.length === 0 && (
              <div className="text-center py-8 text-gray-500">No renewals found matching your criteria.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RenewalDialog
        isOpen={isRenewalDialogOpen}
        onClose={() => {
          setIsRenewalDialogOpen(false)
          setSelectedRenewal(null)
        }}
        renewal={selectedRenewal}
        onSave={(renewalData) => {
          if (selectedRenewal) {
            updateRenewal(selectedRenewal.id, renewalData)
          } else {
            addRenewal(renewalData)
          }
          setIsRenewalDialogOpen(false)
          setSelectedRenewal(null)
        }}
      />

      <WhatsAppSettingsDialog isOpen={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)} />

      <MessageTemplateDialog isOpen={isTemplateDialogOpen} onClose={() => setIsTemplateDialogOpen(false)} />
    </div>
  )
}
