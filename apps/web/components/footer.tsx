import Link from "next/link";
import { LeafIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";
import { constants } from "@repo/constants";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <LeafIcon className="size-5 text-primary" />
              <span>Flow Massage</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A sanctuary of healing touch. We provide personalized massage
              therapy to restore balance, relieve tension, and renew your
              well-being.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/request", label: "Request Appointment" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Contact
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${constants.contact.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <PhoneIcon className="size-4 shrink-0" />
                {constants.contact.phone}
              </a>
              <a
                href="mailto:hello@flowmassage.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MailIcon className="size-4 shrink-0" />
                {constants.contact.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="size-4 shrink-0 mt-0.5" />
                {constants.contact.address}
                <br />
                Your City, ST 00000
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Flow Massage. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link
              href="/request"
              className="hover:text-foreground transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
