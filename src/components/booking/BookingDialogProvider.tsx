'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import type { ContactSettings } from '@/types/content'

import { BookingDialog } from './BookingDialog'
import type { BookingPayload } from './types'

type BookingDialogValue = {
  openBooking: (payload?: BookingPayload) => void
}

const BookingDialogContext = createContext<BookingDialogValue | null>(null)

/**
 * `null` khi không có provider (trang ui-kit, unit test) — lúc đó nút đặt tour
 * giữ nguyên hành vi link sang trang liên hệ.
 */
export function useBookingDialog(): BookingDialogValue | null {
  return useContext(BookingDialogContext)
}

type BookingDialogProviderProps = {
  /** Global `site-settings` — hotline và các kênh chat hiện ở dải đáy popup. */
  contact: ContactSettings
  /** Lời cảm ơn do admin đặt. */
  successMessage?: string | null
  children: ReactNode
}

/** Một popup đặt tour duy nhất cho cả site; mọi nút CTA gọi vào đây. */
export function BookingDialogProvider({ contact, successMessage, children }: BookingDialogProviderProps) {
  // Giữ lại payload sau khi đóng để popup không đổi nội dung giữa chừng animation.
  const [state, setState] = useState<{ open: boolean; payload: BookingPayload }>({ open: false, payload: {} })

  const value = useMemo<BookingDialogValue>(
    () => ({ openBooking: (payload) => setState({ open: true, payload: payload ?? {} }) }),
    [],
  )

  return (
    <BookingDialogContext.Provider value={value}>
      {children}
      <BookingDialog
        open={state.open}
        payload={state.payload}
        contact={contact}
        successMessage={successMessage}
        onOpenChange={(open) => setState((current) => ({ ...current, open }))}
      />
    </BookingDialogContext.Provider>
  )
}
