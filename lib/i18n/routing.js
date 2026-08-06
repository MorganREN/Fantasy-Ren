import { createSiteUrl } from '@/lib/sitemap-utils'

/**
 * Return a stable, case-insensitive locale match.
 * Exact BCP 47 matches win; language-only matches are the fallback.
 */
export function resolveSupportedLocale(preferredLocale, supportedLocales = []) {
  const preferred = normalizeLocale(preferredLocale)
  if (!preferred) return null

  const locales = supportedLocales.filter(Boolean)
  const exact = locales.find(
    locale => normalizeLocale(locale).toLowerCase() === preferred.toLowerCase()
  )
  if (exact) return exact

  const language = getLanguageCode(preferred)
  return locales.find(locale => getLanguageCode(locale) === language) || null
}

/**
 * Add the Next.js locale segment to a site-relative path. The default locale
 * intentionally remains unprefixed (e.g. zh-CN => /, en => /en).
 */
export function localizePath(path, locale, defaultLocale) {
  const normalizedPath = normalizePath(path)
  const normalizedLocale = normalizeLocale(locale)
  const normalizedDefault = normalizeLocale(defaultLocale)

  if (
    !normalizedLocale ||
    normalizedLocale.toLowerCase() === normalizedDefault.toLowerCase()
  ) {
    return normalizedPath
  }

  return `/${normalizedLocale}${normalizedPath}`
}

/** Build canonical/alternate URLs for every configured Next.js locale. */
export function buildLanguageAlternates({
  baseUrl,
  path = '',
  locales = [],
  defaultLocale
}) {
  const uniqueLocales = [...new Set(locales.filter(Boolean))]
  const alternates = uniqueLocales
    .map(locale => ({
      locale,
      href: createSiteUrl(baseUrl, localizePath(path, locale, defaultLocale))
    }))
    .filter(item => item.href)

  const xDefault = alternates.find(
    item =>
      normalizeLocale(item.locale).toLowerCase() ===
      normalizeLocale(defaultLocale).toLowerCase()
  )?.href

  return { alternates, xDefault: xDefault || null }
}

export function getLanguageCode(locale) {
  return normalizeLocale(locale).split(/[-_]/)[0].toLowerCase()
}

function normalizeLocale(locale) {
  return typeof locale === 'string' ? locale.trim() : ''
}

function normalizePath(path) {
  if (!path || path === '/') return ''
  if (typeof path !== 'string') return ''

  const withoutQuery = path.split(/[?#]/)[0]
  if (!withoutQuery || withoutQuery === '/') return ''
  return `/${withoutQuery.replace(/^\/+|\/+$/g, '')}`
}
