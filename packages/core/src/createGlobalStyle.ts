import type { TemplateArgument } from "./compile"
import { compile } from "./compile"
import { hash } from "./hash"
import { initialStyleSheet } from "./initialStyleSheet"

export function createGlobalStyle<T>(
  template: TemplateStringsArray,
  ...args: TemplateArgument<T>[]
) {
  let isInitialized = false
  const className = "css" + hash(template.join(""))
  const [compiledTemplate, cssVarsMap] = compile(template, args, className, true)

  const id = `${className}-global-style`

  return function (p?: T) {
    if (!isInitialized) isInitialized = initialStyleSheet(compiledTemplate, id, "")

    const varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      const value = cssVarsMap[key](p ?? ({} as T))

      if (value) return `${acc}${key}: ${value};`

      return acc
    }, "")

    const rootVars = varResults ? `:root{${varResults}}` : ""

    const sheet = document.getElementById(`${className}-global-style`)
    if (!sheet) return

    sheet.innerHTML = `${rootVars}${sheet.innerHTML.replace(/:root{.*?}/, "")}`
  }
}
