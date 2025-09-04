# Memento - Cryptocurrency Portfolio Tracker

A modern, professional cryptocurrency portfolio tracker with real-time price alerts, advanced analytics, and comprehensive portfolio management features.

## 🚀 Features

### Core Portfolio Management
- **Real-time Portfolio Tracking**: Monitor your cryptocurrency holdings with live price updates
- **Multi-currency Support**: Track Bitcoin, Ethereum, Solana, and other major cryptocurrencies
- **Portfolio Analytics**: Comprehensive performance metrics including 24h/7d/30d returns
- **Holdings Management**: Add, edit, and remove cryptocurrencies from your portfolio

### Price Alert System
- **Smart Alerts**: Set price targets with "above" and "below" thresholds
- **Real-time Notifications**: Instant visual notifications when price targets are reached
- **Alert Management**: Track active, triggered, and dismissed alerts
- **Multiple Alert Types**: Support for various alert conditions and timeframes

### Advanced Analytics Dashboard
- **Performance Metrics**: Portfolio performance tracking across multiple timeframes
- **Risk Assessment**: Portfolio beta, Sharpe ratio, and volatility indicators
- **Diversification Analysis**: Visual breakdown of portfolio allocation
- **Interactive Charts**: Professional-grade charts using Recharts
- **Market Comparison**: Compare portfolio performance against market indices

### Real-time Data Integration
- **Live Price Feeds**: Real-time cryptocurrency price updates
- **Oracle Integration**: Support for both simulated and real market data
- **CoinGecko API**: Integration with CoinGecko for accurate market data
- **WebSocket Support**: Real-time price streaming capabilities

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Data Fetching**: SWR for client-side data management
- **Icons**: Lucide React + Custom crypto icons
- **Fonts**: Montserrat (headings) + Open Sans (body)

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd memento-crypto-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure environment variables**
   \`\`\`env
   # Optional: Enable real oracle data
   NEXT_PUBLIC_USE_REAL_ORACLE=true
   
   # Optional: CoinGecko API key for higher rate limits
   COINGECKO_API_KEY=your_api_key_here
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Oracle Data Sources

Memento supports both simulated and real market data:

#### Simulated Mode (Default)
- Uses mock data with realistic price movements
- Perfect for development and testing
- No API keys required

#### Real Oracle Mode
Set `NEXT_PUBLIC_USE_REAL_ORACLE=true` to enable:
- **CoinGecko API**: Free tier with rate limits
- **Real-time Updates**: Live market data
- **Historical Data**: Access to price history

### Supported Cryptocurrencies

- **Bitcoin (BTC)**: The original cryptocurrency
- **Ethereum (ETH)**: Smart contract platform
- **Solana (SOL)**: High-performance blockchain
- **Cardano (ADA)**: Proof-of-stake blockchain
- **Polygon (MATIC)**: Ethereum scaling solution
- **Chainlink (LINK)**: Decentralized oracle network

## 📱 Usage

### Getting Started

1. **View Dashboard**: The main dashboard shows your portfolio overview
2. **Add Holdings**: Click "Add Crypto" to add cryptocurrencies to your portfolio
3. **Set Alerts**: Configure price alerts for your holdings
4. **Monitor Performance**: Use the analytics dashboard for detailed insights

### Portfolio Management

- **Add Cryptocurrency**: Use the "Add Crypto" button to add new holdings
- **Edit Holdings**: Click the edit icon on any holding to modify quantity
- **Remove Holdings**: Use the delete option to remove cryptocurrencies
- **View Details**: Click on any cryptocurrency for detailed information

### Price Alerts

- **Create Alert**: Set price targets with "above" or "below" conditions
- **Monitor Alerts**: View active alerts in the alerts dashboard
- **Manage Notifications**: Dismiss or modify existing alerts
- **Alert History**: Track triggered and dismissed alerts

### Analytics Dashboard

- **Performance Metrics**: View portfolio performance across different timeframes
- **Risk Analysis**: Monitor portfolio risk indicators and diversification
- **Interactive Charts**: Explore detailed charts and technical indicators
- **Market Comparison**: Compare your portfolio against market benchmarks

## 🏗 Project Structure

\`\`\`
memento-crypto-tracker/
├── app/                          # Next.js App Router
│   ├── alerts/                   # Price alerts page
│   ├── analytics/                # Analytics dashboard
│   ├── globals.css              # Global styles and design tokens
│   ├── layout.tsx               # Root layout with fonts
│   └── page.tsx                 # Main dashboard
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── add-crypto-modal.tsx     # Add cryptocurrency modal
│   ├── alert-notification.tsx   # Price alert notifications
│   ├── crypto-icons.tsx         # Cryptocurrency icons
│   ├── edit-holding-modal.tsx   # Edit holdings modal
│   ├── oracle-status.tsx        # Oracle connection status
│   ├── portfolio-analytics.tsx  # Analytics components
│   ├── portfolio-holdings.tsx   # Portfolio holdings display
│   ├── price-alert.tsx          # Price alert configuration
│   └── real-time-price-ticker.tsx # Live price ticker
├── hooks/                       # Custom React hooks
│   └── use-crypto-data.ts       # Cryptocurrency data management
├── lib/                         # Utility libraries
│   ├── crypto-api.ts           # API integration
│   ├── crypto-oracle.ts        # Oracle data sources
│   └── utils.ts                # Utility functions
└── README.md                   # Project documentation
\`\`\`

## 🔌 API Integration

### CoinGecko Integration

\`\`\`typescript
// Example: Fetching real-time prices
const prices = await fetchCryptoPrices(['bitcoin', 'ethereum', 'solana']);
\`\`\`

### WebSocket Integration

\`\`\`typescript
// Example: Real-time price streaming
const ws = new WebSocket('wss://api.coingecko.com/api/v3/coins/bitcoin/tickers');
\`\`\`

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
- Custom crypto icons for authenticity
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko** for cryptocurrency market data
- **shadcn/ui** for the component library
- **Recharts** for data visualization
- **Vercel** for deployment platform

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Memento** - Professional cryptocurrency portfolio tracking made simple.
