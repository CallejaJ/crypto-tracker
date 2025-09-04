"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, TrendingUp, TrendingDown, X, Trash2 } from "lucide-react";
import { useCryptoPrices } from "@/hooks/use-crypto-data";
import { SUPPORTED_CRYPTOS } from "@/lib/crypto-config";

interface Alert {
  id: string;
  coin: string;
  coinName: string;
  type: "above" | "below";
  targetPrice: number;
  currentPrice?: number;
  status: "active" | "triggered" | "dismissed";
  createdAt: Date;
}

export function PriceAlert() {
  const { prices, isUsingRealOracle } = useCryptoPrices();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    coin: "",
    type: "above" as "above" | "below",
    targetPrice: "",
  });

  // Load alerts from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("memento-alerts");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAlerts(
            parsed.map((alert: any) => ({
              ...alert,
              createdAt: new Date(alert.createdAt),
            }))
          );
        } catch (error) {
          console.error("Error loading alerts:", error);
        }
      }
    }
  }, []);

  // Update current prices for alerts
  useEffect(() => {
    if (prices.length > 0) {
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => {
          const priceData = prices.find((p) => p.symbol === alert.coin);
          return priceData
            ? {
                ...alert,
                currentPrice: priceData.price,
                coinName: priceData.name,
              }
            : alert;
        })
      );
    }
  }, [prices]);

  // Save alerts to localStorage whenever alerts change
  useEffect(() => {
    if (typeof window !== "undefined" && alerts.length > 0) {
      localStorage.setItem("memento-alerts", JSON.stringify(alerts));
    }
  }, [alerts]);

  const handleCreateAlert = () => {
    if (newAlert.coin && newAlert.targetPrice) {
      const crypto = SUPPORTED_CRYPTOS.find((c) => c.symbol === newAlert.coin);
      const priceData = prices.find((p) => p.symbol === newAlert.coin);

      const alert: Alert = {
        id: Date.now().toString(),
        coin: newAlert.coin,
        coinName: crypto?.name || newAlert.coin,
        type: newAlert.type,
        targetPrice: parseFloat(newAlert.targetPrice),
        currentPrice: priceData?.price || 0,
        status: "active",
        createdAt: new Date(),
      };

      setAlerts((prev) => [...prev, alert]);
      setNewAlert({ coin: "", type: "above", targetPrice: "" });
    }
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, status: "dismissed" as const } : alert
      )
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500";
      case "triggered":
        return "bg-green-500";
      case "dismissed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAlertProgress = (alert: Alert) => {
    if (!alert.currentPrice) return 0;

    if (alert.type === "above") {
      return Math.min((alert.currentPrice / alert.targetPrice) * 100, 100);
    } else {
      return Math.min(
        ((alert.targetPrice - alert.currentPrice) / alert.targetPrice) * 100 +
          50,
        100
      );
    }
  };

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const triggeredAlerts = alerts.filter(
    (alert) => alert.status === "triggered"
  );
  const dismissedAlerts = alerts.filter(
    (alert) => alert.status === "dismissed"
  );

  return (
    <div className='space-y-4 lg:space-y-6'>
      {/* Oracle Status */}
      {isUsingRealOracle && (
        <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-3'>
          <div className='flex items-center space-x-2 text-green-400 text-sm'>
            <Bell className='h-4 w-4' />
            <span>
              Real-time price monitoring active - alerts will trigger
              automatically
            </span>
          </div>
        </div>
      )}

      {/* Create New Alert */}
      <Card className='bg-card'>
        <CardHeader>
          <CardTitle className='text-lg lg:text-xl font-heading font-bold text-card-foreground flex items-center'>
            <Bell className='mr-2 h-4 w-4 lg:h-5 lg:w-5' />
            Create Price Alert
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='coin' className='text-card-foreground text-sm'>
                Cryptocurrency
              </Label>
              <Select
                value={newAlert.coin}
                onValueChange={(value) =>
                  setNewAlert({ ...newAlert, coin: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select coin' />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CRYPTOS.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className='flex items-center space-x-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: crypto.icon }}
                        />
                        <span>
                          {crypto.name} ({crypto.symbol})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='type' className='text-card-foreground text-sm'>
                Alert Type
              </Label>
              <Select
                value={newAlert.type}
                onValueChange={(value: "above" | "below") =>
                  setNewAlert({ ...newAlert, type: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='above'>Price Above</SelectItem>
                  <SelectItem value='below'>Price Below</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='price' className='text-card-foreground text-sm'>
                Target Price ($)
              </Label>
              <Input
                id='price'
                type='number'
                placeholder='0.00'
                value={newAlert.targetPrice}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, targetPrice: e.target.value })
                }
                className='bg-input border-border text-foreground w-full'
                step='0.01'
                min='0'
              />
            </div>
          </div>

          <Button
            onClick={handleCreateAlert}
            className='bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto'
            disabled={!newAlert.coin || !newAlert.targetPrice}
          >
            Create Alert
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle className='text-lg lg:text-xl font-heading font-bold text-card-foreground flex items-center justify-between'>
              <span>Active Alerts ({activeAlerts.length})</span>
              <Badge
                variant='outline'
                className='text-blue-500 border-blue-500'
              >
                Monitoring
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 rounded-lg bg-muted/20 border border-border space-y-3 sm:space-y-0'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0 flex-1'>
                    <div className='flex items-center space-x-2'>
                      {alert.type === "above" ? (
                        <TrendingUp className='h-4 w-4 text-green-500 flex-shrink-0' />
                      ) : (
                        <TrendingDown className='h-4 w-4 text-red-500 flex-shrink-0' />
                      )}
                      <span className='font-heading font-bold text-card-foreground text-sm lg:text-base'>
                        {alert.coin}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {alert.coinName}
                      </span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm'>
                      <div className='text-muted-foreground'>
                        Target:{" "}
                        <span className='font-semibold text-foreground'>
                          ${alert.targetPrice.toLocaleString()}
                        </span>
                      </div>
                      {alert.currentPrice && (
                        <div className='text-muted-foreground'>
                          Current:{" "}
                          <span className='font-semibold text-foreground'>
                            $
                            {alert.currentPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <Badge
                      className={`${getStatusColor(
                        alert.status
                      )} text-white text-xs w-fit`}
                    >
                      {alert.status.charAt(0).toUpperCase() +
                        alert.status.slice(1)}
                    </Badge>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDismissAlert(alert.id)}
                      className='text-muted-foreground hover:text-foreground'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteAlert(alert.id)}
                      className='text-red-500 hover:text-red-400 hover:bg-red-500/10'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle className='text-lg lg:text-xl font-heading font-bold text-card-foreground flex items-center justify-between'>
              <span>Triggered Alerts ({triggeredAlerts.length})</span>
              <Badge className='bg-green-500 text-white'>Completed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {triggeredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 rounded-lg bg-green-500/10 border border-green-500/20 space-y-3 sm:space-y-0'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0'>
                    <div className='flex items-center space-x-2'>
                      <TrendingUp className='h-4 w-4 text-green-500 flex-shrink-0' />
                      <span className='font-heading font-bold text-card-foreground text-sm lg:text-base'>
                        {alert.coin}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        Target Hit!
                      </span>
                    </div>

                    <div className='text-xs lg:text-sm text-green-600'>
                      Triggered at ${alert.targetPrice.toLocaleString()}
                    </div>
                  </div>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDeleteAlert(alert.id)}
                    className='text-muted-foreground hover:text-foreground self-end sm:self-center'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {activeAlerts.length === 0 && triggeredAlerts.length === 0 && (
        <Card className='bg-card'>
          <CardContent className='text-center py-6 lg:py-8'>
            <div className='text-muted-foreground'>
              <Bell className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <div className='text-sm lg:text-base'>No active alerts.</div>
              <div className='text-xs lg:text-sm mt-1'>
                Create your first alert above to get started.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
