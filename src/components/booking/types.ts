import type { DepartureOption } from '@/lib/booking/departures'

/** Thông tin tour kèm theo khi popup được mở từ trang chi tiết tour. Trống = yêu cầu tư vấn chung. */
export type BookingPayload = {
  tourId?: string
  tourTitle?: string
  price?: number
  departures?: DepartureOption[]
}
