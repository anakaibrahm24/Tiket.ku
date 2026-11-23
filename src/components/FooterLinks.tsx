const links = ["Jadwal", "Tentang", "Bantuan", "Kontak"];

export const FooterLinks = () => {
  return (
    <nav className="flex flex-wrap items-center gap-6">
      {links.map((l) => (
        <a
          key={l}
          href="#"
          className="text-sm text-ink-600 hover:text-brand-blue"
        >
          {l}
        </a>
      ))}
    </nav>
  );
};