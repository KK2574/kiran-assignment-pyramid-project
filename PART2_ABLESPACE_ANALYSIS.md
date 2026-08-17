# Part 2 — AbleSpace: Caseload → Take Data Workflow

## What the screen shows

The **Caseload** tab (left nav, under "Capture") is the therapist/clinician's home base — a roster of the students on their caseload. The table shows: Full Name, Last Name, IEP Due date, Eval Due date, Collaborators (team avatars), Service Time (mandated minutes/week), School, and an Actions column with a primary **Take Data** button plus a secondary **⋮** menu.

A tab bar at the top (Students (15) · Groups (12) · Unassigned (39)) lets the clinician switch between individual students, pre-set groups (e.g., a social skills group), and students not yet assigned to them. A "Switch to Admin" toggle at the top of the sidebar suggests the same product serves both clinician and admin roles from one account.

## Workflow, in my own words

1. A therapist opens AbleSpace and lands on Caseload — their full list of assigned students.
2. They scan IEP Due / Eval Due columns to see which students have compliance deadlines coming up.
3. During or after a session with a student, they click **Take Data** to log progress against that student's goals (the actual data-entry screen is one click deeper than this view).
4. The Collaborators avatars show at a glance who else is on that student's team (e.g., other therapists, case manager), useful for coordination without leaving the list.
5. Service Time (e.g., "OT - 30mins/Wk") reminds the clinician of mandated minutes so they can track compliance across the caseload.
6. The ⋮ menu likely surfaces secondary actions (edit student, view history, remove from caseload, etc.) — not confirmed by direct testing in this pass, flagged above for follow-up rather than stated as fact.

## UX/UI and functionality observations

- **Ambiguous empty states**: IEP Due / Eval Due show a bare "-" for several students. It's unclear if this means "not yet set" or "not applicable" — for something as compliance-critical as IEP deadlines, this ambiguity is risky. A "Not set" label or a warning icon would remove the guesswork.
- **"0" in Service Time reads as an error, not a value**: Several rows show "0" instead of e.g. "Not scheduled" — visually this looks like broken data rather than an intentional state.
- **No urgency sorting**: Given IEP/Eval deadlines carry legal weight, there's no visible way to sort by "soonest due" or get a color-coded urgency indicator (e.g., red badge for <30 days). This feels like a missed opportunity for the exact audience (special-ed clinicians managing compliance).
- **Take Data button placement**: it's the single most-used action on the page but sits at the far right, requiring a full horizontal scan/scroll per row. For a high-frequency action, something like a hover-reveal quick action or a leading icon-button could reduce friction.
- **Search bar**: confirmed working — typing filters the caseload list in real time.
- **Collaborator avatars truncate ("+1", "+3")**: fine for scanning, but there's no visible way to see the full list without a click — a tooltip on hover would help before committing to a click.
- **⋮ menu on each row**: not fully explored during this walkthrough — worth a follow-up pass to confirm exactly what secondary actions it exposes before treating any assumption about it as fact.

These are the kinds of refinements I'd bring up in a product review: mostly about turning ambiguous states into clear ones, and surfacing urgency for a compliance-driven workflow.