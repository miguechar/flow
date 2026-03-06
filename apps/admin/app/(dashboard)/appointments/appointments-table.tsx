"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2Icon, CreditCardIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"

type AppointmentRow = {
  id: string
  date: string
  startTime: string
  duration: number
  serviceType: string
  status: string
  stripePaymentMethodId: string | null
  stripeCustomerId: string | null
  stripeLast4: string | null
  notes: string | null
  createdAt: Date
  userName: string | null
  userEmail: string | null
}

const statusBadge = (status: string) => {
  const map: Record<string, "default" | "success" | "destructive" | "warning"> = {
    scheduled: "default",
    completed: "success",
    cancelled: "destructive",
    no_show: "warning",
  }
  return <Badge variant={map[status] ?? "default"}>{status.replace("_", " ")}</Badge>
}

export function AppointmentsTable({ initialAppointments }: { initialAppointments: AppointmentRow[] }) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [chargeDialog, setChargeDialog] = useState<AppointmentRow | null>(null)
  const [chargeAmount, setChargeAmount] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  async function chargeClient() {
    if (!chargeDialog) return
    const amount = parseFloat(chargeAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount.")
      return
    }
    setLoading(chargeDialog.id)
    try {
      const res = await fetch(`/api/appointments/${chargeDialog.id}/charge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description: `Flow Massage — ${chargeDialog.serviceType}` }),
      })
      if (!res.ok) throw new Error("Charge failed")

      setAppointments((prev) =>
        prev.map((a) => (a.id === chargeDialog.id ? { ...a, status: "completed" } : a))
      )
      toast.success(`$${amount.toFixed(2)} charged successfully.`)
      setChargeDialog(null)
      setChargeAmount("")
    } catch {
      toast.error("Failed to charge client. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No appointments yet.
                </TableCell>
              </TableRow>
            )}
            {appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{apt.userName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{apt.userEmail ?? "—"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{apt.serviceType}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">
                  <div>{apt.date}</div>
                  <div className="text-xs text-muted-foreground">{apt.startTime} · {apt.duration} min</div>
                </TableCell>
                <TableCell className="text-sm">
                  {apt.stripePaymentMethodId ? (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CreditCardIcon className="size-3.5" />
                      {apt.stripeLast4 ? `••••${apt.stripeLast4}` : "Card on file"}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No card</span>
                  )}
                </TableCell>
                <TableCell>{statusBadge(apt.status)}</TableCell>
                <TableCell className="text-right">
                  {apt.status === "scheduled" && apt.stripePaymentMethodId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setChargeDialog(apt)}
                    >
                      <CreditCardIcon className="size-3.5" />
                      Charge
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Charge dialog */}
      <Dialog open={!!chargeDialog} onOpenChange={() => setChargeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Charge Client</DialogTitle>
            <DialogDescription>
              Charge <strong>{chargeDialog?.userName}</strong> for their{" "}
              <strong>{chargeDialog?.serviceType}</strong> session. Their saved card will be charged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-7"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChargeDialog(null)}>
              Cancel
            </Button>
            <Button
              disabled={loading === chargeDialog?.id || !chargeAmount}
              onClick={chargeClient}
            >
              {loading === chargeDialog?.id ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Confirm Charge"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
