import type { TeamPayload } from "./matchesPayload.types";

export interface MatchPayload {
  id: string;
  matchId: string;
  team_home: TeamPayload;
  team_away: TeamPayload;
  match_time: string;
  time_zone: string;
  match_date: string;
  stadium: string;
  tickets: Record<string, { price: number; quota: number }>;
}
