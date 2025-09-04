"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditHoldingModalProps {
  holding: {
    symbol: string;
    name: string;
    amount: number;
    price: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateHolding: (symbol: string, newAmount: number) => void;
  onRemoveHolding: (symbol: string) => void;
}

export function EditHoldingModal({
  holding,
  open,
  onOpenChange,
  onUpdateHolding,
  onRemoveHolding,
}: EditHoldingModalProps) {
  const [amount, setAmount] = useState("");

  // Update amount when holding changes
  useEffect(() => {
    if (holding) {
      setAmount(holding.amount.toString());
    }
  }, [holding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!holding || !amount || parseFloat(amount) <= 0) return;

    onUpdateHolding(holding.symbol, parseFloat(amount));
    onOpenChange(false);
  };

  const handleRemove = () => {
    if (!holding) return;
    onRemoveHolding(holding.symbol);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!open || !holding) return null;

  return (
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
            Edit {holding.name} ({holding.symbol})
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-amount' className='text-card-foreground'>
              Amount
            </Label>
            <Input
              id='edit-amount'
              type='number'
              step='0.00000001'
              min='0'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Enter amount'
              className='bg-background border-border text-foreground'
            />
            <p className='text-sm text-muted-foreground'>
              Current price: $
              {holding.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </p>
            {amount && parseFloat(amount) > 0 && (
              <p className='text-sm text-muted-foreground'>
                Total value: $
                {(parseFloat(amount) * holding.price).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            )}
          </div>

          <div className='flex flex-col sm:flex-row justify-between gap-3'>
            <Button
              type='button'
              variant='destructive'
              onClick={handleRemove}
              className='bg-red-600 hover:bg-red-700 text-white order-2 sm:order-1'
            >
              Remove Asset
            </Button>
            <div className='flex gap-2 order-1 sm:order-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                className='border-border text-foreground flex-1 sm:flex-initial'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!amount || parseFloat(amount) <= 0}
                className='bg-primary text-primary-foreground flex-1 sm:flex-initial'
              >
                Update
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
