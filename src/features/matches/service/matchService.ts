import { getEvents } from "@/features/events/service/eventService";
import type { MatchPayload } from "../types/matchesPayload";

// ponytail: adapter sengaja dangkal agar UI lama tetap kompil.
// Upgrade path: pakai EventRecord langsung saat halaman jadwal didesain ulang, lalu hapus adapter ini.
export const getMatches = async (): Promise<MatchPayload[]> => {
  const events = await getEvents();
  return events.map((event) => ({
    id: event.id,
    matchId: event.id,
    team_home: { name: event.title, logo: event.imageUrl ?? "" },
    team_away: { name: event.subtitle || event.title, logo: event.imageUrl ?? "" },
    match_time: event.eventTime,
    time_zone: event.timeZone,
    match_date: event.eventDate,
    stadium: event.venue,
    tickets: Object.fromEntries(
      event.categories.map((category) => [
        category.name,
        { price: category.price, quota: category.quota },
      ]),
    ),
  }));
};
