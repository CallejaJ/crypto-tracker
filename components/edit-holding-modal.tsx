"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditHoldingModalProps {
  holding: {
    symbol: string
    name: string
    amount: number
    price: number
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateHolding: (symbol: string, newAmount: number) => void
  onRemoveHolding: (symbol: string) => void
}

export function EditHoldingModal({
  holding,
  open,
  onOpenChange,
  onUpdateHolding,
  onRemoveHolding,
}: EditHoldingModalProps) {
  const [amount, setAmount] = useState(holding?.amount.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!holding || !amount || Number.parseFloat(amount) <= 0) return

    onUpdateHolding(holding.symbol, Number.parseFloat(amount))
    onOpenChange(false)
  }

  const handleRemove = () => {
    if (!holding) return
    onRemoveHolding(holding.symbol)
    onOpenChange(false)
  }

  if (!holding) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground font-heading">
            Edit {holding.name} ({holding.symbol})
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-sm text-muted-foreground">Current price: ${holding.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Asset
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border text-foreground"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!amount} className="bg-primary text-primary-foreground">
                Update
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
