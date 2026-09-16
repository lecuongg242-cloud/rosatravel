import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Thang chữ riêng của dự án (@theme trong globals.css). Phải khai báo ở đây,
 * nếu không tailwind-merge tưởng `text-body-md` là một màu chữ và xoá mất màu
 * thật đứng cạnh nó — giá tour từng bị mất màu cam vì lỗi này.
 */
const fontSizes = [
  'display-xl',
  'display-lg',
  'display-md',
  'display-sub-sm',
  'display-xs',
  'body-lg',
  'body-md',
  'body-sm',
  'caption',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: fontSizes }],
    },
  },
})

/** Gộp class có điều kiện; class Tailwind trùng nhóm thì class sau thắng. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
