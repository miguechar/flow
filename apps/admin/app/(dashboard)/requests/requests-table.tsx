"use client"

import { useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { CheckIcon, XIcon, Loader2Icon, ChevronDownIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
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
import { Textarea } from "@workspace/ui/components/textarea"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import type { AppointmentRequest } from "@workspace/db"

type Status = "all" | "pending" | "approved" | "rejected"

export function RequestsTable({ initialRequests }: { initialRequests: AppointmentRequest[] }) {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState<Status>("pending")
  const [rejectDialog, setRejectDialog] = useState<AppointmentRequest | null>(null)
  const [rejectNote, setRejectNote] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  async function updateStatus(id: string, status: "approved" | "rejected", notes?: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      })
      if (!res.ok) throw new Error("Failed to update")

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, notes: notes ?? r.notes } : r))
      )
      toast.success(
        status === "approved"
          ? "Request approved. Magic link sent to client."
          : "Request rejected."
      )
    } catch {
      toast.error("Failed to update request. Please try again.")
    } finally {
      setLoading(null)
      setRejectDialog(null)
      setRejectNote("")
    }
  }

  const statusBadge = (status: string) => {
    if (status === "pending") return <Badge variant="warning">Pending</Badge>
    if (status === "approved") return <Badge variant="success">Approved</Badge>
    return <Badge variant="destructive">Rejected</Badge>
  }

  return (
    <>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Status)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <span className="ml-1.5 size-5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 text-xs flex items-center justify-center">
              {requests.filter((r) => r.status === "pending").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No {filter === "all" ? "" : filter} requests.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.email}</p>
                    <p className="text-xs text-muted-foreground">{req.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{req.serviceType}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-48 truncate">
                  {req.message ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {format(new Date(req.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{statusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  {req.status === "pending" && (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="gap-1"
                        disabled={loading === req.id}
                        onClick={() => updateStatus(req.id, "approved")}
                      >
                        {loading === req.id ? (
                          <Loader2Icon className="size-3 animate-spin" />
                        ) : (
                          <CheckIcon className="size-3" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        disabled={loading === req.id}
                        onClick={() => setRejectDialog(req)}
                      >
                        <XIcon className="size-3" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {req.status !== "pending" && (
                    <span className="text-xs text-muted-foreground">{req.notes ?? "—"}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reject dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Optionally add a note for {rejectDialog?.name} explaining why their request was rejected.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. No availability in your area, please try again next month..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loading === rejectDialog?.id}
              onClick={() => rejectDialog && updateStatus(rejectDialog.id, "rejected", rejectNote)}
            >
              {loading === rejectDialog?.id ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
