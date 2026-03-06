import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  AwardIcon,
  HeartIcon,
  LeafIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

export const metadata: Metadata = {
  title: "About | Flow Massage",
  description:
    "Learn about your therapist and the philosophy behind Flow Massage.",
};

const credentials = [
  "Licensed Massage Therapist (LMT)",
  "National Certification Board for Therapeutic Massage & Bodywork (NCBTMB)",
  "CPR & First Aid Certified",
  "Continuing Education — Prenatal Massage Specialist",
  "Member, American Massage Therapy Association (AMTA)",
];

const specialties = [
  { label: "Swedish & Relaxation", icon: LeafIcon },
  { label: "Deep Tissue Therapy", icon: ShieldCheckIcon },
  { label: "Sports & Recovery", icon: AwardIcon },
  { label: "Prenatal Care", icon: HeartIcon },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Photo placeholder */}
            <div className="flex justify-center md:justify-end order-first md:order-last">
              <div className="relative">
                <div className="size-72 md:size-96 rounded-3xl bg-primary/10 border-2 border-primary/20 flex flex-col items-center justify-center gap-3 text-primary/40">
                  <LeafIcon className="size-16" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Therapist Photo
                  </span>
                </div>
                {/* Accent dot */}
                <div className="absolute -bottom-4 -left-4 size-24 rounded-2xl bg-accent/30 -z-10" />
                <div className="absolute -top-4 -right-4 size-16 rounded-xl bg-primary/10 -z-10" />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-6">
              <div>
                <Badge
                  variant="secondary"
                  className="mb-4 uppercase tracking-wide text-xs"
                >
                  Your Therapist
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                  Hello, I&apos;m
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                  [Your Name]
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I&apos;m a licensed massage therapist with over 8 years of
                experience helping clients reconnect with their bodies, release
                chronic tension, and restore a sense of ease and flow in their
                daily lives.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My approach is deeply personal. I believe that every body has
                its own story, and every session should reflect your unique
                needs — whether that&apos;s deep pressure work to untangle
                stubborn knots, or a gentle, restorative treatment to quiet a
                busy mind.
              </p>
              <Link href="/request">
                <Button className="gap-2">
                  Work With Me
                  <ArrowRightIcon className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <LeafIcon className="size-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            My Philosophy
          </h2>
          <blockquote className="text-xl md:text-2xl text-muted-foreground leading-relaxed italic font-light">
            &ldquo;The body holds wisdom we often forget to listen to. Massage
            is not a luxury — it&apos;s a conversation between therapist and
            client, between tension and release, between pain and
            healing.&rdquo;
          </blockquote>
          <Separator className="my-10 max-w-xs mx-auto" />
          <p className="text-muted-foreground leading-relaxed">
            I founded Flow Massage to create a space where clients feel truly
            heard and cared for. From your first inquiry to your last exhale on
            the table, my goal is to make every interaction personal,
            professional, and healing.
          </p>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Specialties
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Areas where I have dedicated extra training and experience.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specialties.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background border border-border/60 text-center"
              >
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="size-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Credentials & Training
            </h2>
            <p className="text-muted-foreground">
              Committed to ongoing education and the highest standards of care.
            </p>
          </div>
          <ul className="space-y-3">
            {credentials.map((cred) => (
              <li key={cred} className="flex items-start gap-3">
                <div className="size-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="size-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground">{cred}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5 border-t">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to experience the difference?
          </h2>
          <p className="text-muted-foreground mb-6">
            Request an appointment and I&apos;ll reach out to schedule your
            session personally.
          </p>
          <Link href="/request">
            <Button size="lg" className="gap-2 px-8">
              Request an Appointment
              <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
