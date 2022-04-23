const newRule = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g
const ruleClean = /\/\*[^]*?\*\/|\s\s+|\n/g

export function cssStringToObject(src: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tree: Record<string, any>[] = [{}]
  let block

  while ((block = newRule.exec(src.replace(ruleClean, "")))) {
    // Remove the current entry
    if (block[4]) {
      tree.shift()
    } else if (block[3]) {
      tree.unshift((tree[0][block[3]] = tree[0][block[3]] || {}))
    } else {
      tree[0][block[1]] = block[2]
    }
  }

  return tree[0]
}
