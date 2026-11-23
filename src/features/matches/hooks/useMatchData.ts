// src/features/match/hooks/useMatchData.ts
import { useEffect, useState } from "react";
import { getMatches } from "../service/matchService";
import type { MatchPayload } from "../types/matchesPayload";

export const useMatchData = () => {
  const [matches, setMatches] = useState<MatchPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  return { matches, loading, error };
};
