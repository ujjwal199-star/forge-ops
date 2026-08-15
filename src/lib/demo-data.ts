/**
 * Deterministic DEMO / SAMPLE dataset for Forge Realm Event OS.
 * This is illustrative data only — not production statistics.
 * Shapes mirror the intended relational model (events, participants,
 * certificates, emails, automation_runs, activity_logs) so a real
 * database + automation engine can replace this module in place.
 */
import type {
  ActivityLog,
  Automation,
  AutomationRun,
  Certificate,
  EmailRecord,
  EmailType,
  EventRecord,
  Participant,
} from "./types";

/* ---------------------------------- rng --------------------------------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rng: () => number, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]!;

/* --------------------------------- names -------------------------------- */

const FIRST = [
  "Aarav","Diya","Ishaan","Ananya","Kabir","Meera","Rohan","Sanya","Vihaan","Aditi",
  "Arjun","Nikita","Yash","Pooja","Rahul","Sneha","Karan","Tanvi","Devansh","Riya",
  "Manav","Shreya","Aman","Kritika","Harsh","Nandini","Siddharth","Priya","Om","Anika",
  "Faizan","Zoya","Rudra","Bhavya","Neel","Ira","Tejas","Lavanya","Vivek","Charu",
] as const;

const LAST = [
  "Sharma","Verma","Patel","Reddy","Nair","Iyer","Singh","Gupta","Joshi","Mehta",
  "Chauhan","Kulkarni","Das","Bose","Menon","Rathore","Bansal","Kapoor","Pillai","Saxena",
] as const;

const COLLEGES = [
  "Vellore Institute of Technology",
  "SRM Institute of Science & Technology",
  "Amrita Vishwa Vidyapeetham",
  "Manipal Institute of Technology",
  "PES University",
  "Thapar Institute of Engineering",
  "BMS College of Engineering",
  "Chandigarh University",
  "Lovely Professional University",
  "Netaji Subhas University of Technology",
  "Delhi Technological University",
  "Sardar Patel Institute of Technology",
] as const;

const BRANCHES = ["CSE", "IT", "ECE", "AI & DS", "EEE", "Mechanical", "MCA"] as const;
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;

/* --------------------------------- events -------------------------------- */

const iso = (d: Date) => d.toISOString();
const day = (base: string, offsetDays: number, hour = 10, minute = 0) => {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(hour, minute, 0, 0);
  return iso(d);
};

const ANCHOR = "2026-08-15T00:00:00.000Z";

export const events: EventRecord[] = [
  {
    id: "evt-promptforge-1",
    code: "PF1",
    name: "PromptForge #1",
    type: "AI Challenge",
    description:
      "Flagship prompt-engineering challenge. Participants build, refine and defend prompt systems across three timed rounds.",
    status: "Processing",
    startAt: day(ANCHOR, -6, 9, 30),
    endAt: day(ANCHOR, -5, 18, 0),
    registrationDeadline: day(ANCHOR, -8, 23, 59),
    capacity: 800,
    organizer: "Hima Singh",
    lastActivityAt: day(ANCHOR, 0, 6, 12),
  },
  {
    id: "evt-codeforge-sprint",
    code: "CFS",
    name: "CodeForge Sprint",
    type: "Coding Competition",
    description: "Three-hour competitive programming sprint with live leaderboard rounds.",
    status: "Registration Open",
    startAt: day(ANCHOR, 11, 10, 0),
    endAt: day(ANCHOR, 11, 13, 0),
    registrationDeadline: day(ANCHOR, 9, 23, 59),
    capacity: 400,
    organizer: "Hima Singh",
    lastActivityAt: day(ANCHOR, 0, 5, 44),
  },
  {
    id: "evt-realm-hack-24h",
    code: "RH24",
    name: "Realm Hack 24H",
    type: "Hackathon",
    description: "Overnight build sprint across four problem tracks with mentor checkpoints.",
    status: "Upcoming",
    startAt: day(ANCHOR, 24, 9, 0),
    endAt: day(ANCHOR, 25, 12, 0),
    registrationDeadline: day(ANCHOR, 21, 23, 59),
    capacity: 300,
    organizer: "Ops Team",
    lastActivityAt: day(ANCHOR, -1, 17, 5),
  },
  {
    id: "evt-ml-foundations",
    code: "MLF",
    name: "ML Foundations Workshop",
    type: "Workshop",
    description: "Two-session hands-on workshop covering the practical ML lifecycle.",
    status: "Completed",
    startAt: day(ANCHOR, -34, 15, 0),
    endAt: day(ANCHOR, -33, 18, 0),
    registrationDeadline: day(ANCHOR, -37, 23, 59),
    capacity: 250,
    organizer: "Hima Singh",
    lastActivityAt: day(ANCHOR, -30, 11, 20),
  },
  {
    id: "evt-quizrealm-2",
    code: "QR2",
    name: "QuizRealm #2",
    type: "Quiz",
    description: "Rapid-fire technology quiz across five thematic rounds.",
    status: "Draft",
    startAt: day(ANCHOR, 40, 16, 0),
    endAt: day(ANCHOR, 40, 18, 0),
    registrationDeadline: day(ANCHOR, 37, 23, 59),
    capacity: 200,
    organizer: "Ops Team",
    lastActivityAt: day(ANCHOR, -2, 9, 15),
  },
];

const EVENT_SIZES: Record<string, number> = {
  "evt-promptforge-1": 743,
  "evt-codeforge-sprint": 218,
  "evt-realm-hack-24h": 96,
  "evt-ml-foundations": 187,
  "evt-quizrealm-2": 0,
};

/* ----------------------------- participants ------------------------------ */

interface Generated {
  participants: Participant[];
  certificates: Certificate[];
  emails: EmailRecord[];
}

function generate(): Generated {
  const participants: Participant[] = [];
  const certificates: Certificate[] = [];
  const emails: EmailRecord[] = [];

  events.forEach((event, eventIndex) => {
    const size = EVENT_SIZES[event.id] ?? 0;
    const rng = mulberry32(1337 + eventIndex * 97);
    const processed = event.status === "Processing" || event.status === "Completed";

    for (let i = 1; i <= size; i++) {
      const first = pick(rng, FIRST);
      const last = pick(rng, LAST);
      const seq = String(i).padStart(6, "0");
      const id = `FR-${event.code}-${seq}`;
      const emailValid = rng() > 0.006;
      const handle = `${first}.${last}`.toLowerCase();
      const email = emailValid
        ? `${handle}${i % 7}@${["vitstudent.ac.in", "srmist.edu.in", "gmail.com", "pes.edu"][i % 4]}`
        : `${handle}@invalid..edu`;

      const registeredAt = (() => {
        const d = new Date(event.registrationDeadline);
        d.setUTCDate(d.getUTCDate() - Math.floor(rng() * 14));
        d.setUTCHours(Math.floor(rng() * 24), Math.floor(rng() * 60), 0, 0);
        return iso(d);
      })();

      const r = rng();
      const registrationStatus =
        r > 0.965 ? "Cancelled" : r > 0.94 ? "Waitlisted" : r > 0.09 ? "Confirmed" : "Registered";

      const approval: Participant["approval"] = !processed
        ? registrationStatus === "Confirmed" && rng() > 0.35
          ? "Approved"
          : "Pending"
        : registrationStatus === "Cancelled"
          ? "Rejected"
          : i <= size - 7
            ? "Approved"
            : "Pending";

      const attendance: Participant["attendance"] = !processed
        ? "Unknown"
        : approval !== "Approved"
          ? "Absent"
          : rng() > 0.94
            ? "Partial"
            : rng() > 0.02
              ? "Attended"
              : "Absent";

      let certificateStatus: Participant["certificateStatus"] = "Not Eligible";
      let emailStatus: Participant["emailStatus"] = "Not Queued";

      if (processed) {
        const eligible = approval === "Approved" && attendance !== "Absent";
        if (!eligible) {
          certificateStatus = approval === "Pending" ? "Pending Approval" : "Not Eligible";
        } else if (i <= size - 22) {
          certificateStatus = "Delivered";
          emailStatus = "Sent";
        } else if (i <= size - 15) {
          certificateStatus = "Generated";
          emailStatus = emailValid ? "Queued" : "Failed";
        } else if (i <= size - 12) {
          certificateStatus = "Failed";
          emailStatus = "Not Queued";
        } else if (i <= size - 4) {
          certificateStatus = "Pending Generation";
          emailStatus = "Not Queued";
        } else {
          certificateStatus = "Approved";
          emailStatus = "Not Queued";
        }
      } else if (registrationStatus !== "Cancelled") {
        certificateStatus = approval === "Approved" ? "Approved" : "Pending Approval";
        emailStatus = emailValid ? "Sent" : "Failed";
      }

      const lastActivityAt = (() => {
        const d = new Date(event.lastActivityAt);
        d.setUTCMinutes(d.getUTCMinutes() - Math.floor(rng() * 60 * 96));
        return iso(d);
      })();

      participants.push({
        id,
        eventId: event.id,
        fullName: `${first} ${last}`,
        email,
        emailValid,
        college: pick(rng, COLLEGES),
        branch: pick(rng, BRANCHES),
        year: pick(rng, YEARS),
        registrationStatus,
        approval,
        attendance,
        certificateStatus,
        emailStatus,
        registeredAt,
        lastActivityAt,
      });

      // certificate record for anything that entered the certificate pipeline
      if (certificateStatus !== "Not Eligible" && certificateStatus !== "Pending Approval") {
        const type =
          i % 211 === 0 ? "Winner" : i % 53 === 0 ? "Merit" : i % 149 === 0 ? "Mentor" : "Participation";
        const generated = certificateStatus === "Generated" || certificateStatus === "Delivered";
        certificates.push({
          id: `CERT-${event.code}-${seq}`,
          participantId: id,
          eventId: event.id,
          type,
          status: certificateStatus,
          generatedAt: generated ? lastActivityAt : null,
          fileRef: generated ? `drive://forge-realm/${event.code}/${id}.pdf` : null,
          emailStatus,
          failureReason:
            certificateStatus === "Failed"
              ? pick(rng, [
                  "Template placeholder {{name}} unresolved",
                  "Docs export timed out after 30s",
                  "Drive folder quota exceeded",
                ])
              : undefined,
        });
      }

      // email records
      const mails: { type: EmailType; status: Participant["emailStatus"] }[] = [];
      if (registrationStatus !== "Cancelled") {
        mails.push({
          type: "Registration Confirmation",
          status: emailValid ? "Sent" : "Failed",
        });
      }
      if (certificateStatus === "Delivered" || certificateStatus === "Generated") {
        mails.push({ type: "Certificate Delivery", status: emailStatus });
      }
      if (event.status === "Upcoming" || event.status === "Registration Open") {
        if (rng() > 0.6) mails.push({ type: "Event Reminder", status: "Queued" });
      }
      if (event.status === "Completed" && rng() > 0.7) {
        mails.push({ type: "Feedback Request", status: rng() > 0.05 ? "Sent" : "Retry Required" });
      }

      mails.forEach((m, mi) => {
        const sent = m.status === "Sent";
        emails.push({
          id: `MAIL-${event.code}-${seq}-${mi + 1}`,
          participantId: id,
          eventId: event.id,
          recipient: email,
          type: m.type,
          status: m.status,
          attempts: m.status === "Failed" ? 3 : m.status === "Retry Required" ? 2 : sent ? 1 : 0,
          sentAt: sent ? lastActivityAt : null,
          subject:
            m.type === "Certificate Delivery"
              ? `Your ${event.name} certificate is ready`
              : m.type === "Registration Confirmation"
                ? `You're registered for ${event.name}`
                : m.type === "Event Reminder"
                  ? `${event.name} starts soon`
                  : `${event.name} — ${m.type}`,
          failureReason:
            m.status === "Failed"
              ? emailValid
                ? "SMTP 421: temporary deferral from recipient host"
                : "Invalid recipient address (malformed domain)"
              : m.status === "Retry Required"
                ? "Gmail daily send quota reached — retry scheduled"
                : undefined,
        });
      });
    }
  });

  return { participants, certificates, emails };
}

const generated = generate();

export const participants = generated.participants;
export const certificates = generated.certificates;
export const emails = generated.emails;

/* ------------------------------ automations ------------------------------ */

export const automations: Automation[] = [
  {
    id: "auto-cert-generation",
    name: "Certificate Generation",
    category: "Certificates",
    trigger: "Approved participant + eligible certificate",
    action: "Generate certificate → create PDF → store in Drive → update status",
    state: "Running",
    engine: "Apps Script engine (external)",
    lastRunAt: day(ANCHOR, 0, 5, 40),
    nextRunAt: day(ANCHOR, 0, 7, 0),
    processed: 743,
    successful: 712,
    failed: 3,
    steps: ["Validate", "Check eligibility", "Allocate certificate ID", "Render document", "Export PDF", "Store file", "Update status"],
  },
  {
    id: "auto-cert-email",
    name: "Certificate Email",
    category: "Email",
    trigger: "Certificate generated + Send Email = Yes",
    action: "Queue email → attach certificate → send → update status",
    state: "Active",
    engine: "Gmail dispatch (external)",
    lastRunAt: day(ANCHOR, 0, 4, 15),
    nextRunAt: day(ANCHOR, 0, 8, 0),
    processed: 743,
    successful: 730,
    failed: 3,
    steps: ["Validate", "Check eligibility", "Find certificate", "Queue email", "Send", "Update status"],
  },
  {
    id: "auto-registration-confirmation",
    name: "Registration Confirmation",
    category: "Registration",
    trigger: "New participant registration",
    action: "Validate → create participant record → send confirmation",
    state: "Active",
    engine: "Forms → Sheets intake",
    lastRunAt: day(ANCHOR, 0, 6, 2),
    nextRunAt: "continuous",
    processed: 1244,
    successful: 1237,
    failed: 7,
    steps: ["Receive submission", "Validate fields", "Detect duplicates", "Create record", "Send confirmation"],
  },
  {
    id: "auto-event-reminder",
    name: "Event Reminder",
    category: "Lifecycle",
    trigger: "Event approaching (T-24h)",
    action: "Find eligible participants → queue reminder",
    state: "Active",
    engine: "Scheduled trigger",
    lastRunAt: day(ANCHOR, -1, 10, 0),
    nextRunAt: day(ANCHOR, 10, 10, 0),
    processed: 218,
    successful: 218,
    failed: 0,
    steps: ["Resolve event window", "Find eligible participants", "Queue reminder", "Update status"],
  },
  {
    id: "auto-duplicate-detection",
    name: "Duplicate Participant Detection",
    category: "Integrity",
    trigger: "Participant record created or updated",
    action: "Fingerprint email + name → flag duplicate → route to review",
    state: "Active",
    engine: "Sheets validation pass",
    lastRunAt: day(ANCHOR, 0, 3, 30),
    nextRunAt: day(ANCHOR, 0, 9, 30),
    processed: 1244,
    successful: 1238,
    failed: 6,
    steps: ["Load records", "Normalise fields", "Fingerprint", "Flag duplicates", "Route to review"],
  },
  {
    id: "auto-failed-email-retry",
    name: "Failed Email Retry",
    category: "Email",
    trigger: "Email status = Failed and attempts < 3",
    action: "Backoff → re-validate address → resend → update status",
    state: "Paused",
    engine: "Gmail dispatch (external)",
    lastRunAt: day(ANCHOR, -1, 22, 10),
    nextRunAt: null,
    processed: 24,
    successful: 15,
    failed: 9,
    steps: ["Collect failures", "Apply backoff", "Re-validate address", "Resend", "Update status"],
  },
  {
    id: "auto-eligibility",
    name: "Certificate Eligibility Calculation",
    category: "Certificates",
    trigger: "Attendance finalised",
    action: "Score attendance + approval → mark eligible → open approval gate",
    state: "Completed",
    engine: "Sheets formula pass",
    lastRunAt: day(ANCHOR, -4, 20, 0),
    nextRunAt: null,
    processed: 743,
    successful: 736,
    failed: 0,
    steps: ["Load attendance", "Apply eligibility rule", "Mark eligible", "Open approval gate"],
  },
  {
    id: "auto-completion-report",
    name: "Event Completion Report",
    category: "Lifecycle",
    trigger: "Event status = Completed + all queues drained",
    action: "Aggregate metrics → build report → notify organizer → archive",
    state: "Paused",
    engine: "Reporting job",
    lastRunAt: day(ANCHOR, -30, 11, 0),
    nextRunAt: null,
    processed: 1,
    successful: 1,
    failed: 0,
    steps: ["Aggregate metrics", "Build report", "Notify organizer", "Archive event"],
  },
  {
    id: "auto-exception-detection",
    name: "Exception Detection",
    category: "Integrity",
    trigger: "Every 15 minutes",
    action: "Scan pipelines → classify failures → raise items in Needs Attention",
    state: "Active",
    engine: "Monitor job",
    lastRunAt: day(ANCHOR, 0, 6, 45),
    nextRunAt: day(ANCHOR, 0, 7, 0),
    processed: 986,
    successful: 971,
    failed: 15,
    steps: ["Scan pipelines", "Classify failures", "Deduplicate", "Raise attention items"],
  },
];

export const automationRuns: AutomationRun[] = [
  {
    id: "AUTO-2026-0815-0042",
    automationId: "auto-cert-email",
    eventId: "evt-promptforge-1",
    status: "Completed with warnings",
    startedAt: day(ANCHOR, 0, 4, 15),
    finishedAt: day(ANCHOR, 0, 4, 41),
    processed: 743,
    successful: 730,
    skipped: 10,
    failed: 3,
    steps: [
      { name: "Validate", status: "Completed", durationMs: 1420, detail: "743 records validated against schema" },
      { name: "Check eligibility", status: "Completed", durationMs: 2210, detail: "733 eligible, 10 skipped (Send Email = No)" },
      { name: "Find certificate", status: "Warning", durationMs: 5340, detail: "3 certificates missing file reference" },
      { name: "Queue email", status: "Completed", durationMs: 3110, detail: "730 messages queued in 15 batches" },
      { name: "Send", status: "Warning", durationMs: 903400, detail: "730 sent, 3 deferred by recipient host" },
      { name: "Update status", status: "Completed", durationMs: 1890, detail: "Sheet + certificate records reconciled" },
    ],
    batches: [
      { name: "Batch 01", total: 50, completed: 50, failed: 0 },
      { name: "Batch 02", total: 50, completed: 50, failed: 0 },
      { name: "Batch 03", total: 50, completed: 47, failed: 3 },
      { name: "Batch 04", total: 50, completed: 50, failed: 0 },
      { name: "Batch 05", total: 50, completed: 50, failed: 0 },
    ],
  },
  {
    id: "AUTO-2026-0815-0041",
    automationId: "auto-cert-generation",
    eventId: "evt-promptforge-1",
    status: "Running",
    startedAt: day(ANCHOR, 0, 5, 40),
    finishedAt: null,
    processed: 620,
    successful: 617,
    skipped: 0,
    failed: 3,
    steps: [
      { name: "Validate", status: "Completed", durationMs: 1180, detail: "743 approved records loaded" },
      { name: "Check eligibility", status: "Completed", durationMs: 1990, detail: "743 eligible for generation" },
      { name: "Allocate certificate ID", status: "Completed", durationMs: 2400, detail: "IDs allocated FR-PF1-000001 → 000743" },
      { name: "Render document", status: "Warning", durationMs: 428000, detail: "620 rendered, 3 template failures" },
      { name: "Export PDF", status: "Completed", durationMs: 311000, detail: "617 PDFs exported" },
      { name: "Store file", status: "Completed", durationMs: 98000, detail: "Stored under /forge-realm/PF1/" },
      { name: "Update status", status: "Skipped", durationMs: 0, detail: "Runs after queue drains" },
    ],
    batches: [
      { name: "Batch 01", total: 50, completed: 50, failed: 0 },
      { name: "Batch 02", total: 50, completed: 50, failed: 0 },
      { name: "Batch 03", total: 50, completed: 47, failed: 3 },
      { name: "Batch 04", total: 50, completed: 50, failed: 0 },
      { name: "Batch 05", total: 50, completed: 50, failed: 0 },
      { name: "Batch 06", total: 50, completed: 50, failed: 0 },
      { name: "Batch 07", total: 50, completed: 23, failed: 0 },
    ],
  },
  {
    id: "AUTO-2026-0814-0038",
    automationId: "auto-registration-confirmation",
    eventId: "evt-codeforge-sprint",
    status: "Completed",
    startedAt: day(ANCHOR, -1, 9, 5),
    finishedAt: day(ANCHOR, -1, 9, 7),
    processed: 218,
    successful: 218,
    skipped: 0,
    failed: 0,
    steps: [
      { name: "Receive submission", status: "Completed", durationMs: 400, detail: "218 form submissions ingested" },
      { name: "Validate fields", status: "Completed", durationMs: 1200, detail: "All required fields present" },
      { name: "Detect duplicates", status: "Completed", durationMs: 900, detail: "0 duplicates" },
      { name: "Create record", status: "Completed", durationMs: 2100, detail: "218 participant records created" },
      { name: "Send confirmation", status: "Completed", durationMs: 45000, detail: "218 confirmations sent" },
    ],
    batches: [
      { name: "Batch 01", total: 50, completed: 50, failed: 0 },
      { name: "Batch 02", total: 50, completed: 50, failed: 0 },
      { name: "Batch 03", total: 50, completed: 50, failed: 0 },
      { name: "Batch 04", total: 50, completed: 50, failed: 0 },
      { name: "Batch 05", total: 18, completed: 18, failed: 0 },
    ],
  },
  {
    id: "AUTO-2026-0814-0035",
    automationId: "auto-failed-email-retry",
    eventId: "evt-promptforge-1",
    status: "Failed",
    startedAt: day(ANCHOR, -1, 22, 10),
    finishedAt: day(ANCHOR, -1, 22, 12),
    processed: 24,
    successful: 15,
    skipped: 0,
    failed: 9,
    steps: [
      { name: "Collect failures", status: "Completed", durationMs: 600, detail: "24 failed deliveries collected" },
      { name: "Apply backoff", status: "Completed", durationMs: 300, detail: "Exponential backoff applied" },
      { name: "Re-validate address", status: "Warning", durationMs: 1100, detail: "4 addresses malformed" },
      { name: "Resend", status: "Failed", durationMs: 8800, detail: "Daily Gmail send quota exhausted" },
      { name: "Update status", status: "Skipped", durationMs: 0, detail: "Aborted after send failure" },
    ],
    batches: [{ name: "Batch 01", total: 24, completed: 15, failed: 9 }],
  },
  {
    id: "AUTO-2026-0812-0021",
    automationId: "auto-eligibility",
    eventId: "evt-promptforge-1",
    status: "Completed",
    startedAt: day(ANCHOR, -4, 20, 0),
    finishedAt: day(ANCHOR, -4, 20, 3),
    processed: 743,
    successful: 736,
    skipped: 7,
    failed: 0,
    steps: [
      { name: "Load attendance", status: "Completed", durationMs: 1500, detail: "743 attendance rows" },
      { name: "Apply eligibility rule", status: "Completed", durationMs: 2200, detail: "Attended or Partial + Approved" },
      { name: "Mark eligible", status: "Completed", durationMs: 1800, detail: "736 marked eligible" },
      { name: "Open approval gate", status: "Completed", durationMs: 700, detail: "Gate opened for organizer review" },
    ],
    batches: [{ name: "Batch 01", total: 743, completed: 743, failed: 0 }],
  },
];

/* ------------------------------- activity ------------------------------- */

const ACTIVITY_TEMPLATES: {
  action: string;
  entity: string;
  status: ActivityLog["status"];
  actor: string;
}[] = [
  { action: "Certificate generated", entity: "Certificate", status: "Success", actor: "Automation · Certificate Generation" },
  { action: "Certificate generation failed", entity: "Certificate", status: "Failed", actor: "Automation · Certificate Generation" },
  { action: "Certificate regenerated", entity: "Certificate", status: "Success", actor: "Hima Singh" },
  { action: "Email queued", entity: "Email", status: "Info", actor: "Automation · Certificate Email" },
  { action: "Email sent", entity: "Email", status: "Success", actor: "Automation · Certificate Email" },
  { action: "Email delivery failed", entity: "Email", status: "Failed", actor: "Automation · Certificate Email" },
  { action: "Participant approved", entity: "Participant", status: "Success", actor: "Hima Singh" },
  { action: "Participant registered", entity: "Participant", status: "Info", actor: "Google Forms intake" },
  { action: "Duplicate participant flagged", entity: "Participant", status: "Warning", actor: "Automation · Duplicate Detection" },
  { action: "Automation started", entity: "Automation Run", status: "Info", actor: "Scheduler" },
  { action: "Automation completed", entity: "Automation Run", status: "Success", actor: "Scheduler" },
  { action: "Automation failed", entity: "Automation Run", status: "Failed", actor: "Scheduler" },
  { action: "Event created", entity: "Event", status: "Success", actor: "Hima Singh" },
  { action: "Attendance imported", entity: "Attendance", status: "Success", actor: "Ops Team" },
];

export const activityLogs: ActivityLog[] = (() => {
  const rng = mulberry32(4242);
  const logs: ActivityLog[] = [];
  const base = new Date(day(ANCHOR, 0, 6, 55)).getTime();
  for (let i = 0; i < 180; i++) {
    const tpl = pick(rng, ACTIVITY_TEMPLATES);
    const event = pick(rng, events.slice(0, 4));
    const eventParticipants = participants.filter((p) => p.eventId === event.id);
    const participant = eventParticipants.length
      ? eventParticipants[Math.floor(rng() * eventParticipants.length)]!
      : undefined;
    const entityId =
      tpl.entity === "Certificate"
        ? participant
          ? `CERT-${event.code}-${participant.id.slice(-6)}`
          : `CERT-${event.code}-000001`
        : tpl.entity === "Email"
          ? participant
            ? `MAIL-${event.code}-${participant.id.slice(-6)}-1`
            : `MAIL-${event.code}-000001-1`
          : tpl.entity === "Automation Run"
            ? pick(rng, automationRuns).id
            : tpl.entity === "Event"
              ? event.id
              : (participant?.id ?? event.id);

    logs.push({
      id: `LOG-${String(9000 - i)}`,
      at: iso(new Date(base - i * (1000 * 60 * (3 + Math.floor(rng() * 26))))),
      action: tpl.action,
      entity: tpl.entity,
      entityId,
      status: tpl.status,
      actor: tpl.actor,
      eventId: event.id,
    });
  }
  return logs.sort((a, b) => (a.at < b.at ? 1 : -1));
})();

/* ----------------------- registration trend series ---------------------- */

export function registrationTrend(eventId: string) {
  const list = participants
    .filter((p) => p.eventId === eventId)
    .sort((a, b) => (a.registeredAt < b.registeredAt ? -1 : 1));
  const buckets = new Map<string, number>();
  list.forEach((p) => {
    const key = p.registeredAt.slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  let cumulative = 0;
  return [...buckets.entries()].map(([date, count]) => {
    cumulative += count;
    return { date: date.slice(5), registrations: count, cumulative };
  });
}
