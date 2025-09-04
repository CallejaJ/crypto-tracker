"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, TrendingUp, TrendingDown, X } from "lucide-react"

interface Alert {
  id: string
  coin: string
  type: "above" | "below"
  targetPrice: number
  currentPrice: number
  status: "active" | "triggered" | "dismissed"
  createdAt: Date
}

export function PriceAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      coin: "BTC",
      type: "above",
      targetPrice: 45000,
      currentPrice: 43200,
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "2",
      coin: "ETH",
      type: "below",
      targetPrice: 2200,
      currentPrice: 2300,
      status: "triggered",
      createdAt: new Date(),
    },
  ])

  const [newAlert, setNewAlert] = useState({
    coin: "",
    type: "above" as "above" | "below",
    targetPrice: "",
  })

  const handleCreateAlert = () => {
    if (newAlert.coin && newAlert.targetPrice) {
      const alert: Alert = {
        id: Date.now().toString(),
        coin: newAlert.coin,
        type: newAlert.type,
        targetPrice: Number.parseFloat(newAlert.targetPrice),
        currentPrice: 0, // Would be fetched from API
        status: "active",
        createdAt: new Date(),
      }
      setAlerts([...alerts, alert])
      setNewAlert({ coin: "", type: "above", targetPrice: "" })
    }
  }

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: "dismissed" as const } : alert)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "triggered":
        return "bg-green-500"
      case "dismissed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New Alert */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-bold text-card-foreground flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Create Price Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="coin" className="text-card-foreground">
                Cryptocurrency
              </Label>
              <Select value={newAlert.coin} onValueChange={(value) => setNewAlert({ ...newAlert, coin: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type" className="text-card-foreground">
                Alert Type
              </Label>
              <Select
                value={newAlert.type}
                onValueChange={(value: "above" | "below") => setNewAlert({ ...newAlert, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price" className="text-card-foreground">
                Target Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <Button onClick={handleCreateAlert} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create Alert
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-bold text-card-foreground">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts
              .filter((alert) => alert.status !== "dismissed")
              .map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {alert.type === "above" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-heading font-bold text-card-foreground">{alert.coin}</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {alert.type === "above" ? "Above" : "Below"} ${alert.targetPrice.toLocaleString()}
                    </div>

                    <Badge className={`${getStatusColor(alert.status)} text-white`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

            {alerts.filter((alert) => alert.status !== "dismissed").length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active alerts. Create your first alert above.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
