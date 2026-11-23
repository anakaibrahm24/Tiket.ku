import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import {
  getSession,
  onAuthStateChange,
} from "@/features/auth/service/authService";

export const useSession = () => {
  const [state, setState] = useState<{
    session: Session | null;
    isLoading: boolean;
  }>({ session: null, isLoading: true });

  useEffect(() => {
    let mounted = true;

    getSession()
      .then(({ data: { session } }) => {
        if (mounted) setState({ session, isLoading: false });
      })
      .catch(() => {
        if (mounted) setState({ session: null, isLoading: false });
      });

    const { data: listener } = onAuthStateChange(async (_event, session) => {
      if (mounted) setState((prev) => ({ ...prev, session }));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const { session, isLoading } = state;
  return {
    isLoggedIn: !!session,
    isLoading,
    session,
    user: session?.user ?? null,
  };
};