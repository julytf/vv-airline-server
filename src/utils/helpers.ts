export const minNotNull = (...arr: (number | null)[]) => {
  const nums: number[] = arr.filter((item): item is number => typeof item === 'number')
  return Math.min(...nums)
}

export function generatePNR() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let pnr = ''

  for (let i = 0; i < 6; i++) {
    pnr += letters.charAt(Math.floor(Math.random() * letters.length))
  }

  return pnr
}
