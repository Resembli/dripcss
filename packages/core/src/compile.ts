import { hash } from "./hash.js"

export type TemplateArgument<T> = string | number | ((p: T) => string)

export let compile = <T>(t: TemplateStringsArray, a: TemplateArgument<T>[]) => {
  let cvm: Record<string, (p: T) => string> = {}
  let clx = `css-${hash(t.join(""))}`

  let cnt = 0
  let c = t.reduce((acc, next, i) => {
    let val = a[i]

    if (typeof val === "function") {
      let cvn = `--${clx}-${cnt++}`
      cvm[cvn] = val

      val = `var(${cvn})`
    }
    return acc + next + (val == null ? "" : val)
  }, "")

  let css = c.replace(/&/g, `.${clx}`)

  return [css, cvm, clx] as const
}
