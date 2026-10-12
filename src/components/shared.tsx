import { type ReactNode } from "react";
import {
  CalendarDays,
  Users,
  Clock3,
  ScanLine,
  ArrowUpRight,
  X,
  Search,
  Layers,
  Plus,
  ArrowRight,
  Check,
  CircleCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  type Event,
  type Participant,
  type Activity,
  counts,
  formatDate,
  formatTime,
} from "../demo-store";
export function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark">
        <Layers size={20} />
      </span>
      EventFlow<span className="logo-dot">.</span>
    </span>
  );
}
export function Status({ value }: { value: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "status",
        `status-${value.toLowerCase().replaceAll(" ", "-")}`,
      )}
    >
      <span className="status-dot" />
      {value}
    </Badge>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">{action}</div>
    </div>
  );
}
export function Stats({
  events,
  people,
  event,
}: {
  events: Event[];
  people: Participant[];
  event?: Event;
}) {
  const ps = event ? people.filter((p) => p.eventId === event.id) : people;
  const values = [
    event ? event.capacity : events.length,
    ps.filter((p) => p.status === "Confirmed").length,
    ps.filter((p) => p.status === "Waiting list").length,
    ps.filter((p) => p.checkedIn).length,
  ];
  const labels = [
    event ? "Event capacity" : "Total events",
    "Confirmed registrations",
    "On the waiting list",
    "Checked-in participants",
  ];
  const icons = [CalendarDays, Users, Clock3, ScanLine];
  const notes = event
    ? [
        "Total available seats",
        "Ready to join your event",
        "Automatically promoted",
        "A smooth arrival starts here",
      ]
    : [
        "4 events coming up",
        "Across all your events",
        "A little anticipation",
        "Across completed events",
      ];
  return (
    <div className="stats-grid">
      {labels.map((label, i) => {
        const Icon = icons[i];
        return (
          <section className="stat-card" key={label}>
            <div className="stat-label">
              {label}
              <Icon size={16} />
            </div>
            <div className="stat-number">
              {values[i].toLocaleString()}
              <span className={i === 2 ? "stat-neutral" : "stat-change"}>
                {event
                  ? i === 0
                    ? "Available seats"
                    : i === 1
                      ? `${Math.round((values[1] / event.capacity) * 100)}% of capacity`
                      : i === 2
                        ? "First come, first served"
                        : "Total arrivals"
                  : i === 0
                    ? "This season"
                    : i === 1
                      ? "+24 this week"
                      : i === 2
                        ? `Across ${new Set(ps.filter((p) => p.status === "Waiting list").map((p) => p.eventId)).size} events`
                        : "Total arrivals"}
              </span>
            </div>
            <p>{notes[i]}</p>
          </section>
        );
      })}
    </div>
  );
}
export function EventIcon({ event }: { event: Event }) {
  return (
    <span className={cn("event-icon", event.color)}>
      {event.category === "Conference" ? (
        <Layers size={20} />
      ) : event.category === "Meetup" ? (
        <Users size={20} />
      ) : (
        <CalendarDays size={20} />
      )}
    </span>
  );
}
export function EventTable({
  events,
  people,
  onOpen,
  compact = false,
}: {
  events: Event[];
  people: Participant[];
  onOpen: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Event name</th>
            <th>Date & time</th>
            <th>Status</th>
            <th>Registrations</th>
            {!compact && (
              <>
                <th>Waiting list</th>
                <th>Checked in</th>
              </>
            )}
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const c = counts(e, people);
            return (
              <tr key={e.id}>
                <td>
                  <button
                    className="event-title-cell"
                    onClick={() => onOpen(e.id)}
                  >
                    <EventIcon event={e} />
                    <span>
                      <strong>{e.title}</strong>
                      <small>{e.category}</small>
                    </span>
                  </button>
                </td>
                <td>
                  <span className="table-date">
                    {formatDate(e.date, true)}, 2026
                  </span>
                  <small>{formatTime(e.time)} · PT</small>
                </td>
                <td>
                  <Status value={e.status} />
                </td>
                <td>
                  <span className="registration-count">
                    {c.confirmed}
                    <span> / {e.capacity}</span>
                  </span>
                  <div className="capacity-track">
                    <span
                      style={{
                        width: `${Math.min((c.confirmed / e.capacity) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </td>
                {!compact && (
                  <>
                    <td>{c.waiting}</td>
                    <td>{c.checked}</td>
                  </>
                )}
                <td>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Open ${e.title}`}
                    onClick={() => onOpen(e.id)}
                  >
                    <ArrowUpRight />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {events.length === 0 && (
        <Empty
          title="No events found"
          text="Try another search or create your first event."
        />
      )}
    </div>
  );
}
export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <CalendarDays />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <div className="activity-list">
      {items.slice(0, 4).map((a) => (
        <div className="activity-item" key={a.id}>
          <span className={cn("activity-icon", a.kind)}>
            {a.kind === "registration" ? (
              <Users size={15} />
            ) : a.kind === "checkin" ? (
              <Check size={15} />
            ) : (
              <CalendarDays size={15} />
            )}
          </span>
          <div>
            <strong>{a.text}</strong>
            <p>{a.detail}</p>
          </div>
          <time>{a.time}</time>
        </div>
      ))}
    </div>
  );
}
export function SearchBox({
  value,
  onChange,
  placeholder = "Search events...",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-box">
      <Search size={16} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange("")}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  onConfirm,
  destructive = false,
  confirmLabel = "Confirm",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  destructive?: boolean;
  confirmLabel?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Keep it as is
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export {
  Button,
  CalendarDays,
  Users,
  Clock3,
  ScanLine,
  Plus,
  ArrowRight,
  CircleCheck,
};
