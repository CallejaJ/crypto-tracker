"use client"

import { useState, useEffect } from "react"
import { cryptoOracle } from "@/lib/crypto-oracle"
import useSWR from "swr"

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
}

export function useRealCryptoData() {
  const [realtimePrices, setRealtimePrices] = useState<Record<string, number>>({})

  // Fetch initial data with SWR
  const {
    data: cryptoData,
    error,
    mutate,
  } = useSWR<CryptoPrice[]>(
    "crypto-prices",
    async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
      )
      return response.json()
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    },
  )

  // WebSocket for real-time updates
  useEffect(() => {
    const coinIds = cryptoData?.map((coin) => coin.id) || []

    if (coinIds.length > 0) {
      // Connect to WebSocket for real-time prices
      cryptoOracle.connectWebSocket((prices) => {
        setRealtimePrices(prices)
      })

      // Periodic API updates
      const interval = setInterval(async () => {
        const prices = await cryptoOracle.getRealTimePrices(coinIds)
        setRealtimePrices((prev) => ({ ...prev, ...prices }))
      }, 10000) // Every 10 seconds

      return () => {
        clearInterval(interval)
        cryptoOracle.disconnect()
      }
    }
  }, [cryptoData])

  // Merge API data with real-time prices
  const enrichedData = cryptoData?.map((coin) => ({
    ...coin,
    current_price: realtimePrices[coin.id] || coin.current_price,
  }))

  return {
    data: enrichedData,
    realtimePrices,
    isLoading: !cryptoData && !error,
    error,
  }
}
