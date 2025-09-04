"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, TrendingDown, CheckCircle, Bell } from "lucide-react";
import { useCryptoPrices } from "@/hooks/use-crypto-data";

interface AlertNotification {
  id: string;
  coin: string;
  coinName: string;
  type: "above" | "below";
  targetPrice: number;
  currentPrice: number;
  message: string;
  timestamp: Date;
}

interface StoredAlert {
  id: string;
  coin: string;
  type: "above" | "below";
  targetPrice: number;
  status: "active" | "triggered" | "dismissed";
  createdAt: Date;
}

// Crypto icon component fallback
function CryptoIconFallback({
  symbol,
  className = "h-6 w-6",
}: {
  symbol: string;
  className?: string;
}) {
  const colorMap: Record<string, string> = {
    BTC: "#f97316",
    ETH: "#3b82f6",
    SOL: "#8b5cf6",
    ADA: "#06b6d4",
    DOT: "#e91e63",
    LINK: "#2563eb",
    AVAX: "#ef4444",
    MATIC: "#7c3aed",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{
        backgroundColor: colorMap[symbol] || "#6b7280",
        width: "24px",
        height: "24px",
      }}
    >
      <span className='text-white font-bold text-xs'>{symbol}</span>
    </div>
  );
}

export function AlertNotification() {
  const { prices, isUsingRealOracle } = useCryptoPrices();
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [storedAlerts, setStoredAlerts] = useState<StoredAlert[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Load stored alerts from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("memento-alerts");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setStoredAlerts(
            parsed.map((alert: any) => ({
              ...alert,
              createdAt: new Date(alert.createdAt),
            }))
          );
        } catch (error) {
          console.error("Error loading alerts:", error);
        }
      } else {
        // Initialize with some demo alerts if none exist
        const demoAlerts: StoredAlert[] = [
          {
            id: "demo-1",
            coin: "BTC",
            type: "above",
            targetPrice: 45000,
            status: "active",
            createdAt: new Date(),
          },
          {
            id: "demo-2",
            coin: "ETH",
            type: "below",
            targetPrice: 2200,
            status: "active",
            createdAt: new Date(),
          },
        ];
        setStoredAlerts(demoAlerts);
        localStorage.setItem("memento-alerts", JSON.stringify(demoAlerts));
      }
    }
  }, []);

  // Check for triggered alerts when prices update
  useEffect(() => {
    if (prices.length === 0 || storedAlerts.length === 0) return;

    const newNotifications: AlertNotification[] = [];

    storedAlerts.forEach((alert) => {
      if (alert.status !== "active") return;

      const priceData = prices.find((p) => p.symbol === alert.coin);
      if (!priceData) return;

      const currentPrice = priceData.price;
      let triggered = false;

      if (alert.type === "above" && currentPrice >= alert.targetPrice) {
        triggered = true;
      } else if (alert.type === "below" && currentPrice <= alert.targetPrice) {
        triggered = true;
      }

      if (triggered) {
        // Create notification
        const notification: AlertNotification = {
          id: `notification-${alert.id}`,
          coin: alert.coin,
          coinName: priceData.name,
          type: alert.type,
          targetPrice: alert.targetPrice,
          currentPrice: currentPrice,
          message: `${priceData.name} has ${
            alert.type === "above" ? "reached" : "dropped to"
          } your target price of $${alert.targetPrice.toLocaleString()}!`,
          timestamp: new Date(),
        };

        newNotifications.push(notification);

        // Mark alert as triggered
        alert.status = "triggered";
      }
    });

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications]);

      // Update stored alerts
      const updatedAlerts = storedAlerts.map((alert) => {
        const wasTriggered = newNotifications.some(
          (n) => n.id === `notification-${alert.id}`
        );
        return wasTriggered
          ? { ...alert, status: "triggered" as const }
          : alert;
      });
      setStoredAlerts(updatedAlerts);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("memento-alerts", JSON.stringify(updatedAlerts));
      }
    }
  }, [prices, storedAlerts]);

  // Show notifications with animation
  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true);
    }
  }, [notifications]);

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    dismissNotification(id);
  };

  // Add new alert (this would be called from the PriceAlert component)
  const addAlert = (
    coin: string,
    type: "above" | "below",
    targetPrice: number
  ) => {
    const newAlert: StoredAlert = {
      id: Date.now().toString(),
      coin,
      type,
      targetPrice,
      status: "active",
      createdAt: new Date(),
    };

    const updatedAlerts = [...storedAlerts, newAlert];
    setStoredAlerts(updatedAlerts);

    if (typeof window !== "undefined") {
      localStorage.setItem("memento-alerts", JSON.stringify(updatedAlerts));
    }
  };

  // Expose addAlert function globally for other components
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).mementoAddAlert = addAlert;
    }
  }, [storedAlerts]);

  if (notifications.length === 0) return null;

  return (
    <div className='fixed top-4 right-4 z-50 space-y-3 max-w-sm'>
      {notifications.map((notification, index) => (
        <Card
          key={notification.id}
          className={`
            bg-gradient-to-r from-slate-900 to-slate-800 
            border-slate-700/50 shadow-2xl backdrop-blur-sm
            transform transition-all duration-500 ease-out
            ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <CardContent className='p-0'>
            <div className='bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-t-lg'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='flex items-center space-x-2'>
                    <CryptoIconFallback symbol={notification.coin} />
                    <div>
                      <div className='flex items-center space-x-2'>
                        <span className='font-heading font-bold text-white text-sm'>
                          {notification.coin}
                        </span>
                        <Badge
                          variant={
                            notification.type === "above"
                              ? "default"
                              : "destructive"
                          }
                          className='text-xs px-2 py-0.5'
                        >
                          {notification.type === "above"
                            ? "Target Hit"
                            : "Price Alert"}
                        </Badge>
                      </div>
                      <span className='text-white/80 text-xs'>
                        {notification.coinName}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => dismissNotification(notification.id)}
                  className='text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='p-4 space-y-3'>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 mt-0.5'>
                  {notification.type === "above" ? (
                    <div className='flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full'>
                      <TrendingUp className='h-4 w-4 text-green-400' />
                    </div>
                  ) : (
                    <div className='flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full'>
                      <TrendingDown className='h-4 w-4 text-red-400' />
                    </div>
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-slate-100 text-sm font-medium leading-relaxed'>
                    {notification.message}
                  </p>
                  <div className='flex items-center justify-between mt-2'>
                    <div className='text-slate-300 text-xs'>
                      Current:{" "}
                      <span className='font-semibold text-white'>
                        $
                        {notification.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className='text-slate-400 text-xs'>
                      {notification.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {isUsingRealOracle && (
                    <div className='text-green-400 text-xs mt-1 flex items-center'>
                      <Bell className='h-3 w-3 mr-1' />
                      Live price alert
                    </div>
                  )}
                </div>
              </div>

              <div className='flex items-center justify-between pt-2 border-t border-slate-700/50'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => markAsRead(notification.id)}
                  className='text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs h-7'
                >
                  <CheckCircle className='h-3 w-3 mr-1' />
                  Mark as Read
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs h-7'
                  onClick={() => dismissNotification(notification.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
