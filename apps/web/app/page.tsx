import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  LeafIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

const services = [
  {
    name: "Swedish Massage",
    duration: "60 / 90 min",
    description:
      "A gentle, relaxing full-body massage using long, flowing strokes to ease muscle tension, improve circulation, and promote deep relaxation.",
    icon: LeafIcon,
  },
  {
    name: "Deep Tissue",
    duration: "60 / 90 min",
    description:
      "Targeted pressure on deeper muscle layers to release chronic tension, break up adhesions, and relieve persistent pain.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Sports Massage",
    duration: "60 min",
    description:
      "Designed for athletes and active individuals. Enhances performance, accelerates recovery, and prevents injury through targeted techniques.",
    icon: SparklesIcon,
  },
  {
    name: "Prenatal Massage",
    duration: "60 min",
    description:
      "Specially adapted massage for expectant mothers to relieve pregnancy discomforts, reduce swelling, and support overall well-being.",
    icon: LeafIcon,
  },
];

const steps = [
  {
    number: "01",
    title: "Request an Appointment",
    description:
      "Fill out a short form with your contact info and preferred service. No account needed.",
    icon: CalendarIcon,
  },
  {
    number: "02",
    title: "Get Approved",
    description:
      "Your therapist reviews your request and sends you a personalized booking link via email.",
    icon: CheckCircleIcon,
  },
  {
    number: "03",
    title: "Choose Your Time",
    description:
      "Sign in with your magic link, pick a date that works for you, agree to the clinic policy, and save your payment info.",
    icon: ClockIcon,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent/20 py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge
            variant="secondary"
            className="mb-6 text-xs font-medium tracking-wide uppercase"
          >
            Therapeutic Massage Therapy
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Find Your <span className="text-primary">Flow</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the healing power of personalized massage therapy. We
            restore balance, relieve tension, and renew your sense of well-being
            — one session at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/request">
              <Button size="lg" className="gap-2 px-8">
                Request an Appointment
                <ArrowRightIcon className="size-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-8">
                Learn About Me
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Our Services
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Each session is tailored to your individual needs, helping you
              achieve lasting relief and deep restoration.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.name}
                  className="group hover:shadow-md transition-shadow border-border/60"
                >
                  <CardHeader className="pb-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="w-fit text-xs font-normal"
                    >
                      {service.duration}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Booking your massage is simple and stress-free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-calc(50%-2.5rem)] h-px bg-border" />
                  )}
                  <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 relative z-10">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground mb-1">
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/request">
              <Button size="lg" className="gap-2 px-8">
                Get Started Today
                <ArrowRightIcon className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <LeafIcon className="size-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Feel the Difference?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto">
            Take the first step toward relief, relaxation, and renewal. Your
            body deserves it.
          </p>
          <Link href="/request">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Request Your Appointment
              <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
