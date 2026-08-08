"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

interface MenuAction {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export function ActionMenu({ actions }: { actions: MenuAction[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const menuWidth = 160;
    setPos({
      top: rect.bottom + 4,
      left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current &&
        !btnRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
      >
        <MoreHorizontal size={14} className="opacity-50" />
      </button>

      {open && mounted &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.preventDefault()}
            className="fixed z-[999] w-40 rounded-xl border shadow-lg p-1 text-sm"
            style={{ top: pos.top, left: pos.left, background: "var(--bg)", borderColor: "var(--border)" }}
          >
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  a.onClick();
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: a.danger ? "#ef4444" : "inherit" }}
              >
                {a.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
