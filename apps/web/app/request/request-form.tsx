"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  serviceType: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const services = [
  "Swedish Massage",
  "Deep Tissue",
  "Sports Massage",
  "Prenatal Massage",
  "Not Sure (Let's Discuss)",
];

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/appointment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center text-center gap-4 pt-10 pb-10">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircleIcon className="size-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Request Received!</h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Thank you for reaching out. Your therapist will review your
              request and send you a booking link within 24 hours to the email
              you provided.
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Didn&apos;t receive an email? Check your spam folder or contact us
            at{" "}
            <a href="mailto:hello@flowmassage.com" className="underline">
              hello@flowmassage.com
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
        <CardDescription>
          All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(555) 000-0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Service *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any areas of focus, health concerns, or questions for your therapist..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
