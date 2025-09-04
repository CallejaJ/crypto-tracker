import { PriceAlert } from "@/components/price-alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AlertsPage() {
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
              <ArrowLeft className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-black text-foreground mb-2">Price Alerts</h2>
          <p className="text-muted-foreground">Set up alerts to monitor your cryptocurrency price targets</p>
        </div>

        <PriceAlert />
      </div>
    </div>
  )
}
