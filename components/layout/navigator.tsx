"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { id: "home", name: "Home", href: "/" },
  { id: "projects", name: "Projects", href: "/projects" },
  { id: "productivity", name: "Productivity", href: "/productivity" },
  { id: "life", name: "Life", href: "/life" },
];

interface NavigatorProps {
  projects: string[];
}

export function Navigator({ projects }: NavigatorProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navigator after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Derive state from pathname instead of using effects
  const { activeSection, activeProject, isProjectsExpanded } = useMemo(() => {
    if (pathname === "/") {
      return { activeSection: "home", activeProject: null, isProjectsExpanded: false };
    } else if (pathname.startsWith("/projects")) {
      // Check if on a specific project page
      const projectMatch = pathname.match(/\/projects\/([^/]+)/);
      let matchedProject = null;

      if (projectMatch) {
        const projectSlug = projectMatch[1];
        matchedProject = projects.find(
          (p) => p.toLowerCase().replace(/\s+/g, '-') === projectSlug
        ) || null;
      }

      return { activeSection: "projects", activeProject: matchedProject, isProjectsExpanded: true };
    } else if (pathname.startsWith("/productivity")) {
      return { activeSection: "productivity", activeProject: null, isProjectsExpanded: false };
    } else if (pathname.startsWith("/life")) {
      return { activeSection: "life", activeProject: null, isProjectsExpanded: false };
    }

    return { activeSection: "home", activeProject: null, isProjectsExpanded: false };
  }, [pathname, projects]);

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-4 md:left-8 top-24 z-40 max-w-[200px]"
    >
      <div className="sticky top-24">
        <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Navigation
        </div>
        <ul className="space-y-2 border-l border-border/40">
          {navItems.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <li key={item.id} className="relative">
                <Link
                  href={item.href}
                  className={`block text-sm transition-all duration-200 pl-4 py-1 cursor-fancy ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>

                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {/* Show nested projects when on projects section */}
                {item.id === "projects" && isProjectsExpanded && projects.length > 0 && (
                  <ul className="mt-2 ml-2 space-y-2 border-l border-border/40">
                    {projects.map((project) => {
                      const projectSlug = project.toLowerCase().replace(/\s+/g, '-');
                      const isProjectActive = activeProject === project;

                      return (
                        <li key={project} className="relative ml-2">
                          <Link
                            href={`/projects/${projectSlug}`}
                            className={`block text-sm transition-all duration-200 pl-4 py-1 cursor-fancy ${
                              isProjectActive
                                ? "text-foreground font-medium"
                                : "text-muted-foreground/80 hover:text-foreground"
                            }`}
                          >
                            {project}
                          </Link>

                          {isProjectActive && (
                            <motion.div
                              layoutId="activeProjectIndicator"
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
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}
