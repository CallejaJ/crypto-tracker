"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface OracleStatusProps {
  isUsingRealOracle: boolean
}

export function OracleStatus({ isUsingRealOracle }: OracleStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isUsingRealOracle ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <Badge variant="outline" className="text-green-500 border-green-500">
            Live Oracle Data
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-yellow-500" />
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Simulated Data
          </Badge>
        </>
      )}
    </div>
  )
}
