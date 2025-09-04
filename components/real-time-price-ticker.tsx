// components/real-time-price-ticker.tsx
"use client";

import {
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCryptoPrices } from "@/hooks/use-crypto-data";

export function RealTimePriceTicker() {
  const { prices, isLoading, isError, isUsingRealOracle, lastUpdate, refetch } =
    useCryptoPrices();

  if (isLoading) {
    return (
      <div className='flex items-center space-x-2 text-muted-foreground'>
        <div className='animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full' />
        <span className='text-sm'>Loading prices...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center space-x-2 text-red-500'>
        <WifiOff className='h-4 w-4' />
        <span className='text-sm'>Connection error</span>
        <Button
          variant='ghost'
          size='sm'
          onClick={refetch}
          className='h-6 px-2 text-red-500 hover:text-red-400'
        >
          <RefreshCw className='h-3 w-3' />
        </Button>
      </div>
    );
  }

  const displayPrices = prices.slice(0, 4); // Show top 4 prices

  return (
    <div className='flex items-center space-x-6'>
      <div className='flex items-center space-x-2'>
        {isUsingRealOracle ? (
          <>
            <Wifi className='h-4 w-4 text-green-500' />
            <Badge
              variant='outline'
              className='text-green-500 border-green-500 text-xs'
            >
              Live Oracle
            </Badge>
          </>
        ) : (
          <>
            <Database className='h-4 w-4 text-blue-500' />
            <Badge
              variant='outline'
              className='text-blue-500 border-blue-500 text-xs'
            >
              Demo Mode
            </Badge>
          </>
        )}
      </div>

      <div className='flex items-center space-x-4'>
        {displayPrices.map((priceData) => (
          <div
            key={priceData.symbol}
            className='flex items-center space-x-2 min-w-0'
          >
            <div
              className='w-4 h-4 rounded-full flex-shrink-0'
              style={{ backgroundColor: priceData.icon }}
            />
            <span className='font-bold text-foreground text-sm'>
              {priceData.symbol}
            </span>
            <span className='text-foreground font-medium text-sm'>
              $
              {priceData.price.toLocaleString(undefined, {
                minimumFractionDigits: priceData.price < 1 ? 4 : 2,
                maximumFractionDigits: priceData.price < 1 ? 4 : 2,
              })}
            </span>
            <div className='flex items-center'>
              {priceData.change24h > 0 ? (
                <TrendingUp className='h-3 w-3 text-green-500 mr-1' />
              ) : (
                <TrendingDown className='h-3 w-3 text-red-500 mr-1' />
              )}
              <span
                className={`text-xs ${
                  priceData.change24h > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceData.change24h > 0 ? "+" : ""}
                {priceData.change24h.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
        <span>{isUsingRealOracle ? "Live" : "Demo"}</span>
        <span>•</span>
        <span>{lastUpdate.toLocaleTimeString()}</span>
        <Button
          variant='ghost'
          size='sm'
          onClick={refetch}
          className='h-6 px-2 text-muted-foreground hover:text-foreground'
        >
          <RefreshCw className='h-3 w-3' />
        </Button>
      </div>
    </div>
  );
}
