import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('giữ cả cỡ chữ riêng lẫn màu chữ đứng cạnh nhau', () => {
    // Trước khi khai báo thang chữ, tailwind-merge tưởng `text-display-xs` là
    // màu và xoá mất `text-primary` — giá tour vì thế ra màu đen.
    expect(cn('font-bold text-primary', 'text-display-xs')).toBe('font-bold text-primary text-display-xs')
    expect(cn('text-body-md text-ink')).toBe('text-body-md text-ink')
    expect(cn('text-caption text-body')).toBe('text-caption text-body')
  })

  it('class sau vẫn đè class trước khi cùng nhóm', () => {
    expect(cn('text-body-md', 'text-caption')).toBe('text-caption')
    expect(cn('text-ink', 'text-primary')).toBe('text-primary')
  })
})
