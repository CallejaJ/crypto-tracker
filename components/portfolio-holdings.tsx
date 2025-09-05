// components/portfolio-holdings.tsx (SIN ERRORES DE HIDRATACIÓN)
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Edit, Activity, Bell } from "lucide-react";
import Link from "next/link";
import { usePortfolioSync } from "@/hooks/use-portfolio-sync";
import { useCryptoPrices } from "@/hooks/use-crypto-data";
import { AddCryptoModalFixed } from "./add-crypto-modal-fixed";
import { EditHoldingModal } from "./edit-holding-modal";

// Hook para hidratación segura
function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

// Componente para icono de crypto (sin lógica de cliente)
function CryptoIcon({
  symbol,
  className = "h-10 w-10 lg:h-10 lg:w-10",
}: {
  symbol: string;
  className?: string;
}) {
  const [iconError, setIconError] = useState(false);

  // URLs de iconos de CoinGecko
  const iconUrls: Record<string, string> = {
    BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    ADA: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    DOT: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    LINK: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    AVAX: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    MATIC:
      "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
  };

  const iconUrl = iconUrls[symbol];

  if (iconError || !iconUrl) {
    const colors: Record<string, string> = {
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
        style={{ backgroundColor: colors[symbol] || "#6b7280" }}
      >
        <span className='text-white font-bold text-xs'>{symbol}</span>
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      className={`${className} rounded-full`}
      onError={() => setIconError(true)}
    />
  );
}

// Componente de loading que es idéntico en servidor y cliente
function LoadingCards() {
  return (
    <div className='space-y-4 lg:space-y-6'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-card'>
            <CardContent className='p-4 lg:p-6'>
              <div className='animate-pulse'>
                <div className='h-3 lg:h-4 bg-muted rounded w-3/4 mb-2'></div>
                <div className='h-6 lg:h-8 bg-muted rounded w-1/2 mb-2'></div>
                <div className='h-3 lg:h-4 bg-muted rounded w-1/4'></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PortfolioHoldings() {
  const isHydrated = useIsHydrated();
  const { prices } = useCryptoPrices();
  const {
    holdings,
    alerts,
    isLoading,
    addHolding,
    updateHolding,
    deleteHolding,
    getTotalPortfolioValue,
    getPortfolioPerformance,
  } = usePortfolioSync();

  const [editingHolding, setEditingHolding] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Si no está hidratado o está cargando, mostrar loading
  if (!isHydrated || isLoading) {
    return <LoadingCards />;
  }

  // Convertir precios a formato necesario
  const priceMap = prices.reduce((acc, price) => {
    acc[price.symbol] = price.price;
    return acc;
  }, {} as Record<string, number>);

  // Calcular métricas del portfolio
  const portfolioStats = getPortfolioPerformance(priceMap);
  const totalValue = getTotalPortfolioValue(priceMap);

  // Convertir holdings de sync a formato de tu componente actual
  const formattedHoldings = holdings.map((holding) => {
    const currentPrice = priceMap[holding.symbol] || holding.averagePrice;
    const value = holding.amount * currentPrice;
    const change24h =
      ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100;

    return {
      symbol: holding.symbol,
      name: holding.name,
      amount: holding.amount,
      value: value,
      change24h: change24h,
      price: currentPrice,
    };
  });

  // Encontrar mejor performer
  const bestPerformer = formattedHoldings.reduce((best, current) => {
    return current.change24h > (best?.change24h || -Infinity) ? current : best;
  }, formattedHoldings[0]);

  // Calcular cambio total 24h del portfolio
  const totalChange24h =
    portfolioStats.totalInvested > 0
      ? ((totalValue - portfolioStats.totalInvested) /
          portfolioStats.totalInvested) *
        100
      : 0;

  const handleAddCrypto = async (crypto: {
    symbol: string;
    name: string;
    amount: number;
    price: number;
  }) => {
    await addHolding({
      symbol: crypto.symbol,
      name: crypto.name,
      amount: crypto.amount,
      averagePrice: crypto.price,
      purchaseDate: new Date(),
      notes: `Added via quick add`,
    });
  };

  const handleEditHolding = (holding: any) => {
    const syncHolding = holdings.find((h) => h.symbol === holding.symbol);
    setEditingHolding(syncHolding);
    setEditModalOpen(true);
  };

  const handleUpdateHolding = async (symbol: string, newAmount: number) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (holding) {
      await updateHolding(holding.id, { amount: newAmount });
    }
  };

  const handleRemoveHolding = async (symbol: string) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (holding) {
      await deleteHolding(holding.id);
    }
  };

  return (
    <div className='space-y-4 lg:space-y-6'>
      {/* Portfolio Summary Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6'>
        <Card className='bg-card'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xs lg:text-sm font-medium text-card-foreground'>
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent className='pb-3 lg:pb-4'>
            <div className='text-lg lg:text-2xl font-heading font-black text-card-foreground'>
              $
              {totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              {totalChange24h > 0 ? (
                <TrendingUp className='h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1' />
              ) : (
                <TrendingDown className='h-3 w-3 lg:h-4 lg:w-4 text-red-500 mr-1' />
              )}
              <span
                className={`text-xs lg:text-sm ${
                  totalChange24h > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {totalChange24h > 0 ? "+" : ""}
                {totalChange24h.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xs lg:text-sm font-medium text-card-foreground'>
              Total Profit/Loss
            </CardTitle>
          </CardHeader>
          <CardContent className='pb-3 lg:pb-4'>
            <div
              className={`text-lg lg:text-2xl font-heading font-black ${
                portfolioStats.totalGainLoss >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {portfolioStats.totalGainLoss >= 0 ? "+" : ""}$
              {Math.abs(portfolioStats.totalGainLoss).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 0,
                }
              )}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              {portfolioStats.totalGainLossPercentage >= 0 ? (
                <TrendingUp className='h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1' />
              ) : (
                <TrendingDown className='h-3 w-3 lg:h-4 lg:w-4 text-red-500 mr-1' />
              )}
              <span
                className={`text-xs lg:text-sm ${
                  portfolioStats.totalGainLossPercentage >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {portfolioStats.totalGainLossPercentage >= 0 ? "+" : ""}
                {portfolioStats.totalGainLossPercentage.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xs lg:text-sm font-medium text-card-foreground'>
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className='pb-3 lg:pb-4'>
            <div className='text-lg lg:text-2xl font-heading font-black text-card-foreground'>
              {alerts.filter((a) => a.status === "active").length}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              <Bell className='h-3 w-3 lg:h-4 lg:w-4 text-primary mr-1' />
              <span className='text-xs lg:text-sm text-muted-foreground'>
                {alerts.filter((a) => a.status === "triggered").length}{" "}
                triggered
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xs lg:text-sm font-medium text-card-foreground'>
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent className='pb-3 lg:pb-4'>
            <div className='text-lg lg:text-2xl font-heading font-black text-card-foreground'>
              {bestPerformer?.symbol || "N/A"}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              {(bestPerformer?.change24h || 0) >= 0 ? (
                <TrendingUp className='h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1' />
              ) : (
                <TrendingDown className='h-3 w-3 lg:h-4 lg:w-4 text-red-500 mr-1' />
              )}
              <span
                className={`text-xs lg:text-sm ${
                  (bestPerformer?.change24h || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {(bestPerformer?.change24h || 0) >= 0 ? "+" : ""}
                {(bestPerformer?.change24h || 0).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className='bg-card'>
        <CardHeader>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <CardTitle className='text-lg lg:text-xl font-heading font-bold text-card-foreground'>
              Your Holdings
            </CardTitle>
            <Link href='/analytics'>
              <Button
                variant='outline'
                size='sm'
                className='border-border text-foreground bg-transparent w-full sm:w-auto'
              >
                <Activity className='mr-2 h-4 w-4' />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3 lg:space-y-4'>
            {formattedHoldings.map((holding) => (
              <div
                key={holding.symbol}
                className='flex items-center justify-between p-3 lg:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'
              >
                <div className='flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1'>
                  <CryptoIcon
                    symbol={holding.symbol}
                    className='hover:scale-105 transition-transform flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10'
                  />
                  <div className='min-w-0 flex-1'>
                    <h3 className='font-heading font-bold text-card-foreground text-sm lg:text-base truncate'>
                      {holding.name}
                    </h3>
                    <p className='text-xs lg:text-sm text-muted-foreground truncate'>
                      {holding.amount.toFixed(2)} {holding.symbol}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-2 lg:space-x-4'>
                  <div className='text-right'>
                    <p className='font-heading font-bold text-card-foreground text-sm lg:text-base'>
                      $
                      {holding.value.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <div className='flex items-center justify-end'>
                      {holding.change24h > 0 ? (
                        <TrendingUp className='h-3 w-3 text-green-500 mr-1' />
                      ) : (
                        <TrendingDown className='h-3 w-3 text-red-500 mr-1' />
                      )}
                      <span
                        className={`text-xs lg:text-sm ${
                          holding.change24h > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {holding.change24h > 0 ? "+" : ""}
                        {holding.change24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleEditHolding(holding)}
                    className='text-muted-foreground hover:text-foreground p-1 lg:p-2'
                  >
                    <Edit className='h-3 w-3 lg:h-4 lg:w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-4 lg:mt-6 flex flex-col sm:flex-row gap-3 lg:gap-4'>
            <div className='flex-1'>
              <AddCryptoModalFixed onAddCrypto={handleAddCrypto} />
            </div>
            <Link href='/alerts' className='flex-1 sm:flex-initial'>
              <Button
                variant='outline'
                className='border-border text-foreground bg-transparent w-full sm:w-auto'
              >
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
  );
}
