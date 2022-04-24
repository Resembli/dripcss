import { hash } from "./hash"

export type TemplateArgument<T> = string | number | ((p: T) => string)

export let compile = <T>(t: TemplateStringsArray, a: TemplateArgument<T>[]) => {
  let cvm: Record<string, (p: T) => string> = {}
  let clx = `css-${hash(t.join(""))}`

  let cnt = 0
  let c = t.reduce((acc, next, index) => {
    let val = a[index]

    if (typeof val === "function") {
      let cvn = `--var-${clx}-${cnt++}`
      cvm[cvn] = val

      val = `var(${cvn})`
    }
    return acc + next + (val == null ? "" : val)
  }, "")

  const css = c.replace(/&/g, `.${clx}`)

  return [css, cvm, clx] as const
}
