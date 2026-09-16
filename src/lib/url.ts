/** Ghép query string vào đường dẫn, bỏ các giá trị rỗng. */
export function withQuery(path: string, params: Record<string, string | number | null | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

/** searchParams của Next có thể là mảng khi lặp tham số; chỉ lấy giá trị đầu. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function normalizePath(path: string): string {
  const base = path.split(/[?#]/)[0]
  return base.length > 1 ? base.replace(/\/+$/, '') : base
}

/** So hai đường dẫn, bỏ qua query, hash và dấu gạch chéo cuối. */
export function isSamePath(a: string, b: string): boolean {
  return normalizePath(a) === normalizePath(b)
}
