import { describe, expect, it } from 'vitest'

import { toDepartureOptions } from './departures'

const format = {
  dateTime: (value: Date) =>
    new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(value),
} as unknown as Parameters<typeof toDepartureOptions>[1]

const tour = {
  price: 5_990_000,
  departures: [
    { date: '2026-10-01T12:00:00.000Z', status: 'available' as const, price: null, seatsLeft: null },
    { date: '2026-10-08T12:00:00.000Z', status: 'limited' as const, price: 6_490_000, seatsLeft: 3 },
    { date: '2026-10-15T12:00:00.000Z', status: 'soldout' as const, price: null, seatsLeft: null },
    { date: '2026-08-01T12:00:00.000Z', status: 'available' as const, price: null, seatsLeft: null },
  ],
}

describe('toDepartureOptions', () => {
  it('chỉ lấy ngày còn nhận khách và còn ở tương lai', () => {
    const options = toDepartureOptions(tour, format, '2026-09-16')
    expect(options.map((option) => option.value)).toEqual(['2026-10-01', '2026-10-08'])
  })

  it('nhãn có giá riêng của ngày đó, không có thì lấy giá tour', () => {
    const options = toDepartureOptions(tour, format, '2026-09-16')
    expect(options[0].label).toContain('5.990.000đ')
    expect(options[1].label).toContain('6.490.000đ')
  })
})
