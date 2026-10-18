import { useEffect, useState } from 'react';

interface Props {
  items: { label: string; href: string }[];
  isHome: boolean;
}

/** Reveal on deliberate upward scrolling; keyboard focus always reveals the links. */
export default function ScrollNavigation({ items, isHome }: Props) {
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let frame: number | null = null;
    setVisible(!isHome || previousY > 16);

    const update = () => {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY;

      if (currentY <= 16) {
        setVisible(!isHome);
        previousY = currentY;
      } else if (Math.abs(delta) >= 8) {
        setVisible(delta < 0);
        previousY = currentY;
      }
      frame = null;
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [isHome]);

  return (
    <header
      data-scroll-navigation
      data-visible={visible}
      className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-obsidian has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:translate-y-0 has-[:focus-visible]:opacity-100 motion-safe:transition-[translate,opacity] motion-safe:duration-300 ${visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}
    >
      <nav aria-label="Main navigation" className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:gap-x-9 sm:text-sm">
          {items.map(({ label, href }) => (
            <li key={href}>
              <a
                href={isHome ? href : `/${href}`}
                className="relative inline-flex min-h-11 items-center py-2 text-muted after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:content-[''] hover:text-ivory hover:after:scale-x-100 focus-visible:text-ivory focus-visible:after:scale-x-100 motion-safe:transition-colors motion-safe:after:transition-transform motion-safe:after:duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
