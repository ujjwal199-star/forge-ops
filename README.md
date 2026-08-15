# Forge Ops

Build Forge Realm Event OS — V1

Build a polished, production-minded web application called Forge Realm Event OS.

This is NOT just a dashboard UI and NOT a simple certificate generator.

The product is an Event Operations & Automation Platform for organizers who need to run student events with hundreds or potentially 500–1000+ participants.

The existing operational automation already exists outside this application using:

Google Forms → Google Sheets → Google Apps Script → Google Docs → PDF → Google Drive → Gmail

The existing automation handles participant data, certificate IDs, certificate generation, PDF storage, approval gates, email delivery, and status tracking.

This new application is the control center / OS layer that will eventually sit above that automation.

Do NOT replace or pretend to replace the existing automation. Design the application so the existing and future automation engines can be connected cleanly.

1. PRODUCT POSITIONING

Name:

Forge Realm Event OS

Subtitle:

Event Operations & Automation Platform

Core idea:

From registration to recognition, organize and automate the operational workload behind events.

The product should feel like a serious internal operations platform, not a generic SaaS admin template.

It should be suitable for:

Workshops

AI challenges

Hackathons

Quizzes

Coding competitions

Webinars

Mini-project events

Student community events

The system must be designed around an event lifecycle, not around isolated CRUD screens.

2. PRIMARY V1 GOAL

Create a beautiful and highly usable Event Command Center where an organizer can understand and manage an event from one place.

V1 should establish the foundation for:

Event management

Participant management

Registration tracking

Approval workflows

Certificate operations

Email operations

Automation monitoring

Analytics

Activity logs

Exceptions / issues

Event lifecycle

Do NOT implement QR verification, public certificate verification, AI agent functionality, advanced ranking systems, or other V2/V3 features yet.

However, architect the UI and data model so they can be added later without redesigning the entire product.

3. DESIGN DIRECTION

Create a premium, modern, technical operations-product aesthetic.

Avoid:

generic Bootstrap admin dashboards

excessive gradients

childish event-management visuals

excessive glassmorphism

huge decorative illustrations

cluttered cards everywhere

unnecessary animations

Prefer:

clean dark/neutral interface

strong typography

excellent spacing

subtle borders

restrained accent color

high information density without feeling cramped

polished tables

meaningful status badges

command-center feeling

professional SaaS/product UI

The interface should feel like something a serious technology organization could actually use internally.

Use Tailwind + shadcn/ui components consistently.

Make the UI responsive, but prioritize desktop/tablet organizer workflows.

Use subtle motion only where it improves usability.

4. APPLICATION SHELL

Create a persistent application shell.

Left sidebar:

Overview

Events

Participants

Certificates

Emails

Automations

Analytics

Activity

Settings

Top bar:

Current event selector

Global search

Notifications / issues indicator

Organizer profile

The sidebar should clearly communicate that this is an operations OS, not a normal website.

5. OVERVIEW / COMMAND CENTER

Create a powerful dashboard for the currently selected event.

Header:

PromptForge #1

Status:

Live / Upcoming / Completed / Draft

Show high-value operational metrics:

Total Registrations

Confirmed Participants

Attendance

Certificates Eligible

Certificates Generated

Emails Sent

Emails Pending

Failed Operations

Use sensible visual hierarchy.

Do not make every metric a giant card.

6. EVENT HEALTH

Add an Event Health section.

Example:

Event Health

Registration: Healthy

Certificates: Attention needed

Email delivery: Healthy

Pending approvals: 12

Failed operations: 3

The goal is to answer:

“Is anything currently requiring my attention?”

7. ACTION CENTER

Create a section called:

Needs Attention

Examples:

3 certificate generation failures

7 participants awaiting approval

4 invalid email addresses

12 certificates pending generation

2 email deliveries failed

Each issue should have:

severity

short explanation

affected count

action button

Example:

3 failed certificate generations
[Review]

This is extremely important.

The OS should surface exceptions rather than forcing the organizer to search for them.

8. QUICK ACTIONS

Add useful organizer actions:

Create Event

Import Participants

Generate Certificates

Send Pending Emails

Run Automation

View Failed Operations

These actions should feel operational rather than decorative.

For destructive or mass actions, use confirmation dialogs.

9. EVENTS MODULE

Create an Events page.

Show event cards/table with:

Event name

Event type

Date

Status

Participants

Certificates

Emails

Last activity

Statuses:

Draft

Upcoming

Registration Open

Live

Processing

Completed

Archived

Create Event flow should capture:

Event name

Event type

Description

Start date/time

End date/time

Registration deadline

Participant capacity

Organizer

Event status

Do not overcomplicate event creation in V1.

10. EVENT DETAIL

Each event should have its own operational workspace.

Tabs/sections:

Overview

Participants

Certificates

Emails

Automations

Analytics

Activity

The event detail page should feel like the central workspace for that event.

11. PARTICIPANTS MODULE

Create a serious participant management table.

Columns:

Participant ID

Full Name

College

Branch

Year

Email

Registration Status

Attendance

Certificate Status

Email Status

Approval

Last Activity

Include:

Search

Filters

Sorting

Pagination

Bulk selection

Useful filters:

Registered

Approved

Pending

Attended

Certificate Generated

Certificate Pending

Email Sent

Email Failed

Create a participant detail drawer/page showing a complete participant timeline.

Example:

Participant:

FR-PF1-000472

Timeline:

Registration received
→ Approved
→ Certificate generated
→ Email sent

12. CERTIFICATES MODULE

Build a certificate operations center.

Summary:

Eligible

Pending

Generated

Failed

Delivered

Table:

Participant

Certificate ID

Certificate type

Status

Generated at

Email status

Actions

Actions:

Preview

Generate

Regenerate

Download

Send

Important statuses:

Not Eligible

Pending Approval

Approved

Pending Generation

Generated

Failed

Delivered

Use clear status badges.

The existing certificate system already uses unique certificate IDs and approval gates. Preserve that conceptual model.

13. EMAIL MODULE

Build an Email Operations Center.

Metrics:

Queued

Sent

Pending

Failed

Retry Required

Table:

Recipient

Participant

Email type

Status

Sent at

Attempts

Last error

Email types should include examples such as:

Registration Confirmation

Event Reminder

Certificate Delivery

Winner Announcement

Event Update

Feedback Request

Create a clean email detail view.

Do NOT actually send emails unless a real email integration is explicitly configured.

Use realistic demo data for the initial UI.

14. AUTOMATIONS MODULE

This is a key V1 module.

Create an Automation Center.

Show automation workflows such as:

Certificate Generation

Trigger:
Approved participant + eligible certificate

Action:
Generate certificate → create PDF → store → update status

Certificate Email

Trigger:
Certificate generated + Send Email = Yes

Action:
Queue email → attach certificate → send → update status

Registration Confirmation

Trigger:
New participant registration

Action:
Validate → create participant record → send confirmation

Event Reminder

Trigger:
Event approaching

Action:
Find eligible participants → queue reminder

Each automation should display:

Status

Last run

Next run

Processed

Successful

Failed

Possible states:

Active

Paused

Running

Completed

Failed

Add:

Run Now

and

View Logs

buttons.

15. AUTOMATION RUN DETAIL

Create a detailed automation run page/drawer.

Example:

Certificate Email Automation

Run ID:
AUTO-2026-0815-0042

Status:
Completed with warnings

Processed:
743

Successful:
730

Skipped:
10

Failed:
3

Show a step-by-step execution timeline:

Validate
→ Check eligibility
→ Find certificate
→ Queue email
→ Send
→ Update status

This is important for making the product feel like an actual operations system.

16. QUEUE / BATCH PROCESSING UI

Because the platform is intended to eventually handle 500–1000+ participants, visually represent scalable processing.

Example:

Certificate Generation Queue

Total:
743

Processed:
620

Pending:
120

Failed:
3

Progress bar.

Show batch information:

Batch 01
50 / 50 completed

Batch 02
50 / 50 completed

Batch 03
47 / 50 completed

Do NOT fake real background processing as if it exists.

This is a V1 operational UI representation / foundation for the future queue engine.

17. ANALYTICS

Create event analytics.

Metrics:

Registrations

Attendance

Certificate completion

Email delivery

Failure rate

Pending operations

Charts should answer operational questions.

Examples:

Registration trend
Certificate processing status
Email delivery status
Event funnel

Keep charts clean and readable.

18. ACTIVITY / AUDIT LOG

Create an Activity page.

Track conceptual events such as:

Event created

Participant registered

Participant approved

Certificate generated

Certificate regenerated

Email queued

Email sent

Email failed

Automation started

Automation completed

Automation failed

Each activity should include:

Timestamp

Action

Entity

Status

Actor / system

This will later become the foundation for a proper audit trail.

19. WORKFLOW / EVENT LIFECYCLE

The UI should visually communicate this lifecycle:

Registration
→ Validation
→ Approval
→ Attendance
→ Eligibility
→ Certificate Generation
→ PDF
→ Email Queue
→ Email Delivery
→ Completion

The system should feel like all these stages are connected.

Do not build each module as an unrelated page.

20. V1 AUTOMATIONS TO MODEL

Include these automation concepts in the product:

Registration confirmation

Participant data validation

Duplicate participant detection

Approval workflow

Certificate eligibility calculation

Certificate ID generation

Certificate generation

PDF generation/storage

Email queueing

Email delivery

Failed email retry

Certificate regeneration

Event reminders

Post-event certificate processing

Feedback request

Event completion report

Exception detection

Event archiving

These should be represented in the architecture/UI even if some are initially mock/demo implementations.

The existing working Google Apps Script automation remains the current execution engine for certificate/PDF/email operations.

21. IMPORTANT AUTOMATION SAFETY MODEL

Preserve these concepts:

Certificate Approval

Only approved participants can enter certificate generation.

Send Email

Only participants explicitly eligible for email dispatch should enter the email queue.

Idempotency

If an email has already been successfully sent, the system should not blindly resend it.

Failed Operations

Failures should be visible and retryable.

Human-in-the-loop

Mass operations should provide a confirmation step.

Example:

“Send certificates to 743 participants?”

Show:

Eligible: 743

Already sent: 720

Pending: 20

Failed: 3

Then:

[Cancel] [Review] [Confirm]

22. DATA MODEL FOUNDATION

Use a clean relational data model.

Core entities:

events

participants

registrations

attendance

certificates

emails

automation_runs

automation_tasks

activity_logs

event_settings

Certificate records should support:

certificate ID

participant

event

certificate type

status

generated timestamp

file reference

email status

Email records should support:

recipient

participant

event

email type

status

attempts

sent timestamp

failure reason

Do not over-engineer the database beyond what V1 needs.

23. DEMO DATA

Populate the application with realistic demo data so the interface looks alive immediately.

Use a realistic example event:

PromptForge #1

Example scale:

743 participants

712 certificates generated

698 emails sent

9 failed

15 pending

Use believable names, colleges, statuses and timestamps.

Do not use fake claims that these are real production statistics.

Clearly structure this as demo/sample data.

24. SEARCH

Add global search capable of finding:

events

participants

certificate IDs

emails

automation runs

Example:

Searching:

FR-PF1-000472

should surface the participant/certificate record in the demo environment.

25. RESPONSIVE UX

Desktop is the primary organizer experience.

But make it responsive for:

laptop

tablet

mobile

Tables should have intelligent responsive behavior instead of overflowing badly.

26. EMPTY / LOADING / ERROR STATES

Every important module must have:

loading state

empty state

error state

success state

Do not make the application look unfinished when data is absent.

27. V1 SCOPE BOUNDARY

DO NOT implement yet:

QR verification

public certificate verification

public certificate pages

AI agent

natural-language event commands

advanced AI analytics

complex ranking engine

payment system

public event marketplace

unnecessary social features

Those are future versions.

Design the architecture so they can be added later.

28. FUTURE ARCHITECTURE AWARENESS

The long-term architecture should be capable of evolving toward:

DATA LAYER
→ Event / Participant / Certificate / Email data

AUTOMATION LAYER
→ Queues / workflows / retries / scheduled jobs

CONTROL LAYER
→ Web dashboard

INTELLIGENCE LAYER
→ Future AI Event Operations Agent

Do not implement the AI layer now.

29. TECHNICAL EXPECTATIONS

Use Lovable's standard modern full-stack TypeScript setup.

Prefer:

React

TypeScript

Tailwind CSS

shadcn/ui

Supabase/PostgreSQL where appropriate

clean reusable components

sensible routing

proper state management

reusable tables

reusable status components

reusable dialogs/drawers

Keep business logic separated from presentation.

Avoid putting everything into one giant component.

Create a scalable folder/component structure.

30. QUALITY BAR

This should NOT look like:

“AI generated admin dashboard #438.”

It should look like a real product.

Pay special attention to:

hierarchy

typography

spacing

table quality

status system

navigation

empty states

error states

micro-interactions

consistency

accessibility

responsive behavior

Make the first impression strong enough that this can later be used as a serious portfolio/showcase project.

31. FINAL PRODUCT FEEL

The user should open the dashboard and immediately understand:

What events are running?

How many people are registered?

What needs attention?

How many certificates are processed?

Are emails being delivered?

Did any automation fail?

What should I do next?

That is the purpose of Forge Realm Event OS.

Build the V1 foundation around these questions.

Do not just create pages.

Create a coherent event operations system.

Before finishing, ensure navigation works, routes work, demo data is connected consistently, all major screens are polished, and the application builds successfully.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/41ac272e-8339-4130-b820-71703dc81fcd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
