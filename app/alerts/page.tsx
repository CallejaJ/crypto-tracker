"use client";

import { PriceAlert } from "@/components/price-alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-background'>
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
          <Link href='/'>
            <Button
              variant='ghost'
              className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
            >
              <ArrowLeft className='mr-3 h-4 w-4' />
              Dashboard
            </Button>
          </Link>
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
            Price Alerts
          </h1>
          <div className='w-8' />
        </div>

        <div className='p-4 lg:p-8'>
          <div className='mb-6 lg:mb-8'>
            <h2 className='text-2xl lg:text-3xl font-heading font-black text-foreground mb-2'>
              Price Alerts
            </h2>
            <p className='text-sm lg:text-base text-muted-foreground'>
              Set up alerts to monitor your cryptocurrency price targets
            </p>
          </div>

          <PriceAlert />
        </div>
      </div>
    </div>
  );
}
