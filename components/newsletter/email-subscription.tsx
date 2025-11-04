"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
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
      triggerConfetti();
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
      <div className="rounded-3xl bg-muted/30 backdrop-blur-sm p-8 md:p-12">
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
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
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
                      className="absolute left-0 top-full mt-2 text-sm text-destructive px-2"
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
                className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
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
    </motion.section>
  );
}
