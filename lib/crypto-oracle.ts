// Real oracle integration for live crypto data
export class CryptoOracle {
  private baseUrl = "https://api.coingecko.com/api/v3"
  private wsUrl = "wss://ws.coincap.io/prices"
  private ws: WebSocket | null = null

  // Get real-time prices from CoinGecko API
  async getRealTimePrices(coinIds: string[]): Promise<Record<string, number>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd&include_24hr_change=true`,
      )
      const data = await response.json()

      // Transform to our format
      const prices: Record<string, number> = {}
      Object.entries(data).forEach(([coinId, priceData]: [string, any]) => {
        prices[coinId] = priceData.usd
      })

      return prices
    } catch (error) {
      console.error("Oracle fetch error:", error)
      return {}
    }
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onPriceUpdate: (prices: Record<string, number>) => void) {
    this.ws = new WebSocket(this.wsUrl)

    this.ws.onmessage = (event) => {
      try {
        const prices = JSON.parse(event.data)
        onPriceUpdate(prices)
      } catch (error) {
        console.error("WebSocket parse error:", error)
      }
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  // Chainlink price feed integration (for on-chain data)
  async getChainlinkPrice(priceFeedAddress: string): Promise<number> {
    // This would require Web3 integration
    // Example for ETH/USD: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    try {
      // Web3 call to Chainlink aggregator contract
      // const contract = new ethers.Contract(priceFeedAddress, ABI, provider)
      // const price = await contract.latestRoundData()
      // return price.answer / 1e8 // Chainlink uses 8 decimals

      // Placeholder for now
      return 0
    } catch (error) {
      console.error("Chainlink oracle error:", error)
      return 0
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const cryptoOracle = new CryptoOracle()
