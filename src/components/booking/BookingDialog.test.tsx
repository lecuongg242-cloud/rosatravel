import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithIntl } from '@/test/render'

import { BookingDialogProvider } from './BookingDialogProvider'
import { BookingTrigger } from './BookingTrigger'
import type { BookingPayload } from './types'

// Server action thật kéo theo Payload và Resend; test này chỉ quan tâm phần giao diện.
vi.mock('@/actions/booking', () => ({
  submitBookingRequest: vi.fn(async () => ({ status: 'idle' as const })),
}))

function renderTrigger(payload?: BookingPayload) {
  return renderWithIntl(
    <BookingDialogProvider contact={{ hotline: '0973122807', zalo: '0973122807' }}>
      <BookingTrigger href="/lien-he" payload={payload}>
        Đặt tour
      </BookingTrigger>
    </BookingDialogProvider>,
  )
}

describe('BookingTrigger', () => {
  it('không có provider thì vẫn là link sang trang liên hệ', () => {
    renderWithIntl(<BookingTrigger href="/lien-he">Đặt tour</BookingTrigger>)
    expect(screen.getByRole('link', { name: 'Đặt tour' }).getAttribute('href')).toBe('/lien-he')
  })

  it('bấm thường thì bung popup, không chuyển trang', async () => {
    const user = userEvent.setup()
    renderTrigger()

    await user.click(screen.getByRole('link', { name: 'Đặt tour' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog.textContent).toContain('Để lại thông tin, chúng tôi gọi lại tư vấn')
    expect(screen.getByRole('button', { name: 'Gửi yêu cầu' })).toBeTruthy()
  })

  // jsdom in "Not implemented: navigation to another Document" — đúng như mong đợi:
  // popup không chặn, trình duyệt thật sẽ mở tab mới.
  it('Ctrl-click vẫn để trình duyệt mở tab mới, không bung popup', () => {
    renderTrigger()

    fireEvent.click(screen.getByRole('link', { name: 'Đặt tour' }), { ctrlKey: true })

    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('BookingDialog', () => {
  it('mở từ trang tour thì hiện tên tour, giá và ngày khởi hành', async () => {
    const user = userEvent.setup()
    renderTrigger({
      tourId: 'tour-1',
      tourTitle: 'Tour Hà Giang 3 ngày 2 đêm',
      price: 5_990_000,
      departures: [{ value: '2026-10-01', label: '01/10/2026 – 5.990.000đ' }],
    })

    await user.click(screen.getByRole('link', { name: 'Đặt tour' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog.textContent).toContain('Gửi yêu cầu đặt tour')
    expect(dialog.textContent).toContain('Tour Hà Giang 3 ngày 2 đêm')
    expect(dialog.textContent).toContain('5.990.000đ')
    expect(screen.getByRole('option', { name: '01/10/2026 – 5.990.000đ' })).toBeTruthy()
  })

  it('dải đáy có hotline và Zalo để khách gọi ngay', async () => {
    const user = userEvent.setup()
    renderTrigger()

    await user.click(screen.getByRole('link', { name: 'Đặt tour' }))
    const dialog = await screen.findByRole('dialog')

    const hrefs = Array.from(dialog.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('tel:+84973122807')
    expect(hrefs).toContain('https://zalo.me/0973122807')
  })

  it('đóng popup thì lần mở sau là form sạch', async () => {
    const user = userEvent.setup()
    renderTrigger()

    await user.click(screen.getByRole('link', { name: 'Đặt tour' }))
    await user.type(screen.getByLabelText(/Họ và tên/), 'Nguyễn Văn A')
    await user.click(screen.getByRole('button', { name: 'Đóng' }))

    await user.click(screen.getByRole('link', { name: 'Đặt tour' }))
    await screen.findByRole('dialog')
    expect((screen.getByLabelText(/Họ và tên/) as HTMLInputElement).value).toBe('')
  })
})
