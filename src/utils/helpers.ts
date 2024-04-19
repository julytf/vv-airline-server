export const minNotNull = (...arr: (number | null)[]) => {
  const nums: number[] = arr.filter((item): item is number => typeof item === 'number')
  return Math.min(...nums)
}
