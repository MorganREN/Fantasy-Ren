import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SHORT_LABELS = {
  en: 'EN',
  zh: '中文',
  fr: 'FR',
  ja: '日本語',
  tr: 'TR'
}

/**
 * Locale-aware navigation that preserves the current route and query string.
 * Next.js owns locale-prefix generation, so this also works for dynamic paths.
 */
const LanguageSwitcher = ({ className = '' }) => {
  const router = useRouter()
  const { locale: dictionary } = useGlobal()
  const locales = [...new Set((router.locales || []).filter(Boolean))]

  if (locales.length < 2) return null

  const query = { ...router.query }
  delete query.lang
  delete query.locale
  const href = { pathname: router.pathname, query }
  const accessibleLabel = dictionary?.MENU?.LANGUAGE_SWITCH || 'Switch language'

  return (
    <nav
      aria-label={accessibleLabel}
      className={`flex items-center gap-1 text-sm ${className}`}
    >
      <i className='fa-solid fa-language' aria-hidden='true' />
      {locales.map((targetLocale, index) => {
        const active = targetLocale === router.locale
        const languageCode = targetLocale.split(/[-_]/)[0].toLowerCase()
        const label = SHORT_LABELS[languageCode] || targetLocale.toUpperCase()

        return (
          <span key={targetLocale} className='flex items-center'>
            {index > 0 && (
              <span aria-hidden='true' className='opacity-40'>
                /
              </span>
            )}
            {active ? (
              <span
                aria-current='page'
                className='px-1 font-semibold underline underline-offset-4'
              >
                {label}
              </span>
            ) : (
              <Link
                href={href}
                locale={targetLocale}
                hrefLang={targetLocale}
                className='px-1 opacity-70 transition-opacity hover:opacity-100'
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default LanguageSwitcher
