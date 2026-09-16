'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useId, useState, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ItineraryDay = {
  key: string
  /** Nhãn "Ngày 1", tiêu đề ngày và dòng bữa ăn — dựng sẵn ở phía máy chủ. */
  heading: ReactNode
  content: ReactNode
}

type ItineraryAccordionProps = {
  days: ItineraryDay[]
}

/**
 * Lịch trình thu gọn theo ngày. Ngày đầu mở sẵn để khách thấy ngay nội dung,
 * các ngày sau bấm mới mở. Nội dung luôn nằm trong DOM (chỉ ẩn bằng chiều cao)
 * nên Google vẫn đọc được cả lịch trình.
 */
export function ItineraryAccordion({ days }: ItineraryAccordionProps) {
  const t = useTranslations('Blocks')
  const baseId = useId()
  const [open, setOpen] = useState<string[]>(days.length ? [days[0].key] : [])

  const allOpen = open.length === days.length
  const toggle = (key: string) =>
    setOpen((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]))

  return (
    <div className="space-y-4">
      {days.length > 1 ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(allOpen ? [] : days.map((day) => day.key))}
            className="rounded-sm text-body-sm font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {allOpen ? t('collapseAll') : t('expandAll')}
          </button>
        </div>
      ) : null}

      <ol className="divide-y divide-mute/60 border-y border-mute/60">
        {days.map((day, index) => {
          const isOpen = open.includes(day.key)
          const panelId = `${baseId}-${index}`

          return (
            <li key={day.key}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(day.key)}
                  className="flex w-full items-start gap-4 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                >
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-primary font-display text-body-sm font-semibold text-on-primary"
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">{day.heading}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'mt-2 size-5 shrink-0 text-body transition-transform duration-(--duration-base) ease-brand',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
              </h3>

              {/* grid-rows 0fr ↔ 1fr: mở và đóng đều có chuyển động, không giật. */}
              <div
                id={panelId}
                inert={!isOpen}
                className={cn(
                  'grid transition-[grid-template-rows] duration-(--duration-base) ease-brand',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 pb-5 sm:pl-14">{day.content}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
