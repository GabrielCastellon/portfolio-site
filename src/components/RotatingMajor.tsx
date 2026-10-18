import { useEffect, useRef, useState } from 'react';

interface Props {
  roles: string[];
  accessibleLabel: string;
}

const ROTATION_INTERVAL_MS = 2000;
const FADE_DURATION_MS = 360;

/** Stable-width program crossfades; hover, keyboard focus, and reduced motion stop them. */
export default function RotatingMajor({ roles, accessibleLabel }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!container.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setOnScreen(entry.isIntersecting);
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hovered || focused || reducedMotion || !onScreen || roles.length < 2) {
      setFading(false);
      return;
    }

    let holdTimer: number;
    let fadeTimer: number | undefined;
    const rotate = () => {
      setFading(true);
      fadeTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % roles.length);
        setFading(false);
        holdTimer = window.setTimeout(rotate, ROTATION_INTERVAL_MS - FADE_DURATION_MS);
      }, FADE_DURATION_MS);
    };

    holdTimer = window.setTimeout(rotate, ROTATION_INTERVAL_MS - FADE_DURATION_MS);
    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [hovered, focused, reducedMotion, onScreen, roles.length]);

  if (roles.length === 0) return null;

  return (
    <div
      ref={container}
      data-major-rotator
      role="group"
      aria-label="Academic programs"
      aria-describedby="academic-program-description"
      tabIndex={0}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="mx-auto w-fit max-w-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <p id="academic-program-description" className="sr-only">{accessibleLabel}</p>
      <div className="flex min-h-11 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[15px] leading-relaxed sm:gap-x-3 sm:text-xl motion-reduce:hidden">
        <span aria-hidden="true" className="grid text-right text-ivory">
          {roles.map((role) => (
            <span key={role} className="invisible col-start-1 row-start-1 select-none">{role}</span>
          ))}
          <span
            data-role-value
            data-role-phase={fading ? 'fading' : 'visible'}
            className={`col-start-1 row-start-1 motion-safe:transition-[opacity,filter,translate] motion-safe:duration-300 ${fading ? 'translate-y-1 opacity-0 blur-[2px]' : 'translate-y-0 opacity-100 blur-none'}`}
          >
            {roles[index] ?? roles[0]}
          </span>
        </span>
        <span aria-hidden="true" className="text-accent">@ UofT</span>
      </div>
      <p aria-hidden="true" className="hidden text-base leading-relaxed text-ivory sm:text-xl motion-reduce:block">
        {roles.join(' · ')} <span className="text-accent">@ UofT</span>
      </p>
    </div>
  );
}
