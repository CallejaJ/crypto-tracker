"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, TrendingDown, CheckCircle } from "lucide-react"
import { getCryptoIcon } from "./crypto-icons"

interface AlertNotification {
  id: string
  coin: string
  coinName: string
  type: "above" | "below"
  targetPrice: number
  currentPrice: number
  message: string
  timestamp: Date
}

export function AlertNotification() {
  const [notifications, setNotifications] = useState<AlertNotification[]>([
    {
      id: "1",
      coin: "ETH",
      coinName: "Ethereum",
      type: "above",
      targetPrice: 2300,
      currentPrice: 2315,
      message: "Ethereum has reached your target price of $2,300!",
      timestamp: new Date(),
    },
  ])

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true)
    }
  }, [notifications])

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification, index) => (
        <Card
          key={notification.id}
          className={`
            bg-gradient-to-r from-slate-900 to-slate-800 
            border-slate-700/50 shadow-2xl backdrop-blur-sm
            transform transition-all duration-500 ease-out
            ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getCryptoIcon(notification.coin, "h-6 w-6")}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-bold text-white text-sm">{notification.coin}</span>
                        <Badge
                          variant={notification.type === "above" ? "default" : "destructive"}
                          className="text-xs px-2 py-0.5"
                        >
                          {notification.type === "above" ? "Target Hit" : "Alert"}
                        </Badge>
                      </div>
                      <span className="text-white/80 text-xs">{notification.coinName}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {notification.type === "above" ? (
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-100 text-sm font-medium leading-relaxed">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-slate-300 text-xs">
                      Current:{" "}
                      <span className="font-semibold text-white">${notification.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-slate-400 text-xs">
                      {notification.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs h-7"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark as Read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs h-7"
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
