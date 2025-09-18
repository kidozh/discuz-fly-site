import React, { useEffect, useRef, useState } from 'react';
import { useI18next, Link } from 'gatsby-plugin-react-i18next';

const LanguageSwitcher: React.FC = () => {
  const ctx = useI18next();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  if (!ctx) {
    // SSR fallback: render simple links so buttons appear in server-rendered HTML
    return (
      <div className="mb-4">
        <div className="mb-2">
          <a href="/" className="mr-2"><button className="px-2 py-1 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme">EN</button></a>
          <a href="/zh/" className="mr-2"><button className="px-2 py-1 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme">ZH</button></a>
        </div>
      </div>
    );
  }

  const { languages = [], language, originalPath } = ctx as {
    languages?: string[];
    language?: string;
    originalPath?: string;
  };

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-1 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme border border-gray-200 dark:border-gray-700 focus:outline-none transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {language ? language.toUpperCase() : 'LANG'}
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-theme dark:bg-theme ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {languages.map((lng) => (
              <Link key={lng} {...({ to: originalPath || '/', language: lng } as any)}>
                <button
                  onClick={() => setOpen(false)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${lng === language ? 'text-white' : 'text-theme dark:text-theme hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  style={lng === language ? { backgroundColor: 'rgb(var(--brand))' } : undefined}
                >
                  {lng.toUpperCase()}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
