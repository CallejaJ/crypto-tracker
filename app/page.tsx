"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  BarChart3,
  Wallet,
  Settings,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { AlertNotification } from "@/components/alert-notification";
import { RealTimePriceTicker } from "@/components/real-time-price-ticker";
import { PortfolioHoldings } from "@/components/portfolio-holdings";
import Link from "next/link";
import { useState } from "react";

export default function MementoDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-background'>
      <AlertNotification />

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-heading font-black text-sidebar-foreground'>
                Memento
              </h1>
              <p className='text-sm text-sidebar-foreground/70 mt-1'>
                Crypto Portfolio Tracker
              </p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden text-sidebar-foreground'
              onClick={() => setSidebarOpen(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <nav className='px-4 space-y-2'>
          <Button
            variant='ghost'
            className='w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground'
          >
            <BarChart3 className='mr-3 h-4 w-4' />
            Dashboard
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
          >
            <Wallet className='mr-3 h-4 w-4' />
            Portfolio
          </Button>
          <Link href='/alerts'>
            <Button
              variant='ghost'
              className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
            >
              <Bell className='mr-3 h-4 w-4' />
              Alerts
            </Button>
          </Link>
          <Link href='/analytics'>
            <Button
              variant='ghost'
              className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
            >
              <Activity className='mr-3 h-4 w-4' />
              Analytics
            </Button>
          </Link>
          <Button
            variant='ghost'
            className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
          >
            <Settings className='mr-3 h-4 w-4' />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className='lg:ml-64'>
        {/* Mobile header */}
        <div className='lg:hidden bg-background border-b border-border p-4 flex items-center justify-between'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSidebarOpen(true)}
            className='text-foreground'
          >
            <Menu className='h-5 w-5' />
          </Button>
          <h1 className='text-lg font-heading font-bold text-foreground'>
            Crypto Portfolio Tracker
          </h1>
          <div className='w-8' /> {/* Spacer for centering */}
        </div>

        <div className='p-4 lg:p-8'>
          {/* Header with Real-time Ticker */}
          <div className='mb-6 lg:mb-8'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4'>
              <div className='mb-4 lg:mb-0'>
                <h2 className='text-2xl lg:text-3xl font-heading font-black text-foreground mb-2'>
                  Portfolio Overview
                </h2>
                <p className='text-sm lg:text-base text-muted-foreground'>
                  Track your cryptocurrency investments and market performance
                </p>
              </div>
            </div>

            <div className='p-3 lg:p-4 rounded-lg bg-card border border-border overflow-x-auto'>
              <RealTimePriceTicker />
            </div>
          </div>

          <PortfolioHoldings />
        </div>
      </div>
    </div>
  );
}
