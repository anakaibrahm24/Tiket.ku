import { useEffect, useState } from "react";

import {
  getSession,
  onAuthStateChange,
} from "@/features/auth/service/authService";

export const useSession = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getSession().then(({ data: { session } }) => {
      if (mounted) {
        setIsLoggedIn(!!session);
        setIsLoading(false);
      }
    });

    const { data: listener } = onAuthStateChange(async (_event, session) => {
      if (mounted) setIsLoggedIn(!!session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn, isLoading };
};