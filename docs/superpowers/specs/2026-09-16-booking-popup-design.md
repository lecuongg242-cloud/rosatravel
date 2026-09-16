# Nút "Đặt tour" / "Liên hệ" mở popup thay vì chuyển trang

Ngày: 2026-09-16

## Vấn đề

Mọi nút CTA đang là `Link` sang `/lien-he`, khách phải rời trang đang xem mới điền được
form. Ở trang chi tiết tour điều này còn làm mất ngữ cảnh tour vừa đọc.

## Mục tiêu

Bấm nút đặt tour / liên hệ thì bung popup chứa form ngay tại trang hiện tại.
Trang `/lien-he` vẫn giữ nguyên để vào trực tiếp và cho SEO.

## Kiến trúc

Một popup dùng chung cho cả site, đặt ở `SiteLayout`:

- **`BookingDialogProvider`** (client) — bọc nội dung trong `(site)/layout.tsx`, giữ sẵn
  `contact`, `successMessage`, `bookingHref` (layout đã lấy từ Payload) và hàm
  `openBooking(payload?)`. Payload chỉ dùng cho trang tour: `tourId`, `tourTitle`,
  `price`, `departures`.
- **`BookingDialog`** — Radix Dialog theo đúng pattern `FloatingContact`/`MobileNav`:
  mobile trượt lên từ đáy, desktop hộp giữa màn hình, cao tối đa 90dvh và cuộn bên trong.
- **`BookingTrigger`** (client) — vẫn render `<a href>` với đúng className hiện tại nên
  giao diện không đổi. Click thường thì `preventDefault` và mở popup; Ctrl/Cmd/Shift-click
  hoặc chuột giữa vẫn mở tab mới; chưa có JS thì nút vẫn điều hướng như cũ.
  Không có provider (trang ui-kit, unit test cũ) thì nó là link thường.

## Nội dung popup

Tiêu đề + mô tả (`BookingForm.bookingTitle` / `consultationTitle` đã có sẵn), dòng
"Tour: *tên* — *giá*" khi mở từ trang tour, `BookingForm` nguyên vẹn, dải đáy gồm nút gọi
hotline và các kênh Zalo/Messenger. Gửi xong thì màn hình cảm ơn hiện trong popup; đóng rồi
mở lại là form sạch (Dialog.Content unmount khi đóng nên form tự dựng lại).

## Điểm áp dụng

Header desktop, MobileNav, nút nổi mobile, `BookingCard` trang tour (kèm tour + ngày khởi
hành), CTA trang danh sách tour, CTA trang tìm kiếm, và mục menu "Liên hệ".

Nhận biết mục menu "Liên hệ": so `href` của mục nav với đường dẫn đặt tour cấu hình trong
admin (`site-settings.bookingPath`, mặc định `/lien-he`), bỏ query/hash/dấu `/` cuối trước
khi so. Admin đổi đường dẫn thì nút tự theo, không hardcode trong code.

## Không đụng tới

Trang `/lien-he`, server action `submitBookingRequest`, schema, email gửi về — giữ nguyên.
Footer vẫn link sang `/lien-he` như cũ.

## Dọn kèm

Logic dựng danh sách ngày khởi hành đang nằm trong trang `/lien-he`; tách thành
`toDepartureOptions()` trong `src/lib/booking/departures.ts` để trang tour và popup dùng chung.

## Kiểm thử

Unit test cho `BookingTrigger` (mở popup, giữ hành vi link khi Ctrl-click, giữ link khi
không có provider), `BookingDialog` (hiện tên tour, hiện hotline), và hàm so khớp đường dẫn
menu. Test cũ không đổi vì khi không có provider thì nút vẫn là link.
