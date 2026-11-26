import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  user: boolean;
}

export const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-line-soft bg-surface-white/95 px-6 py-4 backdrop-blur lg:px-8">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 text-ink-900"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-blue text-surface-white">
          <span className="material-symbols-outlined text-title-md" aria-hidden="true">
            confirmation_number
          </span>
        </span>
        <span className="font-display text-title-md">Tiket.ku</span>
      </button>

      <div className="hidden items-center gap-6 md:flex">
        <button
          type="button"
          onClick={() => navigate("/matchs")}
          className="font-label text-label-lg text-ink-700 transition-colors hover:text-brand-blue"
        >
          Jadwal
        </button>
        <a href="#" className="font-label text-label-lg text-ink-700 transition-colors hover:text-brand-blue">
          Tentang
        </a>
        <a href="#" className="font-label text-label-lg text-ink-700 transition-colors hover:text-brand-blue">
          Bantuan
        </a>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Button
            type="button"
            label="Jadwal"
            variant="primary"
            onClick={() => navigate("/matchs")}
          />
        ) : (
          <>
            <Button
              type="button"
              label="Masuk"
              variant="secondary"
              onClick={() => navigate("/login")}
            />
            <Button
              type="button"
              label="Daftar"
              variant="primary"
              onClick={() => navigate("/signup")}
            />
          </>
        )}
      </div>
    </nav>
  );
};
