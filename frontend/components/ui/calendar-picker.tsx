"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarPickerProps {
  value?: string; // ISO date
  onSelect: (isoDate: string) => void;
  placeholder?: string;
}

// Self-contained trigger + popover. Renders the calendar body through a
// portal positioned by the trigger's actual screen coordinates (clamped to
// the viewport), so it can never get clipped or pushed off-screen by a
// narrow parent container — the same fix that solved this for ActionMenu.
export function CalendarPicker({ value, onSelect, placeholder = "Set date" }: CalendarPickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Standard client-mount-detection pattern — portal must not render during SSR.
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const initial = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const popoverWidth = 288;
    setPos({
      top: rect.bottom + 6,
      left: Math.min(rect.left, window.innerWidth - popoverWidth - 8),
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current && !btnRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; inMonth: boolean; iso: string }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const d = new Date(viewYear, viewMonth - 1, day);
    cells.push({ day, inMonth: false, iso: d.toISOString().slice(0, 10) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(viewYear, viewMonth, day);
    cells.push({ day, inMonth: true, iso: d.toISOString().slice(0, 10) });
  }
  while (cells.length < 42) {
    const day = cells.length - (startWeekday + daysInMonth) + 1;
    const d = new Date(viewYear, viewMonth + 1, day);
    cells.push({ day, inMonth: false, iso: d.toISOString().slice(0, 10) });
  }

  const selectedIso = value ? new Date(value).toISOString().slice(0, 10) : null;
  const todayIso = new Date().toISOString().slice(0, 10);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1"
      >
        <CalendarIcon size={12} />
        {value
          ? new Date(value).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
          : placeholder}
      </button>

      {open && mounted &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[999] rounded-xl border shadow-lg p-3 w-72"
            style={{ top: pos.top, left: pos.left, background: "var(--bg)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <button onClick={prevMonth} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5">
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm font-medium">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={nextMonth} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((d) => (
                <span key={d} className="text-[11px] text-center py-1" style={{ color: "var(--text-muted)" }}>
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((c, i) => {
                const isSelected = c.iso === selectedIso;
                const isToday = c.iso === todayIso;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onSelect(c.iso);
                      setOpen(false);
                    }}
                    className="text-xs py-1.5 rounded-full"
                    style={{
                      color: !c.inMonth ? "var(--text-muted)" : "inherit",
                      background: isSelected ? "var(--accent)" : isToday ? "var(--bg-subtle)" : "transparent",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <span style={{ color: isSelected ? "white" : undefined }}>{c.day}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
