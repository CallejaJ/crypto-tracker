// hooks/use-crypto-data.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { improvedCryptoOracle } from "@/lib/improved-crypto-oracle";
import { SUPPORTED_CRYPTOS, BASE_PRICES } from "@/lib/crypto-config";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
  icon: string;
}

interface Holding {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number;
  change24h: number;
  icon: string;
}

interface PortfolioMetrics {
  totalValue: number;
  totalChange24h: number;
  bestPerformer: { symbol: string; change24h: number } | null;
  worstPerformer: { symbol: string; change24h: number } | null;
}

// Check if we should use real oracle data
const isUsingRealOracle = () => {
  const envValue =
    process.env.NEXT_PUBLIC_USE_REAL_ORACLE ||
    process.env.PUBLIC_USE_REAL_ORACLE ||
    "false";

  return envValue !== "false" && envValue !== "demo";
};

// Main crypto prices hook
export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const realOracle = isUsingRealOracle();

  // Default crypto list from configuration
  const defaultCryptos = SUPPORTED_CRYPTOS;

  // Fetch prices function
  const fetchPrices = async () => {
    try {
      setIsError(false);

      if (realOracle) {
        // Use real API - improved oracle with Binance
        const coinIds = defaultCryptos.map((c) => c.id);
        const priceData = await improvedCryptoOracle.getSimplePrices(coinIds);
        const marketData = await improvedCryptoOracle.getMarketData(coinIds);

        const processedPrices: CryptoPrice[] = defaultCryptos.map((crypto) => {
          const price = priceData[crypto.id] || BASE_PRICES[crypto.id] || 100;
          const market = marketData[crypto.id];

          return {
            id: crypto.id,
            symbol: crypto.symbol,
            name: crypto.name,
            price: price,
            change24h: market?.changePercent24Hr || (Math.random() - 0.5) * 10,
            marketCap: market?.marketCap,
            volume24h: market?.volume24h,
            icon: crypto.icon,
          };
        });

        setPrices(processedPrices);
        console.log(`✅ Loaded ${processedPrices.length} crypto prices`);
      } else {
        // Use simulated data with more realistic base prices
        const simulatedPrices: CryptoPrice[] = defaultCryptos.map((crypto) => {
          const basePrice = BASE_PRICES[crypto.id] || 100;

          return {
            id: crypto.id,
            symbol: crypto.symbol,
            name: crypto.name,
            price: basePrice + (Math.random() - 0.5) * basePrice * 0.05, // ±5% variation
            change24h: (Math.random() - 0.5) * 15, // ±15% change
            marketCap: Math.random() * 1000000000,
            volume24h: Math.random() * 100000000,
            icon: crypto.icon,
          };
        });

        setPrices(simulatedPrices);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch crypto prices:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, []);

  // Set up periodic updates and WebSocket
  useEffect(() => {
    const interval = setInterval(fetchPrices, realOracle ? 30000 : 5000); // 30s for real, 5s for demo

    // WebSocket for real-time updates (only for real oracle)
    if (realOracle && typeof window !== "undefined") {
      const coinIds = defaultCryptos.map((c) => c.id);

      // Add a delay to avoid connection issues
      const wsTimeout = setTimeout(() => {
        improvedCryptoOracle.connectWebSocket(coinIds, (newPrices) => {
          setPrices((prevPrices) =>
            prevPrices.map((price) => ({
              ...price,
              price: newPrices[price.id] || price.price,
            }))
          );
          setLastUpdate(new Date());
        });
      }, 2000); // Increased delay

      return () => {
        clearInterval(interval);
        clearTimeout(wsTimeout);
        improvedCryptoOracle.disconnect();
      };
    }

    return () => {
      clearInterval(interval);
    };
  }, [realOracle]);

  return {
    prices,
    isLoading,
    isError,
    isUsingRealOracle: realOracle,
    lastUpdate,
    refetch: fetchPrices,
  };
}

// Portfolio data hook
export function usePortfolioData() {
  const { prices, isLoading: pricesLoading } = useCryptoPrices();
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    // Initialize with some default holdings
    return [
      {
        symbol: "BTC",
        name: "Bitcoin",
        amount: 0.5,
        price: 43000,
        value: 21500,
        change24h: 2.5,
        icon: "#f97316",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: 8.2,
        price: 2600,
        value: 21320,
        change24h: 5.2,
        icon: "#3b82f6",
      },
      {
        symbol: "SOL",
        name: "Solana",
        amount: 52,
        price: 98,
        value: 5096,
        change24h: -2.1,
        icon: "#8b5cf6",
      },
    ];
  });

  // Update holdings with current prices
  useEffect(() => {
    if (!pricesLoading && prices.length > 0) {
      setHoldings((prevHoldings) =>
        prevHoldings.map((holding) => {
          const priceData = prices.find((p) => p.symbol === holding.symbol);
          if (priceData) {
            return {
              ...holding,
              price: priceData.price,
              value: holding.amount * priceData.price,
              change24h: priceData.change24h,
              icon: priceData.icon,
            };
          }
          return holding;
        })
      );
    }
  }, [prices, pricesLoading]);

  // Calculate portfolio metrics
  const metrics = useMemo((): PortfolioMetrics => {
    const totalValue = holdings.reduce(
      (sum, holding) => sum + holding.value,
      0
    );

    // Calculate weighted average change
    const totalChange24h = holdings.reduce((sum, holding) => {
      const weight = holding.value / totalValue;
      return sum + holding.change24h * weight;
    }, 0);

    // Find best and worst performers
    const bestPerformer = holdings.reduce(
      (best, current) =>
        !best || current.change24h > best.change24h ? current : best,
      null as Holding | null
    );

    const worstPerformer = holdings.reduce(
      (worst, current) =>
        !worst || current.change24h < worst.change24h ? current : worst,
      null as Holding | null
    );

    return {
      totalValue,
      totalChange24h,
      bestPerformer: bestPerformer
        ? { symbol: bestPerformer.symbol, change24h: bestPerformer.change24h }
        : null,
      worstPerformer: worstPerformer
        ? { symbol: worstPerformer.symbol, change24h: worstPerformer.change24h }
        : null,
    };
  }, [holdings]);

  // Portfolio management functions
  const addHolding = (crypto: {
    symbol: string;
    name: string;
    amount: number;
    price: number;
  }) => {
    const newHolding: Holding = {
      ...crypto,
      value: crypto.amount * crypto.price,
      change24h: 0,
      icon: prices.find((p) => p.symbol === crypto.symbol)?.icon || "#6b7280",
    };
    setHoldings((prev) => [...prev, newHolding]);
  };

  const updateHolding = (symbol: string, newAmount: number) => {
    setHoldings((prev) =>
      prev.map((holding) =>
        holding.symbol === symbol
          ? { ...holding, amount: newAmount, value: newAmount * holding.price }
          : holding
      )
    );
  };

  const removeHolding = (symbol: string) => {
    setHoldings((prev) => prev.filter((holding) => holding.symbol !== symbol));
  };

  return {
    holdings,
    metrics,
    isLoading: pricesLoading,
    addHolding,
    updateHolding,
    removeHolding,
  };
}
