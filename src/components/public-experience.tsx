import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Globe,
  Mail,
  Check,
  Ticket,
  Users,
  Copy,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  type Store,
  type Event,
  type Participant,
  counts,
  formatDate,
  formatTime,
} from "../demo-store";
import { Logo, Button, Status, ConfirmDialog } from "./shared";
import { copyText } from "./events";
export function PublicShell({
  children,
  navigate,
}: {
  children: React.ReactNode;
  navigate: (p: string) => void;
}) {
  return (
    <div className="public-shell">
      <header className="public-header">
        <button
          onClick={() => navigate("overview")}
          aria-label="EventFlow home"
        >
          <Logo />
        </button>
        <span>GOOD PEOPLE. GREAT GATHERINGS.</span>
        <Button variant="outline" onClick={() => navigate("overview")}>
          Organizer preview
          <ArrowUpRight />
        </Button>
      </header>
      {children}
      <footer className="public-footer">
        <Logo />
        <p>Thoughtfully connected. Seamlessly organized.</p>
        <span>
          Interactive demo · No real registrations or emails · Data resets on
          reload
        </span>
      </footer>
    </div>
  );
}
export function PublicEvent({
  event,
  store,
  navigate,
}: {
  event: Event;
  store: Store;
  navigate: (p: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [preview, setPreview] = useState("Default");
  const c = counts(event, store.participants);
  const closed =
    event.status !== "Published" ||
    preview === "Registration closed" ||
    preview === "Event cancelled";
  function confirm() {
    try {
      const p = store.register(event.id, email);
      navigate(`manage/${p.id}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
  return (
    <PublicShell navigate={navigate}>
      <main className="public-main">
        <div className="public-art">
          <img
            src="/images/design-summit.png"
            alt="White architectural arches against a lavender sky"
          />
          <div>
            <span>A NEW PERSPECTIVE.</span>
            <h1>{event.title}</h1>
            <p>A gathering for the endlessly curious.</p>
          </div>
        </div>
        <div className="public-grid">
          <article>
            <span className="eyebrow">THE NEXT CHAPTER STARTS TOGETHER</span>
            <h2>
              Fresh ideas.
              <br />
              Real connections.
            </h2>
            <p className="event-description">{event.description}</p>
            <div className="event-facts">
              <div>
                <CalendarDays />
                <span>
                  <strong>{formatDate(event.date)}</strong>
                  <small>Save a little space on your calendar</small>
                </span>
              </div>
              <div>
                <Clock3 />
                <span>
                  <strong>{formatTime(event.time)}</strong>
                  <small>{event.timezone}</small>
                </span>
              </div>
              <div>
                <Users />
                <span>
                  <strong>{c.confirmed} people and counting</strong>
                  <small>A community worth being part of</small>
                </span>
              </div>
            </div>
          </article>
          <aside className="registration-card">
            {closed ? (
              <div className="registration-result">
                <CalendarDays />
                <h2>
                  {event.status === "Cancelled" || preview === "Event cancelled"
                    ? "This event is cancelled"
                    : "Registration is closed"}
                </h2>
                <p>
                  {event.status === "Cancelled" || preview === "Event cancelled"
                    ? "This gathering won’t take place. Existing tickets are no longer valid."
                    : "We’re not accepting new registrations for this gathering."}
                </p>
              </div>
            ) : sent ? (
              <div className="registration-result">
                <span className="result-icon">
                  <Mail />
                </span>
                <span className="eyebrow">ONE SMALL STEP</span>
                <h2>Check your inbox.</h2>
                <p>
                  Confirm your email to complete registration for {event.title}.
                </p>
                <strong>{email}</strong>
                <p className="demo-caption">
                  Demo only: no email was sent. Use the button below to simulate
                  email verification.
                </p>
                <Button size="lg" onClick={confirm}>
                  Simulate email confirmation
                  <ArrowRight />
                </Button>
                <Button variant="ghost" onClick={() => setSent(false)}>
                  Use a different email
                </Button>
              </div>
            ) : (
              <>
                <Status
                  value={
                    c.confirmed >= event.capacity
                      ? "Waiting list"
                      : "Registration open"
                  }
                />
                <h2>
                  {c.confirmed >= event.capacity
                    ? "Get on the list."
                    : "We’ll save you a seat."}
                </h2>
                <p>
                  {c.confirmed >= event.capacity
                    ? "Join the queue. We’ll offer you a seat when one becomes available."
                    : "Just your email. No accounts, no complications."}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="registration-email">
                        Email address
                      </FieldLabel>
                      <Input
                        id="registration-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                    <Button size="lg" type="submit">
                      {c.confirmed >= event.capacity
                        ? "Join waiting list"
                        : "Register for the event"}
                      <ArrowRight />
                    </Button>
                  </FieldGroup>
                </form>
                <div className="registration-reassurance">
                  <ShieldCheck size={16} />
                  <span>Your email is only used for event updates.</span>
                </div>
                <div className="seats-left">
                  <span className="live-dot" />
                  {Math.max(0, event.capacity - c.confirmed)} of{" "}
                  {event.capacity} spots remaining
                </div>
              </>
            )}
            <div className="preview-states">
              <label htmlFor="preview-state">Demo state</label>
              <select
                id="preview-state"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
              >
                <option>Default</option>
                <option>Registration closed</option>
                <option>Event cancelled</option>
              </select>
            </div>
          </aside>
        </div>
      </main>
    </PublicShell>
  );
}
export function TicketCard({
  event,
  person,
  share = false,
}: {
  event: Event;
  person: Participant;
  share?: boolean;
}) {
  return (
    <section className="ticket-card">
      <div className="ticket-top">
        <Logo />
        <Status
          value={
            event.status === "Cancelled"
              ? "Cancelled"
              : person.checkedIn
                ? "Checked in"
                : person.status
          }
        />
      </div>
      <div className="ticket-info">
        <span className="eyebrow">YOUR NEXT GREAT GATHERING</span>
        <h2>{event.title}</h2>
        <p>
          {formatDate(event.date)} · {formatTime(event.time)}
        </p>
        <small>{event.timezone}</small>
      </div>
      <div className="ticket-perforation" />
      {person.status === "Confirmed" && event.status !== "Cancelled" ? (
        <div className="ticket-qr">
          <QRCodeSVG value={person.code} size={192} level="M" marginSize={2} />
          <strong>{person.code}</strong>
          <p>Show this code at the door. We’ll take care of the rest.</p>
        </div>
      ) : (
        <div className="registration-result">
          <Ticket />
          <p>
            {person.status === "Waiting list"
              ? "Your ticket will appear when a seat becomes available."
              : "This ticket is no longer valid."}
          </p>
        </div>
      )}
      {!share && (
        <div className="ticket-bottom">
          <span>REGISTERED TO</span>
          <strong>{person.email}</strong>
        </div>
      )}
    </section>
  );
}
export function ManageParticipant({
  person,
  event,
  store,
  navigate,
  ticketOnly = false,
  share = false,
}: {
  person: Participant;
  event: Event;
  store: Store;
  navigate: (p: string) => void;
  ticketOnly?: boolean;
  share?: boolean;
}) {
  const [action, setAction] = useState("");
  const [shareVersion, setShareVersion] = useState(1);
  const [managementVersion, setManagementVersion] = useState(1);
  const position =
    store.participants
      .filter((p) => p.eventId === event.id && p.status === "Waiting list")
      .findIndex((p) => p.id === person.id) + 1;
  return (
    <PublicShell navigate={navigate}>
      <main className="management-main">
        <button
          className="back-link"
          onClick={() => navigate(`public/${event.id}`)}
        >
          <ArrowLeft size={16} />
          Event details
        </button>
        <div className="management-heading">
          <span className="eyebrow">
            {person.status === "Confirmed"
              ? "YOU’RE ON THE LIST"
              : "YOUR REGISTRATION"}
          </span>
          <h1>
            {event.status === "Cancelled"
              ? "The event has been cancelled."
              : person.status === "Confirmed"
                ? "See you there."
                : person.status === "Waiting list"
                  ? "Good things are worth the wait."
                  : "Registration cancelled."}
          </h1>
          <p>
            {person.status === "Waiting list"
              ? `You’re #${position} in line. Available seats are offered in registration order.`
              : "Your event details, right where you need them."}
          </p>
        </div>
        <div className={ticketOnly ? "single-ticket" : "management-grid"}>
          <TicketCard event={event} person={person} share={share} />
          {!ticketOnly && (
            <aside className="panel manage-actions">
              <h2>A few useful things</h2>
              <p>
                Your registration is {person.status.toLowerCase()} in this demo
                only.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(`ticket/${person.id}`)}
              >
                <Ticket />
                View ticket
                <ArrowUpRight />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.success(
                    "Demo: ticket email resend requested. No email was sent.",
                  )
                }
              >
                <Mail />
                Resend ticket email
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  copyText(
                    `${location.origin}/#/share/${person.id}?v=${shareVersion}`,
                  )
                }
              >
                <Copy />
                Copy share link
              </Button>
              <p className="demo-caption">
                Demo links contain no real credentials and only work in this
                session. A share view hides your email.
              </p>
              <div className="manage-secondary">
                <Button variant="ghost" onClick={() => setAction("management")}>
                  <RefreshCw />
                  Replace management link
                </Button>
                <Button variant="ghost" onClick={() => setAction("share")}>
                  <RefreshCw />
                  Replace share link
                </Button>
                <Button
                  variant="destructive"
                  disabled={person.status === "Cancelled"}
                  onClick={() => setAction("cancel")}
                >
                  Cancel registration
                </Button>
              </div>
              <p className="demo-caption">
                Management link version {managementVersion} · Share link version{" "}
                {shareVersion}
              </p>
            </aside>
          )}
        </div>
      </main>
      <ConfirmDialog
        open={!!action}
        onClose={() => setAction("")}
        title={
          action === "cancel"
            ? "Cancel your registration?"
            : `Replace your ${action} link?`
        }
        description={
          action === "cancel"
            ? "Your ticket becomes invalid. If someone is waiting, your seat will be offered to them."
            : `In production, the previous ${action} link would stop working. This is a visual demo only; link revocation is not implemented. Your actual ticket code will not change.`
        }
        destructive={action === "cancel"}
        confirmLabel={
          action === "cancel" ? "Cancel registration" : "Simulate replacement"
        }
        onConfirm={() => {
          if (action === "cancel") store.cancelParticipant(person.id);
          else if (action === "share") setShareVersion((v) => v + 1);
          else setManagementVersion((v) => v + 1);
          toast.success("Demo registration updated");
        }}
      />
    </PublicShell>
  );
}
