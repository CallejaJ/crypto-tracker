"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const availableCryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 67420 },
  { symbol: "ETH", name: "Ethereum", price: 3890 },
  { symbol: "ADA", name: "Cardano", price: 0.52 },
  { symbol: "DOT", name: "Polkadot", price: 7.85 },
  { symbol: "LINK", name: "Chainlink", price: 18.45 },
  { symbol: "SOL", name: "Solana", price: 145.3 },
  { symbol: "MATIC", name: "Polygon", price: 0.89 },
  { symbol: "AVAX", name: "Avalanche", price: 42.15 },
]

interface AddCryptoModalProps {
  onAddCrypto: (crypto: { symbol: string; name: string; amount: number; price: number }) => void
}

export function AddCryptoModal({ onAddCrypto }: AddCryptoModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const crypto = availableCryptos.find((c) => c.symbol === selectedCrypto)
    if (!crypto || !amount || Number.parseFloat(amount) <= 0) return

    onAddCrypto({
      symbol: crypto.symbol,
      name: crypto.name,
      amount: Number.parseFloat(amount),
      price: crypto.price,
    })

    setSelectedCrypto("")
    setAmount("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground font-heading">Add Cryptocurrency</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crypto" className="text-card-foreground">
              Cryptocurrency
            </Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select a cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {availableCryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-card-foreground">
                    {crypto.name} ({crypto.symbol}) - ${crypto.price.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-card-foreground">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-background border-border text-foreground"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedCrypto || !amount} className="bg-primary text-primary-foreground">
              Add Asset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
