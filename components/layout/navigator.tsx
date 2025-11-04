"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [activeSection, setActiveSection] = useState("home");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

  useEffect(() => {
    // Determine active section and project based on pathname
    if (pathname === "/") {
      setActiveSection("home");
      setActiveProject(null);
      setIsProjectsExpanded(false);
    } else if (pathname.startsWith("/projects")) {
      setActiveSection("projects");
      setIsProjectsExpanded(true);

      // Check if on a specific project page
      const projectMatch = pathname.match(/\/projects\/([^/]+)/);
      if (projectMatch) {
        const projectSlug = projectMatch[1];
        const matchedProject = projects.find(
          (p) => p.toLowerCase().replace(/\s+/g, '-') === projectSlug
        );
        setActiveProject(matchedProject || null);
      } else {
        setActiveProject(null);
      }
    } else if (pathname.startsWith("/productivity")) {
      setActiveSection("productivity");
      setActiveProject(null);
      setIsProjectsExpanded(false);
    } else if (pathname.startsWith("/life")) {
      setActiveSection("life");
      setActiveProject(null);
      setIsProjectsExpanded(false);
    }
  }, [pathname, projects]);

  return (
    <nav className="fixed left-4 md:left-8 top-4 md:top-8 z-50 max-w-[200px]">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`block text-sm md:text-base transition-colors cursor-fancy ${
                item.id === activeSection
                  ? "text-foreground line-through"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>

            {/* Show nested projects when on projects section */}
            {item.id === "projects" && isProjectsExpanded && projects.length > 0 && (
              <ul className="mt-2 ml-4 space-y-1.5 border-l border-muted-foreground/20 pl-3">
                {projects.map((project) => {
                  const projectSlug = project.toLowerCase().replace(/\s+/g, '-');
                  const isActive = activeProject === project;

                  return (
                    <li key={project}>
                      <Link
                        href={`/projects/${projectSlug}`}
                        className={`block text-xs md:text-sm transition-colors cursor-fancy ${
                          isActive
                            ? "text-foreground line-through"
                            : "text-muted-foreground/80 hover:text-foreground"
                        }`}
                      >
                        {project}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
