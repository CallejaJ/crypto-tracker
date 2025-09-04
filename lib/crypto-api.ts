// Simulated cryptocurrency API service
export interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  lastUpdated: Date
}

export interface PortfolioHolding {
  symbol: string
  name: string
  amount: number
  price: number
  value: number
  change24h: number
  icon: string
}

// Mock data that simulates real-time price updates
const mockPrices: Record<string, CryptoPrice> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43200,
    change24h: 5.2,
    marketCap: 847000000000,
    volume24h: 28500000000,
    lastUpdated: new Date(),
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 2300,
    change24h: 18.3,
    marketCap: 276000000000,
    volume24h: 15200000000,
    lastUpdated: new Date(),
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    price: 114,
    change24h: -2.1,
    marketCap: 51000000000,
    volume24h: 2100000000,
    lastUpdated: new Date(),
  },
}

// Simulate real-time price fluctuations
const simulatePriceUpdate = (currentPrice: number): number => {
  const volatility = 0.02 // 2% max change per update
  const change = (Math.random() - 0.5) * 2 * volatility
  return currentPrice * (1 + change)
}

export const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Update prices with random fluctuations
  Object.keys(mockPrices).forEach((symbol) => {
    const crypto = mockPrices[symbol]
    const oldPrice = crypto.price
    crypto.price = simulatePriceUpdate(crypto.price)
    crypto.change24h = ((crypto.price - oldPrice) / oldPrice) * 100
    crypto.lastUpdated = new Date()
  })

  return Object.values(mockPrices)
}

export const fetchPortfolioData = async (): Promise<PortfolioHolding[]> => {
  const prices = await fetchCryptoPrices()

  const holdings: PortfolioHolding[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.5432,
      price: prices.find((p) => p.symbol === "BTC")?.price || 43200,
      value: 0,
      change24h: prices.find((p) => p.symbol === "BTC")?.change24h || 5.2,
      icon: "#f97316",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 8.234,
      price: prices.find((p) => p.symbol === "ETH")?.price || 2300,
      value: 0,
      change24h: prices.find((p) => p.symbol === "ETH")?.change24h || 18.3,
      icon: "#3b82f6",
    },
    {
      symbol: "SOL",
      name: "Solana",
      amount: 45.67,
      price: prices.find((p) => p.symbol === "SOL")?.price || 114,
      value: 0,
      change24h: prices.find((p) => p.symbol === "SOL")?.change24h || -2.1,
      icon: "#8b5cf6",
    },
  ]

  // Calculate values
  holdings.forEach((holding) => {
    holding.value = holding.amount * holding.price
  })

  return holdings
}

export const calculatePortfolioMetrics = (holdings: PortfolioHolding[]) => {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)
  const totalChange24h = holdings.reduce((sum, holding) => {
    const weight = holding.value / totalValue
    return sum + holding.change24h * weight
  }, 0)

  return {
    totalValue,
    totalChange24h,
    bestPerformer: holdings.reduce((best, current) => (current.change24h > best.change24h ? current : best)),
    worstPerformer: holdings.reduce((worst, current) => (current.change24h < worst.change24h ? current : worst)),
  }
}
