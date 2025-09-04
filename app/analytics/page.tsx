import { PortfolioAnalytics } from "@/components/portfolio-analytics"
import { Button } from "@/components/ui/button"
import { BarChart3, Bell, Wallet, Settings } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <h1 className="text-2xl font-heading font-black text-sidebar-foreground">Memento</h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Crypto Portfolio Tracker</p>
        </div>

        <nav className="px-4 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
              <BarChart3 className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <Wallet className="mr-3 h-4 w-4" />
            Portfolio
          </Button>
          <Link href="/alerts">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
              <Bell className="mr-3 h-4 w-4" />
              Alerts
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground">
            <BarChart3 className="mr-3 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-black text-foreground mb-2">Portfolio Analytics</h2>
          <p className="text-muted-foreground">
            Advanced insights and performance metrics for your cryptocurrency portfolio
          </p>
        </div>

        <PortfolioAnalytics />
      </div>
    </div>
  )
}
