/**
 * Derived operational metrics. Pure functions over the data layer so a real
 * database/automation engine can swap in without touching presentation code.
 */
import { activityLogs, automationRuns, automations, certificates, emails, events, participants } from "./demo-data";
import type { EventRecord, Issue } from "./types";

export function getEvent(eventId: string): EventRecord | undefined {
  return events.find((e) => e.id === eventId);
}

export function participantsFor(eventId?: string) {
  return eventId ? participants.filter((p) => p.eventId === eventId) : participants;
}

export function certificatesFor(eventId?: string) {
  return eventId ? certificates.filter((c) => c.eventId === eventId) : certificates;
}

export function emailsFor(eventId?: string) {
  return eventId ? emails.filter((m) => m.eventId === eventId) : emails;
}

export function runsFor(eventId?: string) {
  return eventId ? automationRuns.filter((r) => r.eventId === eventId) : automationRuns;
}

export function activityFor(eventId?: string) {
  return eventId ? activityLogs.filter((a) => a.eventId === eventId) : activityLogs;
}

export interface EventMetrics {
  registrations: number;
  confirmed: number;
  attended: number;
  pendingApproval: number;
  certificatesEligible: number;
  certificatesGenerated: number;
  certificatesPending: number;
  certificatesFailed: number;
  certificatesDelivered: number;
  emailsSent: number;
  emailsPending: number;
  emailsFailed: number;
  emailsRetry: number;
  invalidEmails: number;
  failedOperations: number;
  capacity: number;
}

export function eventMetrics(eventId?: string): EventMetrics {
  const ps = participantsFor(eventId);
  const cs = certificatesFor(eventId);
  const ms = emailsFor(eventId);
  const certFailed = cs.filter((c) => c.status === "Failed").length;
  const emailFailed = ms.filter((m) => m.status === "Failed").length;

  return {
    registrations: ps.length,
    confirmed: ps.filter((p) => p.registrationStatus === "Confirmed").length,
    attended: ps.filter((p) => p.attendance === "Attended" || p.attendance === "Partial").length,
    pendingApproval: ps.filter((p) => p.approval === "Pending").length,
    certificatesEligible: cs.length,
    certificatesGenerated: cs.filter((c) => c.status === "Generated" || c.status === "Delivered").length,
    certificatesPending: cs.filter((c) => c.status === "Pending Generation" || c.status === "Approved").length,
    certificatesFailed: certFailed,
    certificatesDelivered: cs.filter((c) => c.status === "Delivered").length,
    emailsSent: ms.filter((m) => m.status === "Sent").length,
    emailsPending: ms.filter((m) => m.status === "Queued" || m.status === "Pending").length,
    emailsFailed: emailFailed,
    emailsRetry: ms.filter((m) => m.status === "Retry Required").length,
    invalidEmails: ps.filter((p) => !p.emailValid).length,
    failedOperations: certFailed + emailFailed,
    capacity: eventId ? (getEvent(eventId)?.capacity ?? 0) : events.reduce((a, e) => a + e.capacity, 0),
  };
}

export type HealthState = "Healthy" | "Attention needed" | "Critical" | "Idle";

export interface HealthLine {
  label: string;
  state: HealthState;
  detail: string;
}

export function eventHealth(eventId?: string): HealthLine[] {
  const m = eventMetrics(eventId);
  const regState: HealthState = m.registrations === 0 ? "Idle" : m.invalidEmails > 3 ? "Attention needed" : "Healthy";
  const certState: HealthState =
    m.certificatesFailed > 0 ? "Attention needed" : m.certificatesPending > 0 ? "Attention needed" : m.certificatesEligible ? "Healthy" : "Idle";
  const mailState: HealthState =
    m.emailsFailed > 5 ? "Critical" : m.emailsFailed > 0 || m.emailsRetry > 0 ? "Attention needed" : m.emailsSent ? "Healthy" : "Idle";

  return [
    { label: "Registration", state: regState, detail: `${m.registrations} records · ${m.invalidEmails} invalid addresses` },
    { label: "Certificates", state: certState, detail: `${m.certificatesPending} pending · ${m.certificatesFailed} failed` },
    { label: "Email delivery", state: mailState, detail: `${m.emailsSent} sent · ${m.emailsFailed} failed · ${m.emailsRetry} retry` },
    {
      label: "Pending approvals",
      state: m.pendingApproval > 0 ? "Attention needed" : "Healthy",
      detail: `${m.pendingApproval} participants awaiting approval`,
    },
    {
      label: "Failed operations",
      state: m.failedOperations > 0 ? "Critical" : "Healthy",
      detail: `${m.failedOperations} across certificate + email pipelines`,
    },
  ];
}

export function eventIssues(eventId?: string): Issue[] {
  const m = eventMetrics(eventId);
  const list: Issue[] = [];

  if (m.certificatesFailed > 0) {
    list.push({
      id: "cert-failed",
      severity: "critical",
      title: `${m.certificatesFailed} certificate generation failures`,
      description: "Template or export errors blocked these certificates. They can be retried individually or in bulk.",
      count: m.certificatesFailed,
      actionLabel: "Review",
      to: "/certificates",
      search: { status: "Failed" },
    });
  }
  if (m.emailsFailed > 0) {
    list.push({
      id: "email-failed",
      severity: "critical",
      title: `${m.emailsFailed} email deliveries failed`,
      description: "Recipient host deferrals and malformed addresses. Retry is safe — already-sent mail is skipped.",
      count: m.emailsFailed,
      actionLabel: "Review",
      to: "/emails",
      search: { status: "Failed" },
    });
  }
  if (m.pendingApproval > 0) {
    list.push({
      id: "approval-pending",
      severity: "warning",
      title: `${m.pendingApproval} participants awaiting approval`,
      description: "Approval is the gate into certificate generation. Nothing downstream runs until this clears.",
      count: m.pendingApproval,
      actionLabel: "Open queue",
      to: "/participants",
      search: { approval: "Pending" },
    });
  }
  if (m.certificatesPending > 0) {
    list.push({
      id: "cert-pending",
      severity: "warning",
      title: `${m.certificatesPending} certificates pending generation`,
      description: "Approved and eligible, waiting for the generation queue to process them.",
      count: m.certificatesPending,
      actionLabel: "View queue",
      to: "/certificates",
      search: { status: "Pending Generation" },
    });
  }
  if (m.invalidEmails > 0) {
    list.push({
      id: "email-invalid",
      severity: "warning",
      title: `${m.invalidEmails} invalid email addresses`,
      description: "These participants can never receive delivery. Correct the address before requeuing.",
      count: m.invalidEmails,
      actionLabel: "Fix records",
      to: "/participants",
      search: { flag: "invalid-email" },
    });
  }
  if (m.emailsRetry > 0) {
    list.push({
      id: "email-retry",
      severity: "info",
      title: `${m.emailsRetry} emails require retry`,
      description: "Send quota was reached during the last dispatch window.",
      count: m.emailsRetry,
      actionLabel: "Review",
      to: "/emails",
      search: { status: "Retry Required" },
    });
  }

  const order = { critical: 0, warning: 1, info: 2 } as const;
  return list.sort((a, b) => order[a.severity] - order[b.severity]);
}

export interface QueueSnapshot {
  name: string;
  total: number;
  processed: number;
  pending: number;
  failed: number;
  batches: { name: string; total: number; completed: number; failed: number }[];
}

export function certificateQueue(eventId?: string): QueueSnapshot {
  const run = automationRuns.find((r) => r.automationId === "auto-cert-generation");
  const m = eventMetrics(eventId);
  return {
    name: "Certificate Generation Queue",
    total: m.certificatesEligible,
    processed: m.certificatesGenerated,
    pending: m.certificatesPending,
    failed: m.certificatesFailed,
    batches: run?.batches ?? [],
  };
}

export function automationSummary() {
  return {
    total: automations.length,
    active: automations.filter((a) => a.state === "Active").length,
    running: automations.filter((a) => a.state === "Running").length,
    paused: automations.filter((a) => a.state === "Paused").length,
    failed: automations.filter((a) => a.state === "Failed").length,
  };
}

export const LIFECYCLE_STAGES = [
  "Registration",
  "Validation",
  "Approval",
  "Attendance",
  "Eligibility",
  "Certificate Generation",
  "PDF",
  "Email Queue",
  "Email Delivery",
  "Completion",
] as const;

export function lifecycleProgress(eventId?: string) {
  const m = eventMetrics(eventId);
  const stageValue: Record<(typeof LIFECYCLE_STAGES)[number], { value: number; total: number }> = {
    Registration: { value: m.registrations, total: m.capacity },
    Validation: { value: m.registrations - m.invalidEmails, total: m.registrations },
    Approval: { value: m.registrations - m.pendingApproval, total: m.registrations },
    Attendance: { value: m.attended, total: m.registrations },
    Eligibility: { value: m.certificatesEligible, total: m.attended || m.registrations },
    "Certificate Generation": { value: m.certificatesGenerated, total: m.certificatesEligible },
    PDF: { value: m.certificatesGenerated, total: m.certificatesEligible },
    "Email Queue": { value: m.emailsPending + m.emailsSent, total: m.certificatesEligible },
    "Email Delivery": { value: m.emailsSent, total: m.certificatesEligible },
    Completion: { value: m.certificatesDelivered, total: m.certificatesEligible },
  };
  return LIFECYCLE_STAGES.map((stage) => ({ stage, ...stageValue[stage] }));
}
