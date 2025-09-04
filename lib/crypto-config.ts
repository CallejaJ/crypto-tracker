// lib/crypto-config.ts

export interface CryptoConfig {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  coincapId: string;
  binanceSymbol: string;
  cryptocompareSymbol: string;
}

// Verified CoinCap IDs and mappings
export const SUPPORTED_CRYPTOS: CryptoConfig[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    icon: "#f97316",
    coincapId: "bitcoin",
    binanceSymbol: "BTCUSDT",
    cryptocompareSymbol: "BTC",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    icon: "#3b82f6",
    coincapId: "ethereum",
    binanceSymbol: "ETHUSDT",
    cryptocompareSymbol: "ETH",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    icon: "#8b5cf6",
    coincapId: "solana",
    binanceSymbol: "SOLUSDT",
    cryptocompareSymbol: "SOL",
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    icon: "#06b6d4",
    coincapId: "cardano",
    binanceSymbol: "ADAUSDT",
    cryptocompareSymbol: "ADA",
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    icon: "#e91e63",
    coincapId: "polkadot",
    binanceSymbol: "DOTUSDT",
    cryptocompareSymbol: "DOT",
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    icon: "#2563eb",
    coincapId: "chainlink",
    binanceSymbol: "LINKUSDT",
    cryptocompareSymbol: "LINK",
  },
  {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    icon: "#ef4444",
    coincapId: "avalanche",
    binanceSymbol: "AVAXUSDT",
    cryptocompareSymbol: "AVAX",
  },
  {
    id: "polygon",
    symbol: "MATIC",
    name: "Polygon",
    icon: "#7c3aed",
    coincapId: "polygon",
    binanceSymbol: "MATICUSDT",
    cryptocompareSymbol: "MATIC",
  },
];

// Create lookup maps for easy access
export const CRYPTO_BY_ID = SUPPORTED_CRYPTOS.reduce((acc, crypto) => {
  acc[crypto.id] = crypto;
  return acc;
}, {} as Record<string, CryptoConfig>);

export const CRYPTO_BY_SYMBOL = SUPPORTED_CRYPTOS.reduce((acc, crypto) => {
  acc[crypto.symbol] = crypto;
  return acc;
}, {} as Record<string, CryptoConfig>);

// Base prices for simulation (approximate current values)
export const BASE_PRICES: Record<string, number> = {
  bitcoin: 43000,
  ethereum: 2600,
  solana: 98,
  cardano: 0.52,
  polkadot: 7.2,
  chainlink: 15.8,
  "avalanche-2": 38.5,
  polygon: 0.89,
};
