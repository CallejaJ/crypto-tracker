// components/real-time-price-ticker.tsx
"use client";

import { useCryptoPrices } from "@/hooks/use-crypto-data";
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

export function RealTimePriceTicker() {
  const { prices, isLoading, isError, isUsingRealOracle, lastUpdate, refetch } =
    useCryptoPrices();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center space-x-2 text-muted-foreground py-2'>
        <div className='animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full' />
        <span className='text-sm'>Loading prices...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center space-x-2 text-red-500 py-2'>
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

  // Show different number of prices based on screen size
  const displayPrices = prices.slice(
    0,
    window?.innerWidth < 768 ? 2 : window?.innerWidth < 1024 ? 3 : 4
  );

  return (
    <div className='flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-6'>
      {/* Oracle Status */}
      <div className='flex items-center space-x-2 flex-shrink-0'>
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

      {/* Prices Grid - responsive */}
      <div className='grid grid-cols-2 lg:flex lg:items-center gap-3 lg:gap-4 w-full lg:w-auto'>
        {displayPrices.map((priceData) => (
          <div
            key={priceData.symbol}
            className='flex flex-col lg:flex-row lg:items-center lg:space-x-2 min-w-0 bg-muted/10 lg:bg-transparent p-2 lg:p-0 rounded lg:rounded-none'
          >
            <div className='flex items-center space-x-2 mb-1 lg:mb-0'>
              <div
                className='w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0'
                style={{ backgroundColor: priceData.icon }}
              />
              <span className='font-bold text-foreground text-xs lg:text-sm'>
                {priceData.symbol}
              </span>
            </div>

            <div className='flex flex-col lg:flex-row lg:items-center lg:space-x-2'>
              <span className='text-foreground font-medium text-xs lg:text-sm'>
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
          </div>
        ))}
      </div>

      {/* Timestamp and Refresh */}
      <div className='flex items-center justify-between lg:justify-start w-full lg:w-auto space-x-2 text-xs text-muted-foreground'>
        <div className='flex items-center space-x-2'>
          <span>{isUsingRealOracle ? "Live" : "Demo"}</span>
          <span>•</span>
          <span className='hidden sm:inline'>
            {lastUpdate.toLocaleTimeString()}
          </span>
          <span className='sm:hidden'>
            {lastUpdate.toLocaleTimeString([], { timeStyle: "short" })}
          </span>
        </div>
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
