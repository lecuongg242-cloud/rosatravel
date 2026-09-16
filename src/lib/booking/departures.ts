import type { useFormatter } from 'next-intl'

import { todayInVietnam } from '@/lib/booking/schema'
import { upcomingDepartures } from '@/lib/data/mappers'
import { formatVnd } from '@/lib/format'
import type { Tour } from '@/payload-types'

export type DepartureOption = { value: string; label: string }

/** Chỉ cần phần `dateTime` của formatter next-intl (cả bản hook lẫn bản server). */
type DateFormatter = Pick<ReturnType<typeof useFormatter>, 'dateTime'>

/**
 * Ngày khởi hành còn nhận khách, dạng lựa chọn cho form đặt tour.
 * Trang /lien-he và popup đặt tour dùng chung hàm này.
 */
export function toDepartureOptions(
  tour: Pick<Tour, 'departures' | 'price'>,
  format: DateFormatter,
  today = todayInVietnam(),
): DepartureOption[] {
  return upcomingDepartures(tour.departures)
    .filter((departure) => departure.status === 'available' || departure.status === 'limited')
    .map((departure) => ({
      value: departure.date.slice(0, 10),
      label: `${format.dateTime(new Date(departure.date), { day: '2-digit', month: '2-digit', year: 'numeric' })} – ${formatVnd(departure.price || tour.price)}`,
    }))
    .filter((option) => option.value >= today)
}
