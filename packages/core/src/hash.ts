// https://stackoverflow.com/a/52171480
export let hash = (str: string) => {
  let seed = 0
  let m = Math.imul

  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = m(h1 ^ ch, 2654435761)
    h2 = m(h2 ^ ch, 1597334677)
  }
  h1 = m(h1 ^ (h1 >>> 16), 2246822507) ^ m(h2 ^ (h2 >>> 13), 3266489909)
  h2 = m(h2 ^ (h2 >>> 16), 2246822507) ^ m(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}
