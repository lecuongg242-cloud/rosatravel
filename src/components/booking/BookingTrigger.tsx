'use client'

import type { ComponentProps, MouseEvent } from 'react'

import { Link } from '@/i18n/navigation'

import { useBookingDialog } from './BookingDialogProvider'
import type { BookingPayload } from './types'

type BookingTriggerProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  /** Trang dự phòng: dùng khi chưa có JavaScript hoặc khách mở tab mới. */
  href: string
  payload?: BookingPayload
}

/**
 * Nút CTA mở popup đặt tour. Vẫn là thẻ <a> thật nên không có JavaScript thì
 * bấm vào vẫn sang trang liên hệ, và Ctrl/Cmd-click vẫn mở tab mới như thường.
 */
export function BookingTrigger({ href, payload, onClick, ...props }: BookingTriggerProps) {
  const booking = useBookingDialog()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (!booking || event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

    event.preventDefault()
    booking.openBooking(payload)
  }

  return <Link href={href} {...props} onClick={handleClick} />
}
