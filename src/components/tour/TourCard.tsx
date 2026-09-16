import { Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { Rating } from '@/components/ui/Rating'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { discountPercent } from '@/lib/format'
import type { TourSummary } from '@/types/content'

type TourCardProps = {
  tour: TourSummary
  /** Bật cho ảnh nằm trong màn hình đầu tiên (LCP). Next 16 thay `priority` bằng `preload`. */
  preload?: boolean
  sizes?: string
  className?: string
}

/**
 * Cả thẻ bấm được nhưng chỉ có MỘT link (tiêu đề, phủ `after:inset-0`), để
 * người dùng bàn phím và trình đọc màn hình không phải đi qua 3 link trùng nhau.
 */
export function TourCard({
  tour,
  preload = false,
  sizes = '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 82vw',
  className,
}: TourCardProps) {
  const t = useTranslations('Tour')
  const discount = discountPercent(tour.price, tour.originalPrice)

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-md bg-canvas-soft transition-transform duration-(--duration-fast) ease-brand hover:-translate-y-2 focus-within:-translate-y-2',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.coverImage.url}
          alt={tour.coverImage.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
        {tour.badges?.length ? (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {tour.badges.map((badge) => (
              <Badge key={badge} tone="primary">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
        {discount !== null ? (
          <Badge tone="ink" className="absolute top-3 right-3">
            <span aria-hidden>-{discount}%</span>
            <span className="sr-only">{t('discount', { percent: discount })}</span>
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Tên tour dài 60–85 ký tự; 2 dòng ở cỡ chữ đọc được là không đủ. */}
        <h3 className="line-clamp-3 text-body-sm font-bold text-ink">
          <Link
            href={`/tour/${tour.slug}`}
            className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
          >
            {tour.title}
          </Link>
        </h3>

        {tour.rating ? (
          <Rating
            average={tour.rating.average}
            count={tour.rating.count}
            bookedCount={tour.bookedCount}
          />
        ) : null}

        {/* Lưới 2 cột: giá luôn nằm góc phải, thẻ hẹp cũng không rớt xuống dòng riêng. */}
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 border-t border-mute/60 pt-3">
          <ul className="min-w-0 space-y-1 text-caption text-body">
            <li className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-4 shrink-0 text-primary" />
              <span>{t('duration', { days: tour.durationDays, nights: tour.durationNights })}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-4 shrink-0 text-primary" />
              {/* Nhãn ngắn để chừa chỗ cho giá; tỉnh tên dài thì xuống dòng chứ không cắt cụt. */}
              <span>{t('departureShort', { place: tour.departureFrom })}</span>
            </li>
          </ul>
          <Price price={tour.price} originalPrice={tour.originalPrice} />
        </div>
      </div>
    </article>
  )
}
