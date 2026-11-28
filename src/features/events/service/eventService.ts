import type { EventRecord, EventType } from "@/features/events/types/event.types";
import { supabase } from "@/lib/supabase";

interface CategoryRow {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
}

interface EventRow {
  id: string;
  type: EventType;
  title: string;
  subtitle: string;
  event_date: string;
  event_time: string;
  time_zone: string;
  venue: string;
  description: string;
  image_url: string | null;
  created_at: string;
  ticket_categories: CategoryRow[] | null;
}

const mapEvent = (row: EventRow): EventRecord => ({
  id: row.id,
  type: row.type,
  title: row.title,
  subtitle: row.subtitle,
  eventDate: row.event_date,
  eventTime: row.event_time,
  timeZone: row.time_zone,
  venue: row.venue,
  description: row.description,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  categories: (row.ticket_categories ?? []).map((category) => ({
    id: category.id,
    eventId: category.event_id,
    name: category.name,
    price: category.price,
    quota: category.quota,
    sold: category.sold,
    remaining: category.quota - category.sold,
  })),
});

const buildQuery = (type?: EventType) => {
  let query = supabase
    .from("events")
    .select("*, ticket_categories(*)")
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true });

  if (type) query = query.eq("type", type);
  return query;
};

export const getEvents = async (type?: EventType): Promise<EventRecord[]> => {
  const { data, error } = await buildQuery(type);
  if (error) throw error;
  return (data as EventRow[]).map(mapEvent);
};

export const getEventById = async (eventId: string): Promise<EventRecord | null> => {
  const { data, error } = await buildQuery().eq("id", eventId).single();
  if (error?.code === "PGRST116") return null;
  if (error) throw error;
  return mapEvent(data as EventRow);
};
