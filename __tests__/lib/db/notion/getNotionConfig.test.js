jest.mock('notion-utils', () => ({
  getDateValue: jest.fn(),
  getTextContent: jest.fn()
}))
jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn()
}))

import { isConfigTableBlock } from '@/lib/db/notion/getNotionConfig'

describe('Notion config table detection', () => {
  test.each(['collection_view', 'collection_view_page'])(
    'accepts %s databases',
    type => {
      expect(isConfigTableBlock({ type })).toBe(true)
    }
  )

  test('rejects non-database blocks', () => {
    expect(isConfigTableBlock({ type: 'page' })).toBe(false)
    expect(isConfigTableBlock(null)).toBe(false)
  })
})
