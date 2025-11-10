"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Please enter your email address";
    }

    if (!email.includes("@")) {
      return "Hmm, that doesn't look like an email address";
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear validation error on change
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");
    setStatus("loading");

    // TODO: Replace with your actual newsletter API endpoint
    // For now, just simulate success
    setTimeout(() => {
      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
    }, 1000);

    // Example integration with newsletter service:
    // try {
    //   const response = await fetch('/api/newsletter/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   if (response.ok) {
    //     setStatus('success');
    //     setMessage('Thanks for subscribing!');
    //     setEmail('');
    //   } else {
    //     setStatus('error');
    //     setMessage('Something went wrong. Please try again.');
    //   }
    // } catch (error) {
    //   setStatus('error');
    //   setMessage('Something went wrong. Please try again.');
    // }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl"
    >
      <div className="relative">
        <AnimatePresence>
          {status === "loading" && (
            <motion.span
              key="neon-border"
              className="pointer-events-none absolute -inset-1 rounded-[2.25rem]"
              style={{
                padding: "2px",
                background:
                  "conic-gradient(from 0deg, transparent 0deg 40deg, oklch(0.78 0.15 280 / 0.8) 40deg 60deg, transparent 60deg 140deg, oklch(0.78 0.15 280 / 0.8) 140deg 160deg, transparent 160deg 240deg, oklch(0.78 0.15 280 / 0.8) 240deg 260deg, transparent 260deg 360deg)",
                filter: "drop-shadow(0 0 16px oklch(0.78 0.15 280 / 0.6)) drop-shadow(0 0 32px oklch(0.78 0.15 280 / 0.4))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                opacity: { duration: 0.3, ease: "easeOut" },
                scale: { duration: 0.3, ease: "easeOut" },
                rotate: { duration: 1.6, ease: "linear", repeat: Infinity },
              }}
            />
          )}
        </AnimatePresence>

        <div className="relative rounded-3xl border border-border/40 bg-muted/30 p-8 backdrop-blur-sm md:p-12">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Stay Updated
              </h2>
              <p className="text-muted-foreground">
                Get the latest posts delivered right to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    disabled={status === "loading" || status === "success"}
                    className={`w-full rounded-full bg-background px-6 py-3 text-sm outline-none ring-1 transition-all duration-200 disabled:opacity-50 ${
                      validationError
                        ? "ring-destructive focus:ring-2 focus:ring-destructive"
                        : "ring-border focus:ring-2 focus:ring-primary/40"
                    }`}
                    aria-invalid={!!validationError}
                    aria-describedby={validationError ? "email-error" : undefined}
                  />
                  <AnimatePresence mode="wait">
                    {validationError && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-2 px-2 text-sm text-destructive"
                        role="alert"
                      >
                        {validationError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {status === "loading"
                    ? "Subscribing..."
                    : status === "success"
                      ? "Subscribed!"
                      : "Subscribe"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`text-sm text-center ${
                      status === "success" ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <p className="text-xs text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
