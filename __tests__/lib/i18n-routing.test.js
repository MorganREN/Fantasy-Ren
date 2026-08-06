import {
  buildLanguageAlternates,
  localizePath,
  resolveSupportedLocale
} from '@/lib/i18n/routing'

describe('i18n routing', () => {
  const locales = ['zh-CN', 'en']

  it('keeps the default locale unprefixed', () => {
    expect(localizePath('article/hello', 'zh-CN', 'zh-CN')).toBe(
      '/article/hello'
    )
    expect(localizePath('', 'zh-CN', 'zh-CN')).toBe('')
  })

  it('prefixes non-default locale paths', () => {
    expect(localizePath('/article/hello', 'en', 'zh-CN')).toBe(
      '/en/article/hello'
    )
    expect(localizePath('/', 'en', 'zh-CN')).toBe('/en')
  })

  it('matches browser region locales to a configured language locale', () => {
    expect(resolveSupportedLocale('en-AU', locales)).toBe('en')
    expect(resolveSupportedLocale('zh-Hans-CN', locales)).toBe('zh-CN')
    expect(resolveSupportedLocale('de-DE', locales)).toBeNull()
  })

  it('builds canonical alternates and x-default', () => {
    expect(
      buildLanguageAlternates({
        baseUrl: 'https://example.com',
        path: '/article/hello',
        locales,
        defaultLocale: 'zh-CN'
      })
    ).toEqual({
      alternates: [
        {
          locale: 'zh-CN',
          href: 'https://example.com/article/hello'
        },
        {
          locale: 'en',
          href: 'https://example.com/en/article/hello'
        }
      ],
      xDefault: 'https://example.com/article/hello'
    })
  })
})
