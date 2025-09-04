"use client"

import { useCryptoPrices } from "@/hooks/use-crypto-data"
import { TrendingUp, TrendingDown, Wifi, WifiOff, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RealTimePriceTicker() {
  const { prices, isLoading, isError, isUsingRealOracle } = useCryptoPrices()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        <span className="text-sm">Loading prices...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">Connection error</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        {isUsingRealOracle ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <Badge variant="outline" className="text-green-500 border-green-500">
              CoinGecko Oracle
            </Badge>
          </>
        ) : (
          <>
            <Database className="h-4 w-4 text-blue-500" />
            <Badge variant="outline" className="text-blue-500 border-blue-500">
              Simulated Data
            </Badge>
          </>
        )}
      </div>

      {prices.slice(0, 3).map((price) => (
        <div key={price.symbol} className="flex items-center space-x-2">
          <span className="font-heading font-bold text-foreground text-sm">{price.symbol}</span>
          <span className="text-foreground font-medium">
            ${price.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center">
            {price.change24h > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${price.change24h > 0 ? "text-green-500" : "text-red-500"}`}>
              {price.change24h > 0 ? "+" : ""}
              {price.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}

      <div className="text-xs text-muted-foreground">
        {isUsingRealOracle ? "Live" : "Demo"} • {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
