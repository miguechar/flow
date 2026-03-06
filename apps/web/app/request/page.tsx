import type { Metadata } from "next";
import { RequestForm } from "./request-form";
import { LeafIcon, ClockIcon, ShieldCheckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Request an Appointment | Flow Massage",
  description:
    "Request a massage appointment at Flow Massage. We'll be in touch to confirm your booking.",
};

export default function RequestPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Request an Appointment
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Fill out the form and your therapist will reach out within 24
                hours to confirm availability and send you a personalized
                booking link.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <LeafIcon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No Account Needed</h3>
                  <p className="text-sm text-muted-foreground">
                    Just leave your contact information. We&apos;ll handle the
                    rest and send you a magic link when your request is
                    approved.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ClockIcon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Response Within 24 Hours
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your therapist personally reviews every request and will
                    contact you as soon as possible to arrange your session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheckIcon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    Payment information is collected securely at the time of
                    booking through Stripe. No charge is made until after your
                    session.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <RequestForm />
        </div>
      </div>
    </div>
  );
}
