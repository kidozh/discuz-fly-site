import React, { useEffect, useRef, useState } from 'react';
import { useI18next, Link } from 'gatsby-plugin-react-i18next';

type LanguageSwitcherProps = { pageProps?: any }

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ pageProps }) => {
  const ctx = useI18next();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // If no context provided by plugin (possible during some SSR flows), try
  // to use the page's pageContext.i18n as a fallback so generated HTML reflects
  // the correct language.
  if (!ctx) {
    const fallback = pageProps?.pageContext?.i18n || { language: undefined, languages: undefined, originalPath: '/' }
    // DEBUG: log SSR fallback state
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[DEBUG][LanguageSwitcher] no ctx, pageProps.i18n=', pageProps?.pageContext?.i18n)
    }
    const language = fallback.language
    const languages = fallback.languages || ['en', 'zh']
    const originalPath = fallback.originalPath || '/'
    return (
      <div className="mb-4">
        <div className="mb-2">
          <a href="/" className="mr-2"><button className="px-2 py-1 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme">English</button></a>
          <a href="/zh/" className="mr-2"><button className="px-2 py-1 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme">中文</button></a>
        </div>
      </div>
    )
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

  const LangIcon = ({ lng }: { lng?: string }) => {
    const code = (lng || '').toLowerCase()
    if (code === 'zh') return <span aria-hidden>🇨🇳</span>
    if (code === 'en') return <span aria-hidden>🇬🇧</span>
    return <span aria-hidden>🌐</span>
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-center w-10 h-10 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme border border-gray-200 dark:border-gray-700 focus:outline-none transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={language ? `Language: ${language}` : 'Language'}
      >
        <span aria-hidden className="text-2xl leading-none">
          <LangIcon lng={language} />
        </span>
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
                  aria-label={`Switch to ${lng}`}>
                  <span className="mr-2 inline-block w-5 h-5 align-middle" aria-hidden>
                    <LangIcon lng={lng} />
                  </span>
                  <span className="align-middle">{lng.toUpperCase()}</span>
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
