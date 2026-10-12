import { useState, useSyncExternalStore, lazy, Suspense } from "react";
import { PageSkeleton, PageErrorBoundary } from "./components/page-states";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ScanLine,
  UserRoundCheck,
  Settings,
  ChevronsUpDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  ArrowUpRight,
  Bell,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Search,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDemoStore } from "./demo-store";
import { useMobileNavigation } from "./use-mobile-navigation";
import { Logo, Button, PageHeader, Empty } from "./components/shared";
import { Overview } from "./components/overview";
import {
  Events,
  EventForm,
  EventDetails,
  Participants,
  Staff,
} from "./components/events";
import { CheckIn } from "./components/check-in";
const PublicEvent = lazy(() =>
  import("./components/public-experience").then((m) => ({
    default: m.PublicEvent,
  })),
);
const ManageParticipant = lazy(() =>
  import("./components/public-experience").then((m) => ({
    default: m.ManageParticipant,
  })),
);
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getRoute = () =>
  window.location.hash.replace(/^#\/?/, "").split("?")[0] || "overview";
const navItems = [
  { name: "Overview", path: "overview", icon: LayoutDashboard },
  { name: "Events", path: "events", icon: CalendarDays },
  { name: "Participants", path: "participants", icon: Users },
  { name: "Check-in", path: "check-in", icon: ScanLine },
  { name: "Staff", path: "staff", icon: UserRoundCheck },
  { name: "Settings", path: "settings", icon: Settings },
];
export default function App() {
  const store = useDemoStore();
  const route = useSyncExternalStore(subscribe, getRoute, () => "overview");
  const [page, id] = route.split("/");
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const mobileNav = useMobileNavigation(mobile, setMobile);
  const [account, setAccount] = useState(false);
  const [help, setHelp] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const navigate = (p: string) => {
    location.hash = `/${p}`;
    setMobile(false);
    setAccount(false);
    window.scrollTo({ top: 0 });
  };
  const event = store.events.find((e) => e.id === id);
  const person = store.participants.find((p) => p.id === id);
  const personEvent = store.events.find((e) => e.id === person?.eventId);
  const publicPage = [
    "public",
    "manage",
    "ticket",
    "share",
    "staff-check-in",
  ].includes(page);
  let content;
  if (page === "overview")
    content = <Overview store={store} navigate={navigate} />;
  else if (page === "events")
    content = <Events store={store} navigate={navigate} />;
  else if (page === "create" || page === "edit")
    content = (
      <EventForm key={route} store={store} navigate={navigate} event={event} />
    );
  else if (page === "event" && event)
    content = (
      <EventDetails
        key={event.id}
        event={event}
        store={store}
        navigate={navigate}
      />
    );
  else if (page === "participants") content = <Participants store={store} />;
  else if (page === "check-in")
    content = <CheckIn store={store} navigate={navigate} />;
  else if (page === "staff") content = <Staff navigate={navigate} />;
  else if (page === "public" && event)
    content = (
      <PublicEvent
        key={event.id}
        event={event}
        store={store}
        navigate={navigate}
      />
    );
  else if (
    ["manage", "ticket", "share"].includes(page) &&
    person &&
    personEvent
  )
    content = (
      <ManageParticipant
        key={person.id}
        person={person}
        event={personEvent}
        store={store}
        navigate={navigate}
        ticketOnly={page !== "manage"}
        share={page === "share"}
      />
    );
  else if (page === "staff-check-in" && event)
    content = <CheckIn store={store} event={event} staff navigate={navigate} />;
  else if (page === "settings")
    content = (
      <>
        <PageHeader
          title="A workspace that feels like you."
          description="Your preferences, your way."
        />
        <div className="panel settings-content">
          <h2>Workspace settings</h2>
          <form
            className="preferences-form"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Demo preferences saved for this session");
            }}
          >
            <label htmlFor="workspace">Workspace name</label>
            <input id="workspace" defaultValue="Acme Studio" required />
            <label htmlFor="organizer">Organizer display name</label>
            <input id="organizer" defaultValue="Alex Morgan" required />
            <label htmlFor="digest" className="checkbox-label">
              <input id="digest" type="checkbox" defaultChecked />
              Show weekly activity digest in the demo
            </label>
            <Button type="submit">Save preferences</Button>
          </form>
          <p className="demo-caption">
            Presentation-only preferences. No account, authentication, or
            production settings are changed.
          </p>
        </div>
      </>
    );
  else
    content = (
      <div className="panel">
        <Empty
          title="This demo link is unavailable"
          text="New demo registrations only exist until you reload the page."
        />
        <Button onClick={() => navigate("overview")}>Back to overview</Button>
      </div>
    );
  const view = (
    <PageErrorBoundary key={route}>
      <Suspense fallback={<PageSkeleton />}>{content}</Suspense>
    </PageErrorBoundary>
  );
  const activePage = ["event", "edit", "create"].includes(page)
    ? "events"
    : page;
  const label =
    navItems.find((n) => n.path === activePage)?.name || "EventFlow";
  return (
    <>
      <Toaster position="bottom-right" richColors />
      {publicPage ? (
        view
      ) : (
        <div className={cn("app-shell", collapsed && "is-collapsed")}>
          <aside
            id="workspace-navigation"
            ref={mobileNav.ref}
            inert={mobileNav.narrow && !mobile}
            role={mobileNav.narrow && mobile ? "dialog" : undefined}
            aria-modal={mobileNav.narrow && mobile ? true : undefined}
            aria-label="Workspace navigation"
            className={cn("sidebar", mobile && "mobile-open")}
          >
            <div className="sidebar-brand">
              <button
                aria-label="EventFlow overview"
                onClick={() => navigate("overview")}
              >
                <Logo />
              </button>
              <button
                className="sidebar-collapse"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <PanelLeftOpen size={16} />
                ) : (
                  <PanelLeftClose size={16} />
                )}
              </button>
              <button
                className="mobile-close"
                aria-label="Close navigation"
                onClick={() => setMobile(false)}
              >
                <X size={20} />
              </button>
            </div>
            <button
              className="workspace-switcher"
              onClick={() => setAccount(!account)}
            >
              <span className="workspace-icon">
                a<span>c</span>
              </span>
              <span>
                <strong>Acme Studio</strong>
                <small>Organizer workspace</small>
              </span>
              <ChevronsUpDown size={15} />
            </button>
            <div className="nav-caption">WORKSPACE</div>
            <nav aria-label="Main navigation">
              {navItems.map((n) => (
                <button
                  key={n.path}
                  className={cn("nav-item", activePage === n.path && "active")}
                  onClick={() => navigate(n.path)}
                  title={n.name}
                >
                  <n.icon size={19} />
                  <span>{n.name}</span>
                  {n.path === "events" && (
                    <span className="nav-count">{store.events.length}</span>
                  )}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="sidebar-note">
                <div>
                  <Sparkles size={17} />
                  <strong>More moments. Less busywork.</strong>
                </div>
                <p>
                  Bring people together.
                  <br />
                  We’ll handle the details.
                </p>
                <button onClick={() => navigate("public/design")}>
                  Explore attendee preview
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <button className="nav-item" onClick={() => setHelp(true)}>
                <HelpCircle size={18} />
                <span>Help & getting started</span>
                <ArrowUpRight size={15} />
              </button>
              <button
                className="sidebar-profile"
                onClick={() => setAccount(!account)}
              >
                <span className="profile-avatar">AM</span>
                <span>
                  <strong>Alex Morgan</strong>
                  <small>alex@acme.studio</small>
                </span>
                <ChevronsUpDown size={15} />
              </button>
            </div>
          </aside>
          {mobile && (
            <button
              className="mobile-backdrop"
              aria-label="Close menu"
              onClick={() => setMobile(false)}
            />
          )}
          <div className="workspace-main" inert={mobileNav.narrow && mobile}>
            <header className="topbar">
              <div className="breadcrumbs">
                <button
                  className="mobile-menu"
                  aria-label="Open navigation"
                  aria-expanded={mobile}
                  aria-controls="workspace-navigation"
                  onClick={() => setMobile(true)}
                >
                  <Menu size={21} />
                </button>
                <span className="breadcrumb-icon">
                  <LayoutDashboard size={16} />
                </span>
                <span className="breadcrumb-workspace">Workspace</span>
                <ChevronRight size={13} />
                <strong>{label}</strong>
                {page === "event" && (
                  <>
                    <ChevronRight size={13} />
                    <span className="breadcrumb-event">Event details</span>
                  </>
                )}
              </div>
              <div className="topbar-right">
                <span className="demo-badge">
                  <span />
                  Demo workspace
                </span>
                <button
                  className="notification-button"
                  aria-label="Recent notifications"
                  onClick={() => setNotifications(true)}
                >
                  <Bell size={18} />
                  <i />
                </button>
                <span className="topbar-divider" />
                <button
                  className="topbar-avatar"
                  aria-label="Open account menu"
                  onClick={() => setAccount(!account)}
                >
                  AM
                </button>
              </div>
            </header>
            <main className="main-content">{view}</main>
          </div>
        </div>
      )}
      {account && (
        <div className="account-menu">
          <strong>Alex Morgan</strong>
          <p>Demo organizer · Acme Studio</p>
          <Button variant="ghost" onClick={() => navigate("settings")}>
            Workspace settings
          </Button>
          <Button variant="ghost" onClick={() => navigate("public/design")}>
            Participant experience
            <ExternalLink />
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("staff-check-in/design")}
          >
            Staff experience
            <ExternalLink />
          </Button>
          <Button variant="outline" onClick={() => setAccount(false)}>
            Close menu
          </Button>
        </div>
      )}
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to your EventFlow demo</DialogTitle>
            <DialogDescription>
              Explore a complete event journey without touching production data.
            </DialogDescription>
          </DialogHeader>
          <div className="help-steps">
            <p>
              <strong>1. Make it yours.</strong> Create an event, update its
              details, then publish it.
            </p>
            <p>
              <strong>2. Bring people together.</strong> Preview the public page
              and simulate an email registration.
            </p>
            <p>
              <strong>3. Say hello.</strong> Use the ticket code to try
              check-in, duplicate detection, and organizer undo.
            </p>
            <p>
              All data is in memory and resets on reload. No emails,
              authentication, or API requests are performed.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={notifications} onOpenChange={setNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You’re all caught up</DialogTitle>
            <DialogDescription>
              Recent activity in your demo workspace.
            </DialogDescription>
          </DialogHeader>
          {store.activity.slice(0, 4).map((a) => (
            <div className="notification-row" key={a.id}>
              <strong>{a.text}</strong>
              <p>
                {a.detail} · {a.time}
              </p>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
