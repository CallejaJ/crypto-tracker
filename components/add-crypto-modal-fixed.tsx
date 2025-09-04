// components/add-crypto-modal-fixed.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const handleSubmit = () => {
    const crypto = SUPPORTED_CRYPTOS.find((c) => c.symbol === selectedCrypto);
    if (crypto && amount) {
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

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      className='bg-primary text-primary-foreground hover:bg-primary/90'
    >
      <Plus className='mr-2 h-4 w-4' />
      Add Crypto
    </Button>
  );

  return (
    <>
      <TriggerButton />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-card-foreground'>
              Add New Cryptocurrency
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='crypto' className='text-card-foreground'>
                Cryptocurrency
              </Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
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

            <div>
              <Label htmlFor='amount' className='text-card-foreground'>
                Amount
              </Label>
              <Input
                id='amount'
                type='number'
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='bg-input border-border text-foreground'
                step='0.00001'
                min='0'
              />
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setOpen(false)}
                className='border-border text-foreground bg-transparent'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedCrypto || !amount}
                className='bg-primary text-primary-foreground hover:bg-primary/90'
              >
                Add Crypto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
