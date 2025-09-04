"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { SUPPORTED_CRYPTOS } from "@/lib/crypto-config";

interface AddCryptoModalProps {
  onAddCrypto: (crypto: {
    symbol: string;
    name: string;
    amount: number;
    price: number;
  }) => void;
}

export function AddCryptoModalFixed({ onAddCrypto }: AddCryptoModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const crypto = SUPPORTED_CRYPTOS.find((c) => c.symbol === selectedCrypto);
    if (crypto && amount && parseFloat(amount) > 0) {
      onAddCrypto({
        symbol: crypto.symbol,
        name: crypto.name,
        amount: parseFloat(amount),
        price: 0, // Will be updated by the hook
      });
      setSelectedCrypto("");
      setAmount("");
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedCrypto("");
    setAmount("");
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={handleOpenModal}
        className='bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add Crypto
      </Button>

      {/* Custom Modal */}
      {open && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/80' />

          {/* Modal Content */}
          <div className='relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6 animate-in fade-in-0 zoom-in-95'>
            {/* Header */}
            <div className='mb-4'>
              <h2 className='text-lg font-heading font-bold text-card-foreground'>
                Add New Cryptocurrency
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='add-crypto' className='text-card-foreground'>
                  Cryptocurrency
                </Label>
                <Select
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a cryptocurrency' />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CRYPTOS.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        <div className='flex items-center space-x-2'>
                          <div
                            className='w-4 h-4 rounded-full'
                            style={{ backgroundColor: crypto.icon }}
                          />
                          <span>
                            {crypto.name} ({crypto.symbol})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='add-amount' className='text-card-foreground'>
                  Amount
                </Label>
                <Input
                  id='add-amount'
                  type='number'
                  placeholder='0.00'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className='bg-background border-border text-foreground'
                  step='0.00000001'
                  min='0'
                />
              </div>

              <div className='flex flex-col sm:flex-row gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  className='border-border text-foreground bg-transparent flex-1 sm:flex-initial order-2 sm:order-1'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={
                    !selectedCrypto || !amount || parseFloat(amount) <= 0
                  }
                  className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-initial order-1 sm:order-2'
                >
                  Add Crypto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
