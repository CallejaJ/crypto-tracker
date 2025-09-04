"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Bell, Activity, Edit } from "lucide-react"
import { usePortfolioData } from "@/hooks/use-crypto-data"
import { AddCryptoModal } from "./add-crypto-modal"
import { EditHoldingModal } from "./edit-holding-modal"
import { useState } from "react"
import Link from "next/link"

export function PortfolioHoldings() {
  const { holdings, metrics, isLoading, addHolding, updateHolding, removeHolding } = usePortfolioData()
  const [editingHolding, setEditingHolding] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleAddCrypto = (crypto: { symbol: string; name: string; amount: number; price: number }) => {
    addHolding(crypto)
  }

  const handleEditHolding = (holding: any) => {
    setEditingHolding(holding)
    setEditModalOpen(true)
  }

  const handleUpdateHolding = (symbol: string, newAmount: number) => {
    updateHolding(symbol, newAmount)
  }

  const handleRemoveHolding = (symbol: string) => {
    removeHolding(symbol)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-black text-card-foreground">
              ${metrics.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center mt-2">
              {metrics.totalChange24h > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${metrics.totalChange24h > 0 ? "text-green-500" : "text-red-500"}`}>
                {metrics.totalChange24h > 0 ? "+" : ""}
                {metrics.totalChange24h.toFixed(2)}% (24h)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-black text-card-foreground">
              +${(metrics.totalValue * 0.173).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+17.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-black text-card-foreground">7</div>
            <div className="flex items-center mt-2">
              <Bell className="h-4 w-4 text-primary mr-1" />
              <span className="text-sm text-muted-foreground">2 triggered</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-black text-card-foreground">
              {metrics.bestPerformer?.symbol || "ETH"}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+{metrics.bestPerformer?.change24h.toFixed(1) || "18.3"}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-heading font-bold text-card-foreground">Your Holdings</CardTitle>
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="border-border text-foreground bg-transparent">
                <Activity className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: holding.icon }}
                  >
                    <span className="text-white font-bold text-sm">{holding.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-card-foreground">{holding.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {holding.amount.toFixed(4)} {holding.symbol}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-heading font-bold text-card-foreground">
                      ${holding.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center">
                      {holding.change24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${holding.change24h > 0 ? "text-green-500" : "text-red-500"}`}>
                        {holding.change24h > 0 ? "+" : ""}
                        {holding.change24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditHolding(holding)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <AddCryptoModal onAddCrypto={handleAddCrypto} />
            <Link href="/alerts">
              <Button variant="outline" className="border-border text-foreground bg-transparent">
                Set Alert
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <EditHoldingModal
        holding={editingHolding}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onUpdateHolding={handleUpdateHolding}
        onRemoveHolding={handleRemoveHolding}
      />
    </div>
  )
}
