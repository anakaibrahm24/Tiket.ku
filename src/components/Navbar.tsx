import { useNavigate } from "react-router-dom";

interface NavbarProps {
  user: boolean;
}

export const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-line-soft bg-surface-white/95 px-6 py-4 backdrop-blur">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-xl font-bold text-brand-blue"
      >
        Tiket.ku
      </button>
      <div className="flex items-center gap-4 md:gap-8">
        <button
          type="button"
          onClick={() => navigate("/matchs")}
          className="text-sm font-medium text-ink-700 hover:text-brand-blue"
        >
          Jadwal
        </button>
        <a href="#" className="text-sm font-medium text-ink-700 hover:text-brand-blue">
          Tentang
        </a>
        <a href="#" className="text-sm font-medium text-ink-700 hover:text-brand-blue">
          Bantuan
        </a>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <button
            type="button"
            onClick={() => navigate("/matchs")}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-surface-white hover:bg-brand-hover"
          >
            Jadwal
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg border border-line-soft px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-surface-subtle"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-surface-white hover:bg-brand-hover"
            >
              Daftar
            </button>
          </>
        )}
      </div>
    </nav>
  );
};