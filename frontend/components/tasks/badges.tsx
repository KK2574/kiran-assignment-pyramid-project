import { BarChart2 } from "lucide-react";
import type { Priority, Member } from "@/lib/types";
import { PRIORITY_LABEL } from "@/lib/task-store";

const PRIORITY_COLOR: Record<Priority, string> = {
  no_priority: "#a3a3a3",
  low: "#a3a3a3",
  medium: "#f59e0b",
  high: "#f97316",
  urgent: "#ef4444",
};

export function PriorityDot({ priority }: { priority: Priority }) {
  if (priority === "no_priority") {
    return <span className="w-2 h-2 rounded-full border" style={{ borderColor: "var(--text-muted)" }} />;
  }
  return (
    <span
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: PRIORITY_COLOR[priority] }}
    />
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "no_priority") {
    return <span className="text-xs" style={{ color: "var(--text-muted)" }}>No Priority</span>;
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium"
      style={{ color: PRIORITY_COLOR[priority] }}
    >
      <BarChart2 size={12} />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

export function MemberAvatar({ member }: { member?: Member }) {
  if (!member) {
    return (
      <span
        className="w-6 h-6 rounded-full border border-dashed flex items-center justify-center text-[10px]"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        +
      </span>
    );
  }
  // Real generated avatar art (DiceBear's "shapes" style: colorful abstract
  // blobs, no external asset management needed) instead of a hand-rolled
  // CSS gradient — matches the photo-like avatar look in the Figma
  // reference far better than any flat-color approximation can.
  const seed = encodeURIComponent(member.id || member.name);
  const src = `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}&backgroundType=gradientLinear`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={member.name}
      title={member.name}
      className="w-6 h-6 rounded-full shrink-0 object-cover"
    />
  );
}