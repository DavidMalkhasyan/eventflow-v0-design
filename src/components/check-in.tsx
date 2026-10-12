import { useState } from "react";
import {
  ScanLine,
  ArrowRight,
  CircleCheck,
  AlertCircle,
  ArrowLeft,
  Keyboard,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { type Store, type Event, counts, formatDate } from "../demo-store";
import { Button, Logo, PageHeader, SectionHeading, Status } from "./shared";
export function CheckIn({
  store,
  event,
  staff = false,
  navigate,
}: {
  store: Store;
  event?: Event;
  staff?: boolean;
  navigate: (p: string) => void;
}) {
  const [selected, setSelected] = useState(
    event?.id || store.events.find((e) => e.status === "Published")?.id || "",
  );
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const active = store.events.find((e) => e.id === selected);
  if (!active) return <p>No event assigned.</p>;
  const c = counts(active, store.participants);
  const checked = store.participants.filter(
    (p) => p.eventId === active.id && p.checkedIn,
  );
  const sample = store.participants.find(
    (p) => p.eventId === active.id && p.status === "Confirmed" && !p.checkedIn,
  );
  const submit = (value: string) => {
    setResult(store.checkIn(active.id, value));
    setCode("");
  };
  const contents = (
    <>
      <div className="check-in-event">
        <div>
          <Status value={active.status} />
          <h2>{active.title}</h2>
          <p>
            {formatDate(active.date)} · {active.timezone}
          </p>
        </div>
        <div className="check-in-total">
          <strong>
            {c.checked}
            <span> / {c.confirmed}</span>
          </strong>
          <small>checked in</small>
        </div>
      </div>
      <div className="scanner-grid">
        <section className="panel scanner-panel">
          <div className="scanner-visual">
            <ScanLine size={64} strokeWidth={1} />
            <h3>
              {scanning ? "Scanner preview" : "A warm welcome starts here."}
            </h3>
            <p>
              {scanning
                ? "This demo simulates a QR scan. No camera is accessed."
                : "Scan a ticket or enter its code to check in."}
            </p>
            <Button
              onClick={() => setScanning(!scanning)}
              variant={scanning ? "outline" : "default"}
            >
              <ScanLine />
              {scanning ? "Close scanner preview" : "Open scanner preview"}
            </Button>
            {scanning && (
              <Button
                variant="outline"
                disabled={!sample}
                onClick={() => sample && submit(sample.code)}
              >
                Simulate scanning next ticket
              </Button>
            )}
          </div>
          <form
            className="manual-entry"
            onSubmit={(e) => {
              e.preventDefault();
              submit(code);
            }}
          >
            <Field>
              <FieldLabel htmlFor="ticket-code">
                <Keyboard size={16} />
                Or enter a ticket code
              </FieldLabel>
              <div className="toolbar-actions">
                <Input
                  id="ticket-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. EF-10001"
                  autoComplete="off"
                  required
                />
                <Button type="submit" disabled={!code.trim()}>
                  Check in
                  <ArrowRight />
                </Button>
              </div>
            </Field>
            <p className="demo-caption">
              Try demo code{" "}
              <button
                type="button"
                onClick={() => setCode(sample?.code || "EF-10001")}
              >
                {sample?.code || "EF-10001"}
              </button>
              . A second scan shows a duplicate.
            </p>
          </form>
          {result && (
            <div
              role="status"
              aria-live="polite"
              className={`scan-result ${result === "Successfully checked in" ? "success" : "failure"}`}
            >
              {result === "Successfully checked in" ? (
                <CircleCheck size={30} />
              ) : (
                <AlertCircle size={30} />
              )}
              <div>
                <h3>{result}</h3>
                <p>
                  {result === "Successfully checked in"
                    ? "All set. Enjoy the event!"
                    : result === "Already checked in"
                      ? "This ticket has already been used. No extra check-in was recorded."
                      : result === "Wrong event"
                        ? "This ticket belongs to a different event."
                        : result === "Event cancelled"
                          ? "Check-in is not available for a cancelled event."
                          : "Check the code and try again. Only confirmed tickets are valid."}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setResult("")}>
                Dismiss
              </Button>
            </div>
          )}
        </section>
        {!staff && (
          <section className="panel">
            <SectionHeading
              title="Recent arrivals"
              description="Every hello, in one place."
            />
            {checked.length ? (
              checked
                .slice(-8)
                .reverse()
                .map((p) => (
                  <div className="arrival-row" key={p.id}>
                    <span className="activity-icon checkin">
                      <CircleCheck size={16} />
                    </span>
                    <div>
                      <strong>{p.email}</strong>
                      <small>{p.code}</small>
                    </div>
                    <Button variant="ghost" onClick={() => store.undo(p.id)}>
                      Undo
                    </Button>
                  </div>
                ))
            ) : (
              <div className="empty-state">
                <UsersIcon />
                <h3>Ready for the first hello</h3>
                <p>Checked-in participants will appear here.</p>
              </div>
            )}
          </section>
        )}
      </div>
      <p className="check-in-note">
        <ShieldCheck size={15} />
        {staff
          ? "Staff mode · Ticket validation only · No participant email access"
          : "Organizer mode · You can undo a check-in if needed"}
      </p>
    </>
  );
  if (staff)
    return (
      <div className="staff-shell">
        <header>
          <Logo />
          <span className="staff-label">STAFF CHECK-IN</span>
        </header>
        <main>{contents}</main>
        <footer>
          Interactive staff preview · No live camera or backend connection
          <Button variant="ghost" onClick={() => navigate("staff")}>
            Exit preview
            <ArrowLeft />
          </Button>
        </footer>
      </div>
    );
  return (
    <>
      <PageHeader
        title="Make every arrival feel easy."
        description="One quick scan. One warm welcome."
        action={
          <select
            aria-label="Select event for check-in"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setResult("");
            }}
          >
            {store.events.map((e) => (
              <option value={e.id} key={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        }
      />
      {contents}
    </>
  );
}
function UsersIcon() {
  return <ScanLine size={28} />;
}
