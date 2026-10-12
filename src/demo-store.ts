import { useState } from "react";
export type EventStatus = "Published" | "Draft" | "Completed" | "Cancelled";
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  timezone: string;
  capacity: number;
  status: EventStatus;
  category: string;
  color: string;
};
export type Participant = {
  id: string;
  eventId: string;
  email: string;
  status: "Confirmed" | "Waiting list" | "Cancelled";
  checkedIn: boolean;
  code: string;
  joined: number;
};
export type Activity = {
  id: string;
  text: string;
  detail: string;
  kind: "registration" | "checkin" | "event";
  time: string;
};
export const initialEvents: Event[] = [
  {
    id: "design",
    title: "Design Forward 2026",
    description:
      "A day for fresh perspectives. Join a community of designers, builders, and creative thinkers to explore what comes next in design. Inspiring conversations, practical ideas, and meaningful connections — all in one place.",
    date: "2026-10-24",
    time: "09:00",
    timezone: "America/Los_Angeles",
    capacity: 200,
    status: "Published",
    category: "Conference",
    color: "violet",
  },
  {
    id: "product",
    title: "Product People Meetup",
    description:
      "Good people. Great product conversations. An evening of honest insights, shared experiences, and new connections.",
    date: "2026-10-28",
    time: "18:00",
    timezone: "America/Los_Angeles",
    capacity: 80,
    status: "Published",
    category: "Meetup",
    color: "peach",
  },
  {
    id: "creative",
    title: "The Creative Workshop",
    description:
      "Make space for your next big idea. A hands-on session for curious minds and creative problem solvers.",
    date: "2026-11-02",
    time: "10:00",
    timezone: "America/Los_Angeles",
    capacity: 40,
    status: "Draft",
    category: "Workshop",
    color: "green",
  },
  {
    id: "founders",
    title: "Founders & Friends",
    description:
      "An intimate gathering for founders building a more thoughtful future.",
    date: "2026-11-06",
    time: "17:00",
    timezone: "America/Los_Angeles",
    capacity: 60,
    status: "Published",
    category: "Networking",
    color: "blue",
  },
  {
    id: "systems",
    title: "Design Systems, Together",
    description:
      "A community conversation about building design systems that scale.",
    date: "2026-10-08",
    time: "10:00",
    timezone: "America/Los_Angeles",
    capacity: 150,
    status: "Completed",
    category: "Workshop",
    color: "pink",
  },
  {
    id: "summer",
    title: "Summer Community Social",
    description: "A celebration of the people who make this community special.",
    date: "2026-09-18",
    time: "16:00",
    timezone: "America/Los_Angeles",
    capacity: 100,
    status: "Completed",
    category: "Community",
    color: "orange",
  },
];
const names = [
  "olivia.martin",
  "jackson.lee",
  "sophia.chen",
  "noah.williams",
  "emma.davis",
  "liam.wilson",
  "ava.thompson",
  "ethan.miller",
  "isabella.moore",
  "lucas.taylor",
];
export const initialParticipants: Participant[] = initialEvents.flatMap(
  (e, ei) => {
    const confirmed = [164, 80, 0, 38, 142, 96][ei],
      waiting = [0, 16, 0, 0, 0, 0][ei],
      checked = [0, 0, 0, 0, 128, 89][ei];
    return Array.from({ length: confirmed + waiting }, (_, i) => ({
      id: `${e.id}-${i}`,
      eventId: e.id,
      email: i < 10 ? `${names[i]}@example.com` : `guest.${i + 1}@example.com`,
      status:
        i < confirmed ? ("Confirmed" as const) : ("Waiting list" as const),
      checkedIn: i < checked,
      code: `EF-${ei + 1}${String(i + 1).padStart(4, "0")}`,
      joined: i,
    }));
  },
);
export const seedActivity: Activity[] = [
  {
    id: "1",
    text: "Olivia Martin registered",
    detail: "Design Forward 2026",
    kind: "registration",
    time: "2 min ago",
  },
  {
    id: "2",
    text: "Jackson Lee joined the waiting list",
    detail: "Product People Meetup",
    kind: "registration",
    time: "18 min ago",
  },
  {
    id: "3",
    text: "Design Forward 2026 published",
    detail: "Your registration page is live",
    kind: "event",
    time: "1 hour ago",
  },
  {
    id: "4",
    text: "Sophia Chen checked in",
    detail: "Design Systems, Together",
    kind: "checkin",
    time: "Oct 8",
  },
  {
    id: "5",
    text: "Founders & Friends created",
    detail: "Ready for something great",
    kind: "event",
    time: "Oct 7",
  },
];
export function useDemoStore() {
  const [events, setEvents] = useState(initialEvents);
  const [participants, setParticipants] = useState(initialParticipants);
  const [activity, setActivity] = useState(seedActivity);
  const log = (
    text: string,
    detail: string,
    kind: Activity["kind"] = "event",
  ) =>
    setActivity((a) =>
      [
        { id: crypto.randomUUID(), text, detail, kind, time: "Just now" },
        ...a,
      ].slice(0, 20),
    );
  const promote = (people: Participant[], event: Event) => {
    let seats =
      event.capacity -
      people.filter((p) => p.eventId === event.id && p.status === "Confirmed")
        .length;
    return people.map((p) =>
      p.eventId === event.id && p.status === "Waiting list" && seats-- > 0
        ? { ...p, status: "Confirmed" as const }
        : p,
    );
  };
  function saveEvent(event: Event) {
    setEvents((es) =>
      es.some((e) => e.id === event.id)
        ? es.map((e) => (e.id === event.id ? event : e))
        : [event, ...es],
    );
    setParticipants((ps) => promote(ps, event));
    log("Event details updated", event.title);
  }
  function cancelParticipant(id: string) {
    setParticipants((ps) => {
      const person = ps.find((p) => p.id === id);
      const event = events.find((e) => e.id === person?.eventId);
      const next = ps.map((p) =>
        p.id === id
          ? { ...p, status: "Cancelled" as const, checkedIn: false }
          : p,
      );
      return event && event.status === "Published"
        ? promote(next, event)
        : next;
    });
    log(
      "Registration cancelled",
      "Any available seat goes to the next person in line",
    );
  }
  function register(eventId: string, email: string) {
    const event = events.find((e) => e.id === eventId)!;
    if (event.status !== "Published")
      throw new Error("Registration is closed for this event.");
    const existing = participants.find(
      (p) =>
        p.eventId === eventId &&
        p.email === email.toLowerCase().trim() &&
        p.status !== "Cancelled",
    );
    if (existing) return existing;
    const full =
      participants.filter(
        (p) => p.eventId === eventId && p.status === "Confirmed",
      ).length >= event.capacity;
    const p: Participant = {
      id: crypto.randomUUID(),
      eventId,
      email: email.toLowerCase().trim(),
      status: full ? "Waiting list" : "Confirmed",
      checkedIn: false,
      code: `EF-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      joined: Date.now(),
    };
    setParticipants((ps) => [...ps, p]);
    log("New participant registered", event.title, "registration");
    return p;
  }
  function checkIn(eventId: string, code: string) {
    const event = events.find((e) => e.id === eventId);
    if (event?.status === "Cancelled") return "Event cancelled";
    const p = participants.find((p) => p.code === code.trim().toUpperCase());
    if (!p || p.status !== "Confirmed") return "Invalid ticket";
    if (p.eventId !== eventId) return "Wrong event";
    if (p.checkedIn) return "Already checked in";
    setParticipants((ps) =>
      ps.map((x) => (x.id === p.id ? { ...x, checkedIn: true } : x)),
    );
    log("Participant checked in", event?.title || "", "checkin");
    return "Successfully checked in";
  }
  return {
    events,
    participants,
    activity,
    saveEvent,
    cancelParticipant,
    register,
    checkIn,
    log,
    undo: (id: string) =>
      setParticipants((ps) =>
        ps.map((p) => (p.id === id ? { ...p, checkedIn: false } : p)),
      ),
    cancelEvent: (id: string) => {
      setEvents((es) =>
        es.map((e) => (e.id === id ? { ...e, status: "Cancelled" } : e)),
      );
      log("Event cancelled", events.find((e) => e.id === id)?.title || "");
    },
    deleteEvent: (id: string) =>
      setEvents((es) => es.filter((e) => e.id !== id)),
  };
}
export type Store = ReturnType<typeof useDemoStore>;
export const formatDate = (date: string, short = false) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: short ? "short" : "long",
    day: "numeric",
    ...(!short ? { year: "numeric" as const } : {}),
  });
export const formatTime = (time: string) =>
  new Date(`2026-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
export const counts = (event: Event, people: Participant[]) => {
  const ps = people.filter((p) => p.eventId === event.id);
  return {
    confirmed: ps.filter((p) => p.status === "Confirmed").length,
    waiting: ps.filter((p) => p.status === "Waiting list").length,
    checked: ps.filter((p) => p.checkedIn).length,
  };
};
