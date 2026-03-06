"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { format, isBefore, startOfToday, isWeekend } from "date-fns"
import { Loader2Icon, CheckCircleIcon, CalendarIcon, FileTextIcon, CreditCardIcon } from "lucide-react"
import { Calendar } from "@workspace/ui/components/calendar"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Separator } from "@workspace/ui/components/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import type { AppointmentRequest } from "@workspace/db"

const stripePromise = loadStripe(process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]!)

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
]

type Step = "calendar" | "policy" | "payment" | "done"

interface BookingFlowProps {
  request: AppointmentRequest
  userEmail: string
  userName: string
}

export function BookingFlow({ request, userEmail, userName }: BookingFlowProps) {
  const [step, setStep] = useState<Step>("calendar")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [policyOpen, setPolicyOpen] = useState(false)
  const [policyText, setPolicyText] = useState("")
  const [policyAgreed, setPolicyAgreed] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [setupData, setSetupData] = useState<{
    customerId: string
    setupIntentId: string
  } | null>(null)

  // Load policy text
  useEffect(() => {
    fetch("/api/policy")
      .then((r) => r.json())
      .then((d) => setPolicyText(d.content ?? ""))
      .catch(() => {})
  }, [])

  // When moving to payment step, create SetupIntent
  useEffect(() => {
    if (step === "payment" && !clientSecret) {
      fetch("/api/stripe/setup-intent", { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          setClientSecret(d.clientSecret)
          setSetupData({ customerId: d.customerId, setupIntentId: d.setupIntentId })
        })
        .catch(() => toast.error("Failed to initialize payment. Please refresh."))
    }
  }, [step, clientSecret])

  const stepConfig = [
    { id: "calendar", label: "Choose Date", icon: CalendarIcon },
    { id: "policy", label: "Review Policy", icon: FileTextIcon },
    { id: "payment", label: "Payment", icon: CreditCardIcon },
  ]

  if (step === "done") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-16">
        <div className="text-center max-w-sm space-y-4">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircleIcon className="size-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Appointment Booked!</h2>
          <p className="text-muted-foreground">
            Your <strong>{request.serviceType}</strong> session is confirmed for{" "}
            <strong>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}</strong> at{" "}
            <strong>{selectedTime}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation will be sent to <strong>{userEmail}</strong>. Your card will
            only be charged after your session is complete.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Book Your Appointment</h1>
          <p className="text-muted-foreground">
            Hi {userName?.split(" ")[0] ?? "there"}! Your <strong>{request.serviceType}</strong> request has been approved.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {stepConfig.map((s, i) => {
            const isActive = s.id === step
            const isPast = stepConfig.findIndex((x) => x.id === step) > i
            const Icon = s.icon
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                    isPast
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                  }`}>
                    {isPast ? <CheckCircleIcon className="size-4" /> : <Icon className="size-4" />}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < stepConfig.length - 1 && (
                  <div className="flex-1 h-px bg-border min-w-4" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step: Calendar */}
        {step === "calendar" && (
          <CalendarStep
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onNext={() => setStep("policy")}
          />
        )}

        {/* Step: Policy */}
        {step === "policy" && (
          <PolicyStep
            policyText={policyText}
            policyOpen={policyOpen}
            setPolicyOpen={setPolicyOpen}
            policyAgreed={policyAgreed}
            setPolicyAgreed={setPolicyAgreed}
            onBack={() => setStep("calendar")}
            onNext={() => setStep("payment")}
          />
        )}

        {/* Step: Payment */}
        {step === "payment" && clientSecret && setupData && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: { colorPrimary: "oklch(0.50 0.10 145)" },
              },
            }}
          >
            <PaymentStep
              request={request}
              selectedDate={selectedDate!}
              selectedTime={selectedTime!}
              setupData={setupData}
              onBack={() => setStep("policy")}
              onDone={() => setStep("done")}
            />
          </Elements>
        )}

        {step === "payment" && !clientSecret && (
          <div className="flex justify-center py-20">
            <Loader2Icon className="size-8 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Calendar Step ─────────────────────────────────────────────────────────────

function CalendarStep({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onNext,
}: {
  selectedDate: Date | undefined
  setSelectedDate: (d: Date | undefined) => void
  selectedTime: string | undefined
  setSelectedTime: (t: string) => void
  onNext: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="size-5 text-primary" />
          Choose a Date & Time
        </CardTitle>
        <CardDescription>
          Select your preferred appointment date and time slot. Weekends are unavailable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              isBefore(date, startOfToday()) || isWeekend(date)
            }
            className="rounded-lg border"
          />
        </div>

        {selectedDate && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Available times for {format(selectedDate, "EEEE, MMMM d")}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    selectedTime === time
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex justify-end">
          <Button
            onClick={onNext}
            disabled={!selectedDate || !selectedTime}
          >
            Continue to Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Policy Step ───────────────────────────────────────────────────────────────

function PolicyStep({
  policyText,
  policyOpen,
  setPolicyOpen,
  policyAgreed,
  setPolicyAgreed,
  onBack,
  onNext,
}: {
  policyText: string
  policyOpen: boolean
  setPolicyOpen: (v: boolean) => void
  policyAgreed: boolean
  setPolicyAgreed: (v: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="size-5 text-primary" />
            Clinic Policy
          </CardTitle>
          <CardDescription>
            Please read and agree to our clinic policy before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted/50 border p-4 text-sm text-muted-foreground leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
            {policyText || "Loading policy..."}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="policy-agree"
              checked={policyAgreed}
              onCheckedChange={(v) => setPolicyAgreed(!!v)}
            />
            <label htmlFor="policy-agree" className="text-sm leading-relaxed cursor-pointer">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => setPolicyOpen(true)}
                className="underline text-primary"
              >
                Flow Massage Clinic Policy
              </button>
              , including the cancellation policy, late arrival policy, and payment terms.
            </label>
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onNext} disabled={!policyAgreed}>
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clinic Policy</DialogTitle>
            <DialogDescription>Full policy — please read carefully.</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mt-4">
            {policyText}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Payment Step ──────────────────────────────────────────────────────────────

function PaymentStep({
  request,
  selectedDate,
  selectedTime,
  setupData,
  onBack,
  onDone,
}: {
  request: AppointmentRequest
  selectedDate: Date
  selectedTime: string
  setupData: { customerId: string; setupIntentId: string }
  onBack: () => void
  onDone: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSaving(true)

    try {
      const { error: stripeError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      })

      if (stripeError) {
        toast.error(stripeError.message ?? "Payment setup failed.")
        setSaving(false)
        return
      }

      if (!setupIntent) {
        toast.error("Setup incomplete. Please try again.")
        setSaving(false)
        return
      }

      // Get payment method details
      const pm = setupIntent.payment_method
      const pmId = typeof pm === "string" ? pm : pm?.id ?? ""

      // Book appointment in our DB
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          startTime: selectedTime,
          duration: 60,
          serviceType: request.serviceType,
          stripeSetupIntentId: setupData.setupIntentId,
          stripeCustomerId: setupData.customerId,
          stripePaymentMethodId: pmId,
          stripeLast4: "",
          policyAgreed: true,
        }),
      })

      if (!res.ok) throw new Error("Booking failed")

      onDone()
    } catch {
      toast.error("Something went wrong. Please try again.")
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="size-5 text-primary" />
          Save Payment Method
        </CardTitle>
        <CardDescription>
          Your card will be saved securely but <strong>not charged</strong> until after your session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking summary */}
        <div className="rounded-lg bg-muted/50 border p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service</span>
            <span className="font-medium">{request.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment</span>
            <Badge variant="secondary">Charged after session</Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Separator />
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack} disabled={saving}>
              Back
            </Button>
            <Button type="submit" disabled={saving || !stripe || !elements}>
              {saving ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
