import { useState } from "react";
import {
  Copy,
  ExternalLink,
  ArrowLeft,
  Pencil,
  SlidersHorizontal,
  Download,
  Trash2,
  Check,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type Event,
  type Store,
  type Participant,
  counts,
  formatDate,
  formatTime,
} from "../demo-store";
import {
  Button,
  PageHeader,
  Stats,
  EventTable,
  SearchBox,
  SectionHeading,
  Status,
  ConfirmDialog,
  Empty,
  Plus,
  ActivityFeed,
} from "./shared";
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch {
    toast.error(
      "Clipboard is unavailable in this browser. Please copy the link manually.",
    );
  }
}
import { EventArtwork, EventCard, isUpcoming } from './event-cards';
import { LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import { CheckIn } from './check-in';
export function Events({
  store,
  navigate,
}: {
  store: Store;
  navigate: (path: string) => void;
}) {
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All events');
  const [view,setView]=useState('grid');
  const [sort,setSort]=useState('ascending');
  const filtered=store.events.filter(e=>e.title.toLowerCase().includes(search.toLowerCase())&&(filter==='All events'||(filter==='Upcoming'?isUpcoming(e):filter==='Past'?e.status==='Completed':e.status===filter))).sort((a,b)=>(sort==='ascending'?1:-1)*a.date.localeCompare(b.date));
  return <><PageHeader eyebrow="ALL YOUR IDEAS, IN ONE PLACE" title="Made for bringing people together." description="Big conferences. Small gatherings. Every event has a home here." action={<Button size="lg" onClick={()=>navigate('create')}><Plus/>Create event</Button>}/><div className="gallery-tools"><SearchBox value={search} onChange={setSearch}/><div className="toolbar-actions"><select aria-label="Sort events" value={sort} onChange={e=>setSort(e.target.value)}><option value="ascending">Date: earliest first</option><option value="descending">Date: latest first</option></select><div className="view-toggle" role="group" aria-label="Event view"><button aria-label="Grid view" aria-pressed={view==='grid'} onClick={()=>setView('grid')}><LayoutGrid size={18}/></button><button aria-label="List view" aria-pressed={view==='list'} onClick={()=>setView('list')}><List size={18}/></button></div></div></div><div className="editorial-filters">{['All events','Upcoming','Past','Draft','Cancelled'].map(f=><button key={f} className={filter===f?'selected':''} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}{filter===f&&<span>{filtered.length}</span>}</button>)}</div>{view==='grid'?<div className="event-gallery">{filtered.map(e=><EventCard key={e.id} event={e} people={store.participants} onOpen={id=>navigate(`event/${id}`)}/>)}</div>:<div className="panel"><EventTable events={filtered} people={store.participants} onOpen={id=>navigate(`event/${id}`)}/></div>}{view==='grid'&&!filtered.length&&<Empty title="Nothing here just yet." text="Try another search or bring a new event to life."/>}<p className="gallery-footer">{filtered.length} events · Demo workspace</p></>;
}
export function EventForm({
  store,
  navigate,
  event,
}: {
  store: Store;
  navigate: (path: string) => void;
  event?: Event;
}) {
  const [error, setError] = useState("");
  return (
    <>
      <button
        className="back-link"
        onClick={() => navigate(event ? `event/${event.id}` : "events")}
      >
        <ArrowLeft size={16} />
        Back to {event ? "event" : "events"}
      </button>
      <PageHeader
        title={event ? "Make it your own." : "Something great starts here."}
        description={
          event
            ? "Update the details. Keep everyone on the same page."
            : "A few details are all you need to bring people together."
        }
      />
      <form
        className="panel event-form"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const capacity = Number(d.get("capacity"));
          if (event && capacity < counts(event, store.participants).confirmed) {
            setError(
              "Capacity cannot be lower than the number of confirmed registrations.",
            );
            return;
          }
          const next: Event = {
            id: event?.id || crypto.randomUUID(),
            title: String(d.get("title")).trim(),
            description: String(d.get("description")).trim(),
            date: String(d.get("date")),
            time: String(d.get("time")),
            timezone: String(d.get("timezone")),
            capacity,
            status: event?.status || "Draft",
            category: event?.category || "Community",
            color: event?.color || "violet",
          };
          if (!next.title) {
            setError("Please enter an event title.");
            return;
          }
          store.saveEvent(next);
          toast.success(
            event ? "Demo event updated" : "Demo event created as a draft",
          );
          navigate(`event/${next.id}`);
        }}
      >
        <SectionHeading
          title="Event details"
          description="The essentials for your registration page."
        />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Event title</FieldLabel>
            <Input
              id="title"
              name="title"
              required
              maxLength={120}
              defaultValue={event?.title}
              placeholder="Give your gathering a name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={event?.description}
              placeholder="What can participants look forward to?"
            />
          </Field>
          <div className="form-columns">
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Input
                id="date"
                type="date"
                name="date"
                required
                defaultValue={event?.date || "2026-11-01"}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="time">Start time</FieldLabel>
              <Input
                id="time"
                type="time"
                name="time"
                required
                defaultValue={event?.time || "09:00"}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="timezone">Time zone</FieldLabel>
            <select
              id="timezone"
              name="timezone"
              defaultValue={event?.timezone || "America/Los_Angeles"}
            >
              <option value="America/Los_Angeles">
                Pacific Time — Los Angeles
              </option>
              <option value="America/New_York">Eastern Time — New York</option>
              <option value="Europe/London">London</option>
              <option value="UTC">UTC</option>
            </select>
          </Field>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              max={100000}
              required
              defaultValue={event?.capacity || 100}
              aria-invalid={!!error}
            />
            <FieldDescription>
              When your event is full, new registrations join the waiting list.
              Increasing capacity promotes participants in order.
            </FieldDescription>
          </Field>
        </FieldGroup>
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <div className="form-footer">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(event ? `event/${event.id}` : "events")}
          >
            Cancel
          </Button>
          <Button type="submit">
            {event ? "Save changes" : "Create event"}
          </Button>
        </div>
      </form>
    </>
  );
}
export function Participants({
  store,
  event,
  embedded = false,
  initialFilter = 'All participants',
}: {
  store: Store;
  event?: Event;
  embedded?: boolean;
  initialFilter?: string;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [remove, setRemove] = useState<Participant | null>(null);
  const [page, setPage] = useState(0);
  const people = store.participants.filter(
    (p) =>
      (!event || p.eventId === event.id) &&
      p.email.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All participants" || p.status === filter),
  );
  const exportCSV = () => {
    const blob = new Blob(
      [
        "Email,Event,Status,Checked in\n" +
          people
            .map((p) =>
              [
                p.email,
                store.events.find((e) => e.id === p.eventId)?.title,
                p.status,
                p.checkedIn ? "Yes" : "No",
              ]
                .map((v) => `"${String(v).replaceAll('"', '""')}"`)
                .join(","),
            )
            .join("\n"),
      ],
      { type: "text/csv" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "eventflow-demo-participants.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <>
      {!embedded && (
        <PageHeader
          title="People make the event."
          description="Every registration, every waiting list, all in one place."
          action={
            <Button variant="outline" onClick={exportCSV}>
              <Download />
              Export CSV
            </Button>
          }
        />
      )}
      <section className={embedded ? "" : "panel"}>
        <div className="table-toolbar">
          <SearchBox
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(0);
            }}
            placeholder="Search participants..."
          />
          <div className="toolbar-actions">
            <select
              aria-label="Registration status"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(0);
              }}
            >
              {[
                "All participants",
                "Confirmed",
                "Waiting list",
                "Cancelled",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {embedded && (
              <Button variant="outline" onClick={exportCSV}>
                <Download />
                Export
              </Button>
            )}
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Participant</th>
                {!event && <th>Event</th>}
                <th>Registration</th>
                <th>Check-in</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.slice(page * 8, page * 8 + 8).map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="participant-cell">
                      <span className="person-avatar">
                        {p.email.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        {p.email}
                        <small>{p.code}</small>
                      </span>
                    </div>
                  </td>
                  {!event && (
                    <td>
                      {store.events.find((e) => e.id === p.eventId)?.title}
                    </td>
                  )}
                  <td>
                    <Status value={p.status} />
                    {p.status === "Waiting list" && (
                      <small>
                        Position #
                        {store.participants
                          .filter(
                            (x) =>
                              x.eventId === p.eventId &&
                              x.status === "Waiting list",
                          )
                          .findIndex((x) => x.id === p.id) + 1}
                      </small>
                    )}
                  </td>
                  <td>
                    {p.checkedIn ? (
                      <span className="checked-label">
                        <Check size={14} />
                        Checked in
                      </span>
                    ) : (
                      <span className="muted">Not checked in</span>
                    )}
                  </td>
                  <td>
                    {p.checkedIn ? (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          store.undo(p.id);
                          toast.success("Check-in undone");
                        }}
                      >
                        Undo check-in
                      </Button>
                    ) : (
                      p.status !== "Cancelled" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Cancel registration for ${p.email}`}
                          onClick={() => setRemove(p)}
                        >
                          <Trash2 />
                        </Button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {people.length === 0 && (
            <Empty
              title="No participants found"
              text="Try adjusting your search or registration filter."
            />
          )}
        </div>
        <div className="table-footer">
          <span>
            {people.length
              ? `${page * 8 + 1}–${Math.min(page * 8 + 8, people.length)} of ${people.length} participants`
              : "0 participants"}
          </span>
          <div className="toolbar-actions">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(page + 1) * 8 >= people.length}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
      <ConfirmDialog
        open={!!remove}
        onClose={() => setRemove(null)}
        title={
          remove?.status === "Waiting list"
            ? "Remove from waiting list?"
            : "Cancel this registration?"
        }
        description="Their registration and ticket will no longer be valid. An available seat will be offered to the next person on the waiting list. This affects demo data only."
        destructive
        confirmLabel="Cancel registration"
        onConfirm={() => {
          if (remove) store.cancelParticipant(remove.id);
          toast.success("Demo registration cancelled");
        }}
      />
    </>
  );
}
export function EventDetails({
  event,
  store,
  navigate,
}: {
  event: Event;
  store: Store;
  navigate: (p: string) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [action, setAction] = useState("");
  const [reauth, setReauth] = useState(false);
  const c = counts(event, store.participants);
  const url = `${window.location.origin}/#/public/${event.id}`;
  return (
    <>
      <button className="back-link" onClick={() => navigate("events")}>
        <ArrowLeft size={16} />
        All events
      </button>
      <div className="workspace-event-cover"><EventArtwork event={event}/><span className="cover-caption">{event.category} / {formatDate(event.date)}</span></div>
      <PageHeader
        eyebrow="YOUR EVENT WORKSPACE"
        title={event.title}
        description={`${formatDate(event.date)} · ${formatTime(event.time)} · ${event.timezone}`}
        action={
          <>
            <Button
              variant="outline"
              onClick={() => navigate(`edit/${event.id}`)}
            >
              <Pencil />
              Edit event
            </Button>
            <Button onClick={() => navigate(`public/${event.id}`)}>
              View public page
              <ExternalLink />
            </Button>
          </>
        }
      />
      <div className="event-meta-strip">
        <Status value={event.status} />
        <span className="link-preview">{url}</span>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Copy registration link"
          onClick={() => copyText(url)}
        >
          <Copy />
        </Button>
        {event.status === "Draft" && (
          <Button
            onClick={() => {
              store.saveEvent({ ...event, status: "Published" });
              toast.success("Demo registration opened");
            }}
          >
            Publish event
          </Button>
        )}
      </div>
      <Stats events={store.events} people={store.participants} event={event} />
      <div className="panel capacity-panel">
        <div>
          <strong>Room for great connections</strong>
          <p>
            {c.confirmed} of {event.capacity} seats filled ·{" "}
            {Math.max(0, event.capacity - c.confirmed)} seats available
          </p>
        </div>
        <div>
          <strong>{Math.round((c.confirmed / event.capacity) * 100)}%</strong>
          <div className="capacity-track">
            <span
              style={{
                width: `${Math.min((c.confirmed / event.capacity) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
      <section className="panel">
        <div className="detail-tabs">
          {["Overview", "Participants", "Waiting List", "Check-in", "Staff", "Event Settings"].map((t) => (
            <button
              className={tab === t ? "active" : ""}
              key={t}
              onClick={() => setTab(t)}
            >
              {t}
              {t === "Participants" && <span>{c.confirmed + c.waiting}</span>}
            </button>
          ))}
        </div>
        {tab === 'Overview' && <div className="event-overview-content"><div><span className="eyebrow">THE GATHERING</span><h2>A little more about your event.</h2><p>{event.description}</p><Button variant="outline" onClick={()=>navigate(`edit/${event.id}`)}>Edit event details <Pencil/></Button></div><aside><span className="eyebrow">REGISTRATION AT A GLANCE</span><h3>{c.confirmed} people. One great gathering.</h3><p>{c.waiting} on the waiting list · {c.checked} checked in</p><button className="text-action" onClick={()=>setTab('Participants')}>Meet your participants <ArrowUpRight size={16}/></button></aside></div>}
        {tab === 'Waiting List' && <Participants key="waiting" store={store} event={event} embedded initialFilter="Waiting list"/>}
        {tab === 'Check-in' && <CheckIn store={store} event={event} navigate={navigate}/>}
        {tab === "Participants" && (
          <Participants store={store} event={event} embedded />
        )}
        {tab === "Staff" && (
          <Staff event={event} navigate={navigate} embedded />
        )}
        {tab === "Activity" && (
          <ActivityFeed
            items={store.activity.filter((a) => a.detail === event.title)}
          />
        )}
        {tab === "Event Settings" && (
          <div className="settings-content">
            <h3>Event settings</h3>
            <p>{event.description}</p>
            <Button
              variant="outline"
              onClick={() => navigate(`edit/${event.id}`)}
            >
              <SlidersHorizontal />
              Edit details, capacity & schedule
            </Button>
            <div className="danger-zone">
              <h3>Careful changes</h3>
              <p>
                Cancelling closes registration and invalidates tickets. Deletion
                is only available for a draft with no registrations.
              </p>
              <div className="toolbar-actions">
                <Button
                  variant="destructive"
                  disabled={
                    event.status === "Cancelled" || event.status === "Completed"
                  }
                  onClick={() => {
                    setAction("cancel");
                    setReauth(true);
                  }}
                >
                  Cancel event
                </Button>
                <Button
                  variant="destructive"
                  disabled={
                    event.status !== "Draft" || c.confirmed + c.waiting > 0
                  }
                  onClick={() => {
                    setAction("delete");
                    setReauth(true);
                  }}
                >
                  Delete event
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
      <ConfirmDialog
        open={reauth}
        onClose={() => {
          setReauth(false);
          setAction("");
        }}
        title="Confirm your identity"
        description="In production, your existing authentication provider would verify a recent session here. This prototype does not collect credentials or authenticate you."
        confirmLabel="Continue in demo"
        onConfirm={() => {
          const pendingAction = action;
          setReauth(false);
          setTimeout(() => setAction(pendingAction), 0);
        }}
      />
      <ConfirmDialog
        open={!!action && !reauth}
        onClose={() => setAction("")}
        title={
          action === "delete"
            ? "Permanently delete this event?"
            : "Cancel this event?"
        }
        description={
          action === "delete"
            ? "This draft will be removed from the demo workspace. This cannot be undone."
            : `${c.confirmed} confirmed participants will be affected. Registration will close and tickets cannot be checked in. No real emails will be sent.`
        }
        destructive
        confirmLabel={action === "delete" ? "Delete event" : "Cancel event"}
        onConfirm={() => {
          if (action === "delete") {
            store.deleteEvent(event.id);
            navigate("events");
          } else store.cancelEvent(event.id);
          toast.success("Demo event updated");
        }}
      />
    </>
  );
}
export function Staff({
  event,
  navigate,
  embedded = false,
}: {
  event?: Event;
  navigate: (p: string) => void;
  embedded?: boolean;
}) {
  const [members, setMembers] = useState([
    { name: "Jamie Chen", email: "jamie@example.com" },
    { name: "Morgan Taylor", email: "morgan@example.com" },
  ]);
  const [email, setEmail] = useState("");
  return (
    <>
      {!embedded && (
        <PageHeader
          title="Your people, behind the scenes."
          description="Give your team just what they need for a smooth check-in."
        />
      )}
      <section
        className={embedded ? "settings-content" : "panel settings-content"}
      >
        <SectionHeading
          title="Event staff"
          description="Staff can validate tickets, but cannot access participant emails or organizer settings."
          action={
            <Button
              variant="outline"
              onClick={() =>
                navigate(`staff-check-in/${event?.id || "design"}`)
              }
            >
              Preview staff experience
              <ExternalLink />
            </Button>
          }
        />
        {members.map((m) => (
          <div className="staff-row" key={m.email}>
            <span className="person-avatar">
              {m.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <strong>{m.name}</strong>
              <p>{m.email}</p>
            </div>
            <Status value="Active" />
          </div>
        ))}
        <form
          className="invite-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (members.some((m) => m.email === email)) {
              toast.error("This staff member is already assigned");
              return;
            }
            setMembers((ms) => [...ms, { name: email.split("@")[0], email }]);
            setEmail("");
            toast.success(
              "Demo staff member added. No invitation email was sent.",
            );
          }}
        >
          <Field>
            <FieldLabel htmlFor="staff-email">Assign a staff member</FieldLabel>
            <div className="toolbar-actions">
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="colleague@example.com"
              />
              <Button type="submit">
                <Plus />
                Add staff
              </Button>
            </div>
          </Field>
        </form>
        <p className="demo-caption">
          <ShieldCheck size={14} />
          Demo assignments reset when the page is reloaded.
        </p>
      </section>
    </>
  );
}
