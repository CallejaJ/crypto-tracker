# Memento - Cryptocurrency Portfolio Tracker

A modern, professional cryptocurrency portfolio tracker with real-time price alerts, advanced analytics, and comprehensive portfolio management features powered by reliable free APIs.

## 🚀 Features

### Core Portfolio Management

- **Real-time Portfolio Tracking**: Monitor your cryptocurrency holdings with live price updates from Binance API
- **Multi-currency Support**: Track Bitcoin, Ethereum, Solana, Cardano, Polkadot, Chainlink, Avalanche, and Polygon
- **Portfolio Analytics**: Comprehensive performance metrics including 24h/7d/30d returns
- **Holdings Management**: Add, edit, and remove cryptocurrencies from your portfolio with real crypto icons

### Price Alert System

- **Smart Alerts**: Set price targets with "above" and "below" thresholds
- **Real-time Notifications**: Instant visual notifications when price targets are reached
- **Alert Management**: Track active, triggered, and dismissed alerts
- **Multiple Alert Types**: Support for various alert conditions and timeframes

### Advanced Analytics Dashboard

- **Performance Metrics**: Portfolio performance tracking across multiple timeframes
- **Risk Assessment**: Portfolio beta, Sharpe ratio, and volatility indicators
- **Diversification Analysis**: Visual breakdown of portfolio allocation
- **Interactive Charts**: Professional-grade charts with fallback CSS visualizations
- **Market Comparison**: Compare portfolio performance against market indices

### Real-time Data Integration

- **Binance API Integration**: 100% free, reliable cryptocurrency price feeds
- **WebSocket Support**: Real-time price streaming with automatic reconnection
- **Fallback System**: Multiple data sources with graceful degradation
- **Oracle Status**: Live connection status indicator

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts with CSS fallbacks
- **Data Fetching**: Custom hooks with real-time updates
- **Icons**: Lucide React + Real crypto icons from CoinGecko
- **Fonts**: Montserrat (headings) + Open Sans (body)
- **APIs**: Binance (primary), CoinGecko (icons)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd memento-crypto-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   ```env
   # Enable real oracle data (recommended)
   PUBLIC_USE_REAL_ORACLE=true

   # Alternative formats (all work the same)
   # NEXT_PUBLIC_USE_REAL_ORACLE=true
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Oracle Data Sources

Memento uses a robust multi-source approach for cryptocurrency data:

#### Real Oracle Mode (Recommended)

Set `PUBLIC_USE_REAL_ORACLE=true` to enable:

- **Binance API**: Free, high-limit, reliable price data
- **Real-time WebSocket**: Live price streaming from Binance
- **Automatic Fallback**: Graceful handling of API failures
- **No API Keys Required**: 100% free access

#### Simulated Mode

Set `PUBLIC_USE_REAL_ORACLE=false` for:

- Mock data with realistic price movements
- Perfect for development and testing
- Faster updates (5s vs 30s intervals)

### Data Architecture

```typescript
// Multi-source oracle with automatic failover
const oracle = new ImprovedCryptoOracle();
const prices = await oracle.getSimplePrices(["bitcoin", "ethereum"]);

// Real-time WebSocket updates
oracle.connectWebSocket(coinIds, (newPrices) => {
  updatePortfolio(newPrices);
});
```

### Supported Cryptocurrencies

- **Bitcoin (BTC)**: The original cryptocurrency
- **Ethereum (ETH)**: Smart contract platform
- **Solana (SOL)**: High-performance blockchain
- **Cardano (ADA)**: Proof-of-stake blockchain
- **Polkadot (DOT)**: Multi-chain protocol
- **Chainlink (LINK)**: Decentralized oracle network
- **Avalanche (AVAX)**: Scalable smart contracts platform
- **Polygon (MATIC)**: Ethereum scaling solution

## 📱 Usage

### Getting Started

1. **View Dashboard**: The main dashboard shows your portfolio overview with real-time prices
2. **Add Holdings**: Click "Add Crypto" to add cryptocurrencies to your portfolio
3. **Set Alerts**: Configure price alerts for your holdings
4. **Monitor Performance**: Use the analytics dashboard for detailed insights

### Portfolio Management

- **Add Cryptocurrency**: Select from 8 supported cryptocurrencies with real icons
- **Edit Holdings**: Modify quantities with real-time value calculations
- **Remove Holdings**: Clean portfolio management
- **Live Updates**: Automatic price updates every 30 seconds (real mode) or 5 seconds (demo)

### Real-time Features

- **Live Price Ticker**: Real-time prices in the header
- **WebSocket Connection**: Instant price updates
- **Connection Status**: Visual indicator of oracle status
- **Auto Reconnection**: Automatic WebSocket reconnection with exponential backoff

## 🏗 Project Structure

```
memento-crypto-tracker/
├── app/                          # Next.js App Router
│   ├── alerts/                   # Price alerts page
│   ├── analytics/                # Analytics dashboard
│   ├── globals.css              # Global styles and design tokens
│   ├── layout.tsx               # Root layout with fonts
│   └── page.tsx                 # Main dashboard
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── add-crypto-modal-fixed.tsx # Fixed modal without ref warnings
│   ├── oracle-status.tsx        # Oracle connection status
│   ├── portfolio-analytics.tsx  # Analytics with CSS fallbacks
│   ├── portfolio-holdings.tsx   # Holdings with real crypto icons
│   ├── price-alert.tsx          # Price alert configuration
│   └── real-time-price-ticker.tsx # Live price ticker with status
├── hooks/                       # Custom React hooks
│   └── use-crypto-data.ts       # Cryptocurrency data with real-time updates
├── lib/                         # Utility libraries
│   ├── crypto-config.ts         # Centralized crypto configuration
│   ├── improved-crypto-oracle.ts # Binance-based oracle with WebSocket
│   └── utils.ts                 # Utility functions
└── README.md                   # Project documentation
```

## 🔌 API Integration

### Binance API Integration

```typescript
// Real-time price fetching
const oracle = new ImprovedCryptoOracle();
const prices = await oracle.getRealTimePrices(["bitcoin", "ethereum"]);

// WebSocket streaming
oracle.connectWebSocket(coinIds, (newPrices) => {
  console.log("Price update:", newPrices);
});
```

### Crypto Icons

```typescript
// Real crypto icons from CoinGecko
const CRYPTO_ICON_URLS = {
  BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  // ... with fallback to colored circles
};
```

## 🎨 Design System

### Color Palette

- **Primary**: Purple gradient (#8B5CF6 to #A855F7)
- **Background**: Dark theme (#0F0F23, #1A1A2E)
- **Accent**: Green (#10B981) for gains, Red (#EF4444) for losses
- **Text**: High contrast whites and grays

### Typography

- **Headings**: Montserrat (600, 700 weights)
- **Body**: Open Sans (400, 500 weights)
- **Code**: Geist Mono

### Components

- Built with shadcn/ui for consistency
- Real cryptocurrency icons with fallbacks
- Responsive design for all screen sizes
- CSS-based charts when Recharts unavailable

## 🔍 Technical Highlights

### Reliability Features

- **Multiple Data Sources**: Binance primary, with fallback systems
- **Error Handling**: Graceful degradation when APIs fail
- **WebSocket Reconnection**: Automatic reconnection with exponential backoff
- **Type Safety**: Full TypeScript implementation
- **No External Dependencies**: For core crypto icons (uses fallback system)

### Performance Optimizations

- **Efficient Updates**: 30-second intervals for real data, 5-second for demo
- **Lazy Loading**: Images loaded on demand with error handling
- **Memory Management**: Proper WebSocket cleanup and connection management
- **Caching**: Browser-level caching for static assets

### Development Experience

- **Hot Reload**: Fast refresh during development
- **Environment Switching**: Easy toggle between real and simulated data
- **Error Boundaries**: Comprehensive error handling
- **TypeScript**: Full type safety throughout

## 🚀 Deployment

### Environment Variables for Production

```env
# Vercel deployment
PUBLIC_USE_REAL_ORACLE=true

# Optional: For higher rate limits (not required)
COINGECKO_API_KEY=your_key_here
```

### Vercel Deployment

```bash
# Deploy to Vercel
npm run build
vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Recent Improvements (Latest Release)

- Replaced CoinGecko dependency with free Binance API
- Added real-time WebSocket price streaming
- Implemented automatic reconnection and failover
- Added real cryptocurrency icons with fallback system
- Fixed React ref warnings in modals
- Centralized cryptocurrency configuration
- Improved error handling and logging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Binance** for free, reliable cryptocurrency market data
- **CoinGecko** for cryptocurrency icons and fallback data
- **shadcn/ui** for the component library
- **Recharts** for data visualization
- **Vercel** for deployment platform

## 📞 Support

For support and questions:

- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Memento** - Professional cryptocurrency portfolio tracking with real-time data and zero API costs.
