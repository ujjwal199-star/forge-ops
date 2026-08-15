import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { events } from "@/lib/demo-data";
import type { EventRecord } from "@/lib/types";

interface EventContextValue {
  events: EventRecord[];
  currentEventId: string;
  currentEvent: EventRecord;
  setCurrentEventId: (id: string) => void;
}

const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [currentEventId, setCurrentEventId] = useState(events[0]!.id);

  const value = useMemo<EventContextValue>(
    () => ({
      events,
      currentEventId,
      currentEvent: events.find((e) => e.id === currentEventId) ?? events[0]!,
      setCurrentEventId,
    }),
    [currentEventId],
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useCurrentEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useCurrentEvent must be used inside EventProvider");
  return ctx;
}
