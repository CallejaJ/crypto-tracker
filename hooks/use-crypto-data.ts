"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { cryptoOracle } from "@/lib/crypto-oracle"
import {
  fetchCryptoPrices,
  fetchPortfolioData,
  calculatePortfolioMetrics,
  type CryptoPrice,
  type PortfolioHolding,
} from "@/lib/crypto-api"

const USE_REAL_ORACLE = process.env.NEXT_PUBLIC_USE_REAL_ORACLE === "true"

const fetchRealCryptoPrices = async (): Promise<CryptoPrice[]> => {
  if (USE_REAL_ORACLE) {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1",
      )
      const data = await response.json()

      return data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        icon: coin.image,
      }))
    } catch (error) {
      console.error("Real oracle fetch failed, falling back to mock data:", error)
      return fetchCryptoPrices()
    }
  }
  return fetchCryptoPrices()
}

export function useCryptoPrices() {
  const [realtimePrices, setRealtimePrices] = useState<Record<string, number>>({})

  const { data, error, mutate } = useSWR<CryptoPrice[]>("crypto-prices", fetchRealCryptoPrices, {
    refreshInterval: USE_REAL_ORACLE ? 30000 : 5000, // Real oracle updates less frequently
    revalidateOnFocus: true,
  })

  useEffect(() => {
    if (USE_REAL_ORACLE && data) {
      const coinIds = data.map((coin) => coin.name.toLowerCase().replace(/\s+/g, "-"))

      cryptoOracle.connectWebSocket((prices) => {
        setRealtimePrices(prices)
      })

      // Periodic real-time price updates
      const interval = setInterval(async () => {
        const prices = await cryptoOracle.getRealTimePrices(coinIds)
        setRealtimePrices((prev) => ({ ...prev, ...prices }))
      }, 10000)

      return () => {
        clearInterval(interval)
        cryptoOracle.disconnect()
      }
    }
  }, [data])

  const enrichedData = data?.map((coin) => ({
    ...coin,
    price: realtimePrices[coin.name.toLowerCase().replace(/\s+/g, "-")] || coin.price,
  }))

  return {
    prices: enrichedData || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    isUsingRealOracle: USE_REAL_ORACLE,
  }
}

export function usePortfolioData() {
  const { data, error, mutate } = useSWR<PortfolioHolding[]>("portfolio-data", fetchPortfolioData, {
    refreshInterval: 5000, // Update every 5 seconds
    revalidateOnFocus: true,
  })

  const [metrics, setMetrics] = useState({
    totalValue: 0,
    totalChange24h: 0,
    bestPerformer: null as PortfolioHolding | null,
    worstPerformer: null as PortfolioHolding | null,
  })

  const [localHoldings, setLocalHoldings] = useState<PortfolioHolding[]>([])

  useEffect(() => {
    if (data) {
      setLocalHoldings(data)
      const newMetrics = calculatePortfolioMetrics(data)
      setMetrics(newMetrics)
    }
  }, [data])

  const addHolding = (crypto: { symbol: string; name: string; amount: number; price: number }) => {
    const newHolding: PortfolioHolding = {
      symbol: crypto.symbol,
      name: crypto.name,
      amount: crypto.amount,
      price: crypto.price,
      value: crypto.amount * crypto.price,
      change24h: Math.random() * 20 - 10, // Random change for demo
      icon: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color
    }

    const updatedHoldings = [...localHoldings, newHolding]
    setLocalHoldings(updatedHoldings)

    // Update metrics
    const newMetrics = calculatePortfolioMetrics(updatedHoldings)
    setMetrics(newMetrics)

    console.log("[v0] Added new holding:", newHolding)
  }

  const updateHolding = (symbol: string, newAmount: number) => {
    const updatedHoldings = localHoldings.map((holding) => {
      if (holding.symbol === symbol) {
        return {
          ...holding,
          amount: newAmount,
          value: newAmount * holding.price,
        }
      }
      return holding
    })

    setLocalHoldings(updatedHoldings)

    // Update metrics
    const newMetrics = calculatePortfolioMetrics(updatedHoldings)
    setMetrics(newMetrics)

    console.log("[v0] Updated holding:", symbol, "new amount:", newAmount)
  }

  const removeHolding = (symbol: string) => {
    const updatedHoldings = localHoldings.filter((holding) => holding.symbol !== symbol)
    setLocalHoldings(updatedHoldings)

    // Update metrics
    const newMetrics = calculatePortfolioMetrics(updatedHoldings)
    setMetrics(newMetrics)

    console.log("[v0] Removed holding:", symbol)
  }

  return {
    holdings: localHoldings,
    metrics,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    addHolding,
    updateHolding,
    removeHolding,
  }
}

export function useRealTimeAlerts() {
  const { prices } = useCryptoPrices()
  const [triggeredAlerts, setTriggeredAlerts] = useState<string[]>([])

  useEffect(() => {
    prices.forEach((price) => {
      const alertKey = `${price.symbol.toLowerCase()}-price-alert`

      // Dynamic alert checking based on real prices
      if (price.symbol === "BTC" && price.price > 45000) {
        if (!triggeredAlerts.includes(`${alertKey}-above-45000`)) {
          setTriggeredAlerts((prev) => [...prev, `${alertKey}-above-45000`])
          console.log(`[v0] Real Alert: BTC is above $45,000 at $${price.price.toFixed(2)}`)
        }
      }

      if (price.symbol === "ETH" && price.price < 2200) {
        if (!triggeredAlerts.includes(`${alertKey}-below-2200`)) {
          setTriggeredAlerts((prev) => [...prev, `${alertKey}-below-2200`])
          console.log(`[v0] Real Alert: ETH is below $2,200 at $${price.price.toFixed(2)}`)
        }
      }
    })
  }, [prices, triggeredAlerts])

  return {
    triggeredAlerts,
    clearAlert: (alertId: string) => {
      setTriggeredAlerts((prev) => prev.filter((id) => id !== alertId))
    },
  }
}
