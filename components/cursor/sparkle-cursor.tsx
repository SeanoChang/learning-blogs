"use client";

import { useEffect, useRef } from "react";

export function SparkleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor position
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === "A" ||
                           target.tagName === "BUTTON" ||
                           target.closest("a") ||
                           target.closest("button");

      // Add/remove hovering class
      if (isInteractive) {
        cursor.classList.add("hovering");
      } else {
        cursor.classList.remove("hovering");
      }
    };

    const handleMouseDown = () => {
      cursor.classList.add("clicking");
    };

    const handleMouseUp = () => {
      cursor.classList.remove("clicking");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div id="custom-cursor" ref={cursorRef}>
      <div className="cursor-square" />
    </div>
  );
}
