"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "lucide-react";
import { extractMarkdownHeadings, type MarkdownHeading } from "@/lib/markdown-headings";

interface MarkdownNavigatorProps {
  content: string;
}

export function MarkdownNavigator({ content }: MarkdownNavigatorProps) {
  const headings = useMemo<MarkdownHeading[]>(
    () => extractMarkdownHeadings(content),
    [content]
  );
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const manualScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualScrollActive = useRef(false);

  const lockManualScroll = (duration: number) => {
    isManualScrollActive.current = true;
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }
    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollActive.current = false;
      manualScrollTimeoutRef.current = null;
    }, duration);
  };

  useEffect(() => {
    // Show navigator after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Observe heading elements and update active state
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrollActive.current) {
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((prev) =>
              prev === entry.target.id ? prev : entry.target.id
            );
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    return () => {
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      const distance = Math.abs(offsetPosition - window.scrollY);
      const lockDuration = Math.min(
        1800,
        Math.max(600, distance * 0.35)
      );

      setActiveId(id);
      lockManualScroll(Math.round(lockDuration));
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close mobile menu after navigation
      setIsMobileOpen(false);
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="fixed bottom-6 right-6 z-50 lg:hidden p-3 rounded-full bg-foreground text-background shadow-lg hover:scale-110 transition-transform cursor-fancy"
            aria-label="Toggle table of contents"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <List className="h-5 w-5" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-24 right-6 left-6 z-50 lg:hidden max-h-[60vh] overflow-y-auto bg-card border border-border/40 rounded-2xl p-6 shadow-2xl"
            >
              <div className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                On this page
              </div>
              <ul className="space-y-2 border-l border-border/40">
                {headings.map(({ id, text, level }) => {
                  const isActive = activeId === id;
                  const isH1 = level === 1;
                  const isH3 = level === 3;

                  return (
                    <li
                      key={id}
                      className={`relative ${
                        isH3 ? "ml-4" : isH1 ? "" : "ml-2"
                      }`}
                    >
                      <button
                        onClick={() => handleClick(id)}
                        className={`block w-full text-left text-sm transition-all duration-200 pl-4 py-1.5 cursor-fancy ${
                          isActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        } ${isH1 ? "font-medium" : ""}`}
                      >
                        {text}
                      </button>
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed right-4 md:right-8 top-24 z-40 max-w-[240px] hidden lg:block"
          >
            <div className="sticky top-24">
              <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                On this page
              </div>
              <ul className="space-y-2 border-l border-border/40">
                {headings.map(({ id, text, level }) => {
                  const isActive = activeId === id;
                  const isH1 = level === 1;
                  const isH3 = level === 3;

                  return (
                    <li
                      key={id}
                      className={`relative ${
                        isH3 ? "ml-4" : isH1 ? "" : "ml-2"
                      }`}
                    >
                      <button
                        onClick={() => handleClick(id)}
                        className={`block w-full text-left text-sm transition-all duration-200 pl-4 py-1 cursor-fancy ${
                          isActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        } ${isH1 ? "font-medium" : ""}`}
                      >
                        {text}
                      </button>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
