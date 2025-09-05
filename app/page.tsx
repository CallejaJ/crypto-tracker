"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BarChart3,
  Wallet,
  Settings,
  Activity,
  Menu,
  X,
  User,
  Cloud,
  CloudOff,
  Download,
  LogOut,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { AlertNotification } from "@/components/alert-notification";
import { RealTimePriceTicker } from "@/components/real-time-price-ticker";
import { PortfolioHoldings } from "@/components/portfolio-holdings";
import { AuthModal } from "@/components/auth-modal";
import { usePortfolioSync } from "@/hooks/use-portfolio-sync";
import { useCryptoPrices } from "@/hooks/use-crypto-data";
import Link from "next/link";
import { useState, useEffect } from "react";

// Hook para hidratación segura
function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

// Componente de loading para el sidebar
function SidebarLoading() {
  return (
    <div className='p-6'>
      <div className='animate-pulse'>
        <div className='h-8 bg-muted rounded w-3/4 mb-2'></div>
        <div className='h-4 bg-muted rounded w-1/2'></div>
      </div>
    </div>
  );
}

export default function MementoDashboard() {
  const isHydrated = useIsHydrated();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAddHolding, setShowAddHolding] = useState(false);

  const { prices, isUsingRealOracle } = useCryptoPrices();

  const {
    user,
    holdings,
    transactions,
    alerts,
    isLoading,
    isSyncing,
    isOnline,
    lastSync,
    syncQueue,
    addHolding,
    signOut,
    exportData,
    getTotalPortfolioValue,
    getPortfolioPerformance,
  } = usePortfolioSync();

  // No renderizar contenido dinámico hasta después de la hidratación
  if (!isHydrated) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50'>
          <SidebarLoading />
        </div>
        <div className='lg:ml-64'>
          <div className='p-4 lg:p-8'>
            <div className='animate-pulse'>
              <div className='h-8 bg-muted rounded w-1/2 mb-4'></div>
              <div className='h-4 bg-muted rounded w-3/4'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Convertir precios a formato requerido
  const priceMap = prices.reduce((acc, price) => {
    acc[price.symbol] = price.price;
    return acc;
  }, {} as Record<string, number>);

  const portfolioStats = getPortfolioPerformance(priceMap);
  const totalValue = getTotalPortfolioValue(priceMap);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddHolding = async (holdingData: any) => {
    await addHolding({
      symbol: holdingData.symbol,
      name: holdingData.name,
      amount: holdingData.amount,
      averagePrice: holdingData.averagePrice,
      purchaseDate: holdingData.purchaseDate || new Date(),
      notes: holdingData.notes,
    });
    setShowAddHolding(false);
  };

  return (
    <div className='min-h-screen bg-background'>
      <AlertNotification />

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-heading font-black text-sidebar-foreground'>
                Memento
              </h1>
              <p className='text-sm text-sidebar-foreground/70 mt-1'>
                Crypto Portfolio Tracker
              </p>

              {/* Estado de oracle y conexión - Solo mostrar después de hidratación */}
              <div className='flex items-center space-x-2 mt-2'>
                <Badge
                  variant={isUsingRealOracle ? "default" : "secondary"}
                  className='text-xs'
                >
                  {isUsingRealOracle ? "LIVE ORACLE" : "DEMO MODE"}
                </Badge>
                {user && (
                  <Badge
                    variant={isOnline ? "default" : "destructive"}
                    className='text-xs'
                  >
                    {isOnline ? "Synced" : "Local"}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden text-sidebar-foreground'
              onClick={() => setSidebarOpen(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <nav className='px-4 space-y-2'>
          <Button
            variant='ghost'
            className='w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground'
          >
            <BarChart3 className='mr-3 h-4 w-4' />
            Dashboard
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
          >
            <Wallet className='mr-3 h-4 w-4' />
            Portfolio
            {holdings && holdings.length > 0 && (
              <Badge variant='secondary' className='ml-auto text-xs'>
                {holdings.length}
              </Badge>
            )}
          </Button>
          <Link href='/alerts'>
            <Button
              variant='ghost'
              className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
            >
              <Bell className='mr-3 h-4 w-4' />
              Alerts
              {alerts &&
                alerts.filter((a) => a.status === "active").length > 0 && (
                  <Badge variant='destructive' className='ml-auto text-xs'>
                    {alerts.filter((a) => a.status === "active").length}
                  </Badge>
                )}
            </Button>
          </Link>
          <Link href='/analytics'>
            <Button
              variant='ghost'
              className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
            >
              <Activity className='mr-3 h-4 w-4' />
              Analytics
            </Button>
          </Link>
          <Button
            variant='ghost'
            className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
          >
            <Settings className='mr-3 h-4 w-4' />
            Settings
          </Button>
        </nav>

        {/* User section en sidebar - Renderización condicional segura */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border'>
          {user ? (
            <div className='space-y-3'>
              {/* Sync status */}
              <div className='flex items-center justify-between text-xs'>
                <div className='flex items-center space-x-2'>
                  {isOnline ? (
                    <Cloud className='h-3 w-3 text-green-400' />
                  ) : (
                    <CloudOff className='h-3 w-3 text-red-400' />
                  )}
                  <span className='text-sidebar-foreground/70'>
                    {isSyncing ? "Syncing..." : isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                {syncQueue && syncQueue.length > 0 && (
                  <Badge variant='secondary' className='text-xs'>
                    {syncQueue.length} pending
                  </Badge>
                )}
              </div>

              {/* User info */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2 min-w-0 flex-1'>
                  <User className='h-4 w-4 text-sidebar-foreground/70 flex-shrink-0' />
                  <span className='text-sm text-sidebar-foreground truncate'>
                    {user.email?.split("@")[0] || "User"}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleSignOut}
                  className='text-sidebar-foreground/70 hover:text-sidebar-foreground p-1'
                >
                  <LogOut className='h-3 w-3' />
                </Button>
              </div>

              {/* Quick actions */}
              <div className='flex space-x-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={exportData}
                  className='flex-1 text-xs text-sidebar-foreground/70'
                >
                  <Download className='h-3 w-3 mr-1' />
                  Export
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowAuth(true)}
                  className='flex-1 text-xs text-sidebar-foreground/70'
                >
                  <Settings className='h-3 w-3 mr-1' />
                  Account
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <p className='text-xs text-sidebar-foreground/70 text-center'>
                Sign in to sync your portfolio
              </p>
              <Button
                onClick={() => setShowAuth(true)}
                className='w-full text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                size='sm'
              >
                <User className='h-3 w-3 mr-2' />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='lg:ml-64'>
        {/* Mobile header */}
        <div className='lg:hidden bg-background border-b border-border p-4 flex items-center justify-between'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSidebarOpen(true)}
            className='text-foreground'
          >
            <Menu className='h-5 w-5' />
          </Button>
          <h1 className='text-lg font-heading font-bold text-foreground'>
            Crypto Portfolio Tracker
          </h1>

          {/* Mobile user actions - Simplificado para evitar hidratación */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowAuth(true)}
            className='p-1'
          >
            <User className='h-4 w-4' />
          </Button>
        </div>

        <div className='p-4 lg:p-8'>
          {/* Sync status banner - Solo mostrar si hay datos */}
          {user && !isOnline && syncQueue && syncQueue.length > 0 && (
            <div className='mb-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='h-4 w-4 text-yellow-400' />
                <span className='text-yellow-300 text-sm'>
                  You're offline. {syncQueue.length} changes will sync when
                  connection returns.
                </span>
              </div>
            </div>
          )}

          {/* Header with Real-time Ticker */}
          <div className='mb-6 lg:mb-8'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4'>
              <div className='mb-4 lg:mb-0'>
                <h2 className='text-2xl lg:text-3xl font-heading font-black text-foreground mb-2'>
                  Portfolio Overview
                </h2>
                <div className='flex items-center space-x-4'>
                  <p className='text-sm lg:text-base text-muted-foreground'>
                    Track your cryptocurrency investments and market performance
                  </p>
                  {user && lastSync && (
                    <p className='text-xs text-muted-foreground'>
                      Last sync: {lastSync.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex items-center space-x-2'>
                {holdings && holdings.length > 0 && (
                  <Button
                    onClick={() => setShowAddHolding(true)}
                    className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                    size='sm'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Holding
                  </Button>
                )}
              </div>
            </div>

            <div className='p-3 lg:p-4 rounded-lg bg-card border border-border overflow-x-auto'>
              <RealTimePriceTicker />
            </div>
          </div>

          {/* Portfolio Stats Cards - Solo mostrar si hay holdings */}
          {holdings && holdings.length > 0 && (
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
              <div className='p-4 rounded-lg bg-card border border-border'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Total Value</p>
                    <p className='text-lg lg:text-xl font-bold text-foreground'>
                      $
                      {totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <DollarSign className='h-6 w-6 text-green-400' />
                </div>
              </div>

              <div className='p-4 rounded-lg bg-card border border-border'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Invested</p>
                    <p className='text-lg lg:text-xl font-bold text-foreground'>
                      $
                      {portfolioStats.totalInvested.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <DollarSign className='h-6 w-6 text-blue-400' />
                </div>
              </div>

              <div className='p-4 rounded-lg bg-card border border-border'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>P&L</p>
                    <p
                      className={`text-lg lg:text-xl font-bold ${
                        portfolioStats.totalGainLoss >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {portfolioStats.totalGainLoss >= 0 ? "+" : ""}$
                      {portfolioStats.totalGainLoss.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  {portfolioStats.totalGainLoss >= 0 ? (
                    <TrendingUp className='h-6 w-6 text-green-400' />
                  ) : (
                    <TrendingDown className='h-6 w-6 text-red-400' />
                  )}
                </div>
              </div>

              <div className='p-4 rounded-lg bg-card border border-border'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>P&L %</p>
                    <p
                      className={`text-lg lg:text-xl font-bold ${
                        portfolioStats.totalGainLossPercentage >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {portfolioStats.totalGainLossPercentage >= 0 ? "+" : ""}
                      {portfolioStats.totalGainLossPercentage.toFixed(2)}%
                    </p>
                  </div>
                  {portfolioStats.totalGainLossPercentage >= 0 ? (
                    <TrendingUp className='h-6 w-6 text-green-400' />
                  ) : (
                    <TrendingDown className='h-6 w-6 text-red-400' />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Holdings Component */}
          <PortfolioHoldings />

          {/* Modal de autenticación */}
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

          {/* Modal simplificado para agregar holding */}
          {showAddHolding && (
            <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
              <div className='w-full max-w-md mx-4 p-6 bg-card border border-border rounded-lg'>
                <h3 className='text-xl font-bold text-foreground mb-4'>
                  Add New Holding
                </h3>
                <p className='text-muted-foreground mb-4'>
                  This is a simplified demo. The full version would include a
                  complete form.
                </p>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => setShowAddHolding(false)}
                    variant='outline'
                    className='flex-1'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddHolding({
                        symbol: "BTC",
                        name: "Bitcoin",
                        amount: 0.1,
                        averagePrice: 45000,
                        purchaseDate: new Date(),
                        notes: "Demo holding",
                      });
                    }}
                    className='flex-1 bg-gradient-to-r from-green-600 to-blue-600'
                  >
                    Add Demo BTC
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
