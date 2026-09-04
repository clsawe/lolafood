export const fmt = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm"

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
