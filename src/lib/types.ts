export type EventStatus =
  | "Draft"
  | "Upcoming"
  | "Registration Open"
  | "Live"
  | "Processing"
  | "Completed"
  | "Archived";

export type EventType =
  | "Workshop"
  | "AI Challenge"
  | "Hackathon"
  | "Quiz"
  | "Coding Competition"
  | "Webinar"
  | "Mini Project";

export interface EventRecord {
  id: string;
  code: string;
  name: string;
  type: EventType;
  description: string;
  status: EventStatus;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  capacity: number;
  organizer: string;
  lastActivityAt: string;
}

export type RegistrationStatus = "Registered" | "Confirmed" | "Waitlisted" | "Cancelled";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type AttendanceStatus = "Attended" | "Partial" | "Absent" | "Unknown";

export type CertificateStatus =
  | "Not Eligible"
  | "Pending Approval"
  | "Approved"
  | "Pending Generation"
  | "Generated"
  | "Failed"
  | "Delivered";

export type EmailStatus = "Not Queued" | "Queued" | "Sent" | "Pending" | "Failed" | "Retry Required";

export type EmailType =
  | "Registration Confirmation"
  | "Event Reminder"
  | "Certificate Delivery"
  | "Winner Announcement"
  | "Event Update"
  | "Feedback Request";

export interface Participant {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  emailValid: boolean;
  college: string;
  branch: string;
  year: string;
  registrationStatus: RegistrationStatus;
  approval: ApprovalStatus;
  attendance: AttendanceStatus;
  certificateStatus: CertificateStatus;
  emailStatus: EmailStatus;
  registeredAt: string;
  lastActivityAt: string;
}

export type CertificateType = "Participation" | "Merit" | "Winner" | "Mentor";

export interface Certificate {
  id: string;
  participantId: string;
  eventId: string;
  type: CertificateType;
  status: CertificateStatus;
  generatedAt: string | null;
  fileRef: string | null;
  emailStatus: EmailStatus;
  failureReason?: string | undefined;
}

export interface EmailRecord {
  id: string;
  participantId: string;
  eventId: string;
  recipient: string;
  type: EmailType;
  status: EmailStatus;
  attempts: number;
  sentAt: string | null;
  failureReason?: string | undefined;
  subject: string;
}

export type AutomationState = "Active" | "Paused" | "Running" | "Completed" | "Failed";

export interface Automation {
  id: string;
  name: string;
  category: "Registration" | "Certificates" | "Email" | "Lifecycle" | "Integrity";
  trigger: string;
  action: string;
  state: AutomationState;
  engine: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  processed: number;
  successful: number;
  failed: number;
  steps: string[];
}

export interface AutomationRunStep {
  name: string;
  status: "Completed" | "Warning" | "Failed" | "Skipped";
  durationMs: number;
  detail: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  eventId: string;
  status: "Completed" | "Completed with warnings" | "Running" | "Failed";
  startedAt: string;
  finishedAt: string | null;
  processed: number;
  successful: number;
  skipped: number;
  failed: number;
  steps: AutomationRunStep[];
  batches: { name: string; total: number; completed: number; failed: number }[];
}

export interface ActivityLog {
  id: string;
  at: string;
  action: string;
  entity: string;
  entityId: string;
  status: "Success" | "Warning" | "Failed" | "Info";
  actor: string;
  eventId: string;
}

export type Severity = "critical" | "warning" | "info";

export interface Issue {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  count: number;
  actionLabel: string;
  to: string;
  search?: Record<string, string>;
}
