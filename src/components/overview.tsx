import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  CalendarDays,
  ScanLine,
  Users,
  ChevronDown,
  Clock3,
} from "lucide-react";
import { type Store, counts, formatDate, formatTime } from "../demo-store";
import {
  Button,
  PageHeader,
  Stats,
  EventTable,
  SectionHeading,
  ActivityFeed,
  Status,
} from "./shared";
export function Overview({
  store,
  navigate,
}: {
  store: Store;
  navigate: (path: string) => void;
}) {
  const next = store.events.find((e) => e.status === "Published");
  return (
    <>
      <PageHeader
        title="A little planning. A great gathering."
        description="Welcome back, Alex. Here’s what’s happening with your events."
        action={
          <Button onClick={() => navigate("create")} size="lg">
            <Plus data-icon="inline-start" />
            Create event
          </Button>
        }
      />
      <Stats events={store.events} people={store.participants} />
      <div className="overview-columns">
        <section className="panel upcoming-panel">
          <SectionHeading
            title="Up next"
            action={<span className="subtle-label">Your next gathering</span>}
          />
          {next ? (
            <div className="upcoming-content">
              <button
                className="event-art"
                onClick={() => navigate(`event/${next.id}`)}
                aria-label={`View ${next.title}`}
              >
                <img
                  src="/images/design-summit.png"
                  alt="Sculptural white arches and indigo stairs"
                />
                <div className="art-wordmark">
                  DESIGN
                  <br />
                  FORWARD<span>2026 ↗</span>
                </div>
                <span className="art-label">A NEW PERSPECTIVE.</span>
              </button>
              <div className="upcoming-info">
                <Status value={next.status} />
                <h2>{next.title}</h2>
                <p>
                  <CalendarDays size={15} />
                  {formatDate(next.date)}
                  <span>·</span>
                  {formatTime(next.time)} PT
                </p>
                <div className="upcoming-registration">
                  <div className="avatar-stack">
                    <span>OM</span>
                    <span>JL</span>
                    <span>SC</span>
                    <span>
                      +
                      {Math.max(
                        0,
                        counts(next, store.participants).confirmed - 3,
                      )}
                    </span>
                  </div>
                  <span>
                    <strong>
                      {counts(next, store.participants).confirmed}
                    </strong>{" "}
                    people joining
                  </span>
                </div>
                <div className="upcoming-bottom">
                  <span>
                    <i />
                    Registration is open
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`event/${next.id}`)}
                  >
                    Manage event
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="empty-state">
              Your next great gathering starts with a new event.
            </p>
          )}
        </section>
        <section className="panel quick-panel">
          <SectionHeading
            title="Make things happen"
            description="A few shortcuts to keep you moving."
          />
          <div className="quick-actions">
            {[
              {
                title: "Create an event",
                text: "Bring your next idea to life",
                icon: Plus,
                path: "create",
              },
              {
                title: "Manage participants",
                text: "The people behind your events",
                icon: Users,
                path: "participants",
              },
              {
                title: "Open check-in",
                text: "Make every arrival feel easy",
                icon: ScanLine,
                path: "check-in",
              },
            ].map((a) => (
              <button key={a.title} onClick={() => navigate(a.path)}>
                <span className="quick-icon">
                  <a.icon size={19} />
                </span>
                <span>
                  <strong>{a.title}</strong>
                  <small>{a.text}</small>
                </span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <div className="quick-note">
            <span className="live-dot" />
            Everything in one place. Every detail covered.
          </div>
        </section>
      </div>
      <section className="panel recent-panel">
        <SectionHeading
          title="Your events"
          description="Good things are on the calendar."
          action={
            <Button variant="ghost" onClick={() => navigate("events")}>
              View all events
              <ArrowRight data-icon="inline-end" />
            </Button>
          }
        />
        <EventTable
          events={store.events.slice(0, 4)}
          people={store.participants}
          compact
          onOpen={(id) => navigate(`event/${id}`)}
        />
        <div className="table-footer">
          <span>
            Showing {Math.min(store.events.length, 4)} of {store.events.length}{" "}
            events
          </span>
          <span>
            <span className="live-dot" />
            You’re all up to date
          </span>
        </div>
      </section>
      <div className="overview-bottom">
        <section className="panel">
          <SectionHeading
            title="Recent activity"
            description="The latest, as it happens."
          />
          <ActivityFeed items={store.activity} />
        </section>
        <section className="thoughtful-panel">
          <span className="thoughtful-icon">
            <CalendarDays size={21} />
          </span>
          <span className="eyebrow">LESS ADMIN. MORE CONNECTION.</span>
          <h2>
            Great events start
            <br />
            with a little flow.
          </h2>
          <p>
            From the first registration to the last check-in.
            <br />
            We take care of the details. You bring people together.
          </p>
          <button onClick={() => navigate("public/design")}>
            Explore your attendee experience <ArrowUpRight size={15} />
          </button>
          <div className="decorative-orbits" aria-hidden="true" />
        </section>
      </div>
      <footer className="page-footer">
        <span>Made for the moments that bring us together.</span>
        <span>
          EventFlow <span>·</span> Demo workspace
        </span>
      </footer>
    </>
  );
}
