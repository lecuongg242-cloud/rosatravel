'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Phone, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { BookingForm } from '@/components/forms/BookingForm'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { buildChannelLinks, hotlineHref } from '@/lib/contact'
import { formatVnd } from '@/lib/format'
import type { ContactSettings } from '@/types/content'

import type { BookingPayload } from './types'

type BookingDialogProps = {
  open: boolean
  payload: BookingPayload
  contact: ContactSettings
  successMessage?: string | null
  onOpenChange: (open: boolean) => void
}

const quickLink =
  'inline-flex h-10 items-center gap-2 rounded-md border border-mute/60 bg-canvas px-3 text-body-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-on-primary focus-visible:outline-2 focus-visible:outline-primary'

/**
 * Popup đặt tour / nhờ tư vấn. Mobile trượt lên từ đáy, desktop nằm giữa màn hình.
 * Đóng thì Radix gỡ nội dung khỏi DOM nên lần mở sau luôn là form sạch.
 */
export function BookingDialog({ open, payload, contact, successMessage, onOpenChange }: BookingDialogProps) {
  const t = useTranslations('BookingDialog')
  const tForm = useTranslations('BookingForm')
  const tContact = useTranslations('Contact')

  const isBooking = Boolean(payload.tourId)
  const tel = hotlineHref(contact)
  // Chỉ hai kênh nhắn tin phổ biến; các kênh còn lại đã có ở nút liên hệ nổi.
  const channels = buildChannelLinks(contact).filter(
    (channel) => channel.key === 'zalo' || channel.key === 'messenger',
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
        <Dialog.Content
          className={[
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-md bg-canvas shadow-panel',
            'data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in',
            // Desktop: căn giữa bằng inset+margin để animation pop không phá vị trí.
            'sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[85dvh] sm:w-[min(36rem,calc(100vw-3rem))] sm:rounded-md',
            'sm:data-[state=closed]:animate-pop-out sm:data-[state=open]:animate-pop-in',
          ].join(' ')}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-mute/60 px-5 py-4 sm:px-6">
            <div className="space-y-1">
              <Dialog.Title className="font-display text-display-xs font-semibold text-ink">
                {isBooking ? tForm('bookingTitle') : tForm('consultationTitle')}
              </Dialog.Title>
              <Dialog.Description className="text-body-sm text-body">
                {isBooking ? tForm('bookingDescription') : tForm('consultationDescription')}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t('close')}
              className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink transition-colors hover:bg-canvas-soft focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X aria-hidden className="size-5" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {payload.tourTitle ? (
              <p className="mb-5 rounded-md bg-canvas-soft px-4 py-3 text-body-sm text-ink">
                <span className="font-semibold">{payload.tourTitle}</span>
                {payload.price ? <span className="text-body"> — {formatVnd(payload.price)}</span> : null}
              </p>
            ) : null}
            <BookingForm
              type={isBooking ? 'booking' : 'consultation'}
              tourId={payload.tourId}
              departures={payload.departures}
              successMessage={successMessage}
            />
          </div>

          {tel || channels.length ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-mute/60 bg-canvas-soft px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-3">
              <span className="mr-1 text-caption text-body">{t('quickContact')}</span>
              {tel ? (
                <a href={tel} className={quickLink}>
                  <Phone aria-hidden className="size-4" />
                  {contact.hotline}
                </a>
              ) : null}
              {channels.map((channel) => (
                // Icon Zalo của simple-icons đã là chữ "Zalo" nên không ghi nhãn kèm nữa.
                <a
                  key={channel.key}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tContact(`channels.${channel.key}`)}
                  className={`${quickLink} w-12 justify-center px-0`}
                >
                  <BrandIcon channel={channel.key} className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
