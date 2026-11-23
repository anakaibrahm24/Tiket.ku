import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getSession } from "@/features/auth/service/authService";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/matchs";

  useEffect(() => {
    let mounted = true;
    getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error || !session) {
        navigate("/login", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    });
    return () => {
      mounted = false;
    };
  }, [navigate, from]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-subtle">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
    </main>
  );
};

export default AuthCallbackPage;