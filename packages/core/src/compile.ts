export type TemplateArgument<T> = string | number | ((p: T) => string)

export function compile<T>(
  template: TemplateStringsArray,
  args: TemplateArgument<T>[],
  varSuffix: string,
  global?: boolean,
) {
  const cssVarsMap: Record<string, (p: T) => string> = {}

  let cnt = 0
  const compiledStr = template.reduce((acc, nextPart, index) => {
    let val = args[index]

    if (typeof val === "function") {
      const cssVarName = `--css${global ? "-global" : ""}-${varSuffix}-${cnt}`
      cnt++
      cssVarsMap[cssVarName] = val

      val = `var(${cssVarName})`
    }
    // == is intentional for undefined or null
    return acc + nextPart + (val == null ? "" : val)
  }, "")

  return [compiledStr, cssVarsMap] as const
}
