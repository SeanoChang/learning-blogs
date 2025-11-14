"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const isDisabled = status === "loading" || status === "success";

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
        <div
          className={`relative rounded-3xl border border-border/40 bg-muted/30 p-8 backdrop-blur-sm transition-shadow duration-700 md:p-12 ${
            status === "loading"
              ? "shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-[breathe_2s_ease-in-out_infinite]"
              : status === "success"
                ? "shadow-[0_0_40px_rgba(255,255,255,0.6)]"
                : ""
          }`}
          style={
            status === "success"
              ? {
                  animation: "breathe-out 1s ease-out forwards",
                }
              : undefined
          }
        >
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
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <AnimatePresence mode="wait">
                  {status !== "success" && (
                    <motion.div
                      className="relative flex-1"
                      initial={{ opacity: 1, x: 0, flex: 1 }}
                      exit={{
                        opacity: 0,
                        x: -50,
                        flex: 0,
                        width: 0,
                        marginRight: 0,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="your@email.com"
                        disabled={isDisabled}
                        className={`w-full rounded-full bg-background px-6 py-3 text-sm outline-none ring-1 transition-all duration-200 disabled:opacity-50 ${
                          validationError
                            ? "ring-destructive focus:ring-2 focus:ring-destructive"
                            : "ring-border focus:ring-2 focus:ring-primary/40"
                        }`}
                        aria-invalid={!!validationError}
                        aria-describedby={
                          validationError ? "email-error" : undefined
                        }
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
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isDisabled}
                  className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  animate={
                    status === "success"
                      ? { scale: 1.1, paddingLeft: "3rem", paddingRight: "3rem" }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {status === "loading"
                    ? "Subscribing..."
                    : status === "success"
                      ? "Subscribed!"
                      : "Subscribe"}
                </motion.button>
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

      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes breathe-out {
          0% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
          }
          100% {
            box-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </motion.section>
  );
}
