"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Bell, Activity, Edit } from "lucide-react";
import { AddCryptoModalFixed as AddCryptoModal } from "./add-crypto-modal-fixed";
import { EditHoldingModal } from "./edit-holding-modal";
import { useState } from "react";
import Link from "next/link";
import { usePortfolioData } from "@/hooks/use-crypto-data";
import Image from "next/image";

// Crypto icon URLs (CoinGecko provides free access)
const CRYPTO_ICON_URLS: Record<string, string> = {
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

// Crypto icon component with fallback
function CryptoIcon({
  symbol,
  size = 40,
  className = "",
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const iconUrl = CRYPTO_ICON_URLS[symbol];
  const [imageError, setImageError] = useState(false);

  if (!iconUrl || imageError) {
    // Fallback to colored circle
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
          width: size,
          height: size,
        }}
      >
        <span className='text-white font-bold text-xs lg:text-sm'>
          {symbol}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconUrl}
        alt={`${symbol} icon`}
        fill
        className='rounded-full object-cover'
        onError={() => setImageError(true)}
        sizes={`${size}px`}
      />
    </div>
  );
}

export function PortfolioHoldings() {
  const {
    holdings,
    metrics,
    isLoading,
    addHolding,
    updateHolding,
    removeHolding,
  } = usePortfolioData();
  const [editingHolding, setEditingHolding] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddCrypto = (crypto: {
    symbol: string;
    name: string;
    amount: number;
    price: number;
  }) => {
    addHolding(crypto);
  };

  const handleEditHolding = (holding: any) => {
    setEditingHolding(holding);
    setEditModalOpen(true);
  };

  const handleUpdateHolding = (symbol: string, newAmount: number) => {
    updateHolding(symbol, newAmount);
  };

  const handleRemoveHolding = (symbol: string) => {
    removeHolding(symbol);
  };

  if (isLoading) {
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
              {metrics.totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              {metrics.totalChange24h > 0 ? (
                <TrendingUp className='h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1' />
              ) : (
                <TrendingDown className='h-3 w-3 lg:h-4 lg:w-4 text-red-500 mr-1' />
              )}
              <span
                className={`text-xs lg:text-sm ${
                  metrics.totalChange24h > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {metrics.totalChange24h > 0 ? "+" : ""}
                {metrics.totalChange24h.toFixed(1)}%
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
            <div className='text-lg lg:text-2xl font-heading font-black text-card-foreground'>
              +$
              {(metrics.totalValue * 0.173).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              <TrendingUp className='h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1' />
              <span className='text-xs lg:text-sm text-green-500'>+17.3%</span>
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
              7
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              <Bell className='h-3 w-3 lg:h-4 lg:w-4 text-primary mr-1' />
              <span className='text-xs lg:text-sm text-muted-foreground'>
                2 triggered
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
              {metrics.bestPerformer?.symbol || "ETH"}
            </div>
            <div className='flex items-center mt-1 lg:mt-2'>
              <TrendingUp className='h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1' />
              <span className='text-xs lg:text-sm text-green-500'>
                +{metrics.bestPerformer?.change24h.toFixed(1) || "18.3"}%
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
            {holdings.map((holding) => (
              <div
                key={holding.symbol}
                className='flex items-center justify-between p-3 lg:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'
              >
                <div className='flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1'>
                  {/* Real crypto icon with hover effect */}
                  <CryptoIcon
                    symbol={holding.symbol}
                    size={window.innerWidth < 768 ? 32 : 40}
                    className='hover:scale-105 transition-transform flex-shrink-0'
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
              <AddCryptoModal onAddCrypto={handleAddCrypto} />
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
