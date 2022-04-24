import { hash } from "./hash"

export type TemplateArgument<T> = string | number | ((p: T) => string)

export function compile<T>(
  template: TemplateStringsArray,
  args: TemplateArgument<T>[],
  global?: boolean,
) {
  const cssVarsMap: Record<string, (p: T) => string> = {}
  const className = `css-${hash(template.join(""))}`

  let cnt = 0
  const compiledStr = template.reduce((acc, nextPart, index) => {
    let val = args[index]

    if (typeof val === "function") {
      const cssVarName = `--var${global ? "-global" : ""}-${className}-${cnt}`
      cnt++
      cssVarsMap[cssVarName] = val

      val = `var(${cssVarName})`
    }
    // == is intentional for undefined or null
    return acc + nextPart + (val == null ? "" : val)
  }, "")

  const cssStyle = compiledStr.replace(/&/g, `.${className}`)

  return [cssStyle, cssVarsMap, className] as const
}
