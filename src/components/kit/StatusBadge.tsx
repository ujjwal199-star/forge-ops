import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "primary";

const TONE_MAP: Record<string, Tone> = {
  // events
  Draft: "neutral",
  Upcoming: "info",
  "Registration Open": "primary",
  Live: "success",
  Processing: "warning",
  Completed: "success",
  Archived: "neutral",
  // registration / approval / attendance
  Registered: "info",
  Confirmed: "success",
  Waitlisted: "warning",
  Cancelled: "neutral",
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
  Attended: "success",
  Partial: "warning",
  Absent: "neutral",
  Unknown: "neutral",
  // certificates
  "Not Eligible": "neutral",
  "Pending Approval": "warning",
  "Pending Generation": "info",
  Generated: "success",
  Failed: "danger",
  Delivered: "success",
  // email
  "Not Queued": "neutral",
  Queued: "info",
  Sent: "success",
  "Retry Required": "warning",
  // automation
  Active: "success",
  Paused: "neutral",
  Running: "primary",
  "Completed with warnings": "warning",
  Warning: "warning",
  Skipped: "neutral",
  Success: "success",
  Info: "info",
  // health
  Healthy: "success",
  "Attention needed": "warning",
  Critical: "danger",
  Idle: "neutral",
};

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-border-strong bg-muted text-muted-foreground",
  success: "border-success/25 bg-success/12 text-success",
  warning: "border-warning/25 bg-warning/12 text-warning",
  danger: "border-destructive/30 bg-destructive/12 text-destructive",
  info: "border-info/25 bg-info/12 text-info",
  primary: "border-primary/30 bg-primary/12 text-primary",
};

export function StatusBadge({
  status,
  className,
  dot = true,
}: {
  status: string;
  className?: string;
  dot?: boolean;
}) {
  const tone = TONE_MAP[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current opacity-80" /> : null}
      {status}
    </span>
  );
}
