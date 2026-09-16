import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderWithIntl } from '@/test/render'

import { ItineraryAccordion } from './ItineraryAccordion'

const days = [1, 2, 3].map((n) => ({
  key: `d${n}`,
  heading: <span>Ngày {n} – Chặng {n}</span>,
  content: <p>Hoạt động ngày {n}</p>,
}))

const dayButtons = () => screen.getAllByRole('button', { name: /Ngày \d/ })

describe('ItineraryAccordion', () => {
  it('mở sẵn ngày đầu, các ngày sau thu gọn', () => {
    renderWithIntl(<ItineraryAccordion days={days} />)
    expect(dayButtons().map((b) => b.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'false'])
  })

  it('bấm vào một ngày thì mở ra, bấm lần nữa thì thu lại', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ItineraryAccordion days={days} />)

    await user.click(dayButtons()[1])
    expect(dayButtons()[1].getAttribute('aria-expanded')).toBe('true')
    await user.click(dayButtons()[1])
    expect(dayButtons()[1].getAttribute('aria-expanded')).toBe('false')
  })

  it('nút mở/thu tất cả đổi trạng thái cả danh sách', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ItineraryAccordion days={days} />)

    await user.click(screen.getByRole('button', { name: 'Mở tất cả các ngày' }))
    expect(dayButtons().every((b) => b.getAttribute('aria-expanded') === 'true')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Thu gọn tất cả' }))
    expect(dayButtons().every((b) => b.getAttribute('aria-expanded') === 'false')).toBe(true)
  })

  it('nội dung ngày thu gọn vẫn nằm trong DOM để Google đọc được', () => {
    renderWithIntl(<ItineraryAccordion days={days} />)
    expect(screen.getByText('Hoạt động ngày 3')).toBeTruthy()

    // panel đóng được đánh dấu inert nên không bắt được focus hay chuột
    const panel = document.getElementById(dayButtons()[2].getAttribute('aria-controls') as string)
    expect(panel?.hasAttribute('inert')).toBe(true)
  })

  it('một ngày duy nhất thì không hiện nút mở tất cả', () => {
    renderWithIntl(<ItineraryAccordion days={days.slice(0, 1)} />)
    expect(screen.queryByRole('button', { name: /tất cả/ })).toBeNull()
  })
})
