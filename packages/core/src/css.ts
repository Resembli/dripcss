import type { TemplateArgument } from "./compile"
import { compile } from "./compile"
import { hash } from "./hash"
import { initialStyleSheet } from "./initialStyleSheet"

export function css<T>(template: TemplateStringsArray, ...args: TemplateArgument<T>[]) {
  let isInitialized = false
  const className = "css" + hash(template.join(""))
  const [compiledTemplate, cssVarsMap] = compile(template, args, className)
  const id = `${className}-root-style`

  return function (p?: T) {
    if (!isInitialized) isInitialized = initialStyleSheet(compiledTemplate, id, `.${className}`)

    const varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      const value = cssVarsMap[key](p ?? ({} as T))
      if (value) acc[key] = value

      return acc
    }, {} as Record<string, string | number>)

    return [className, varResults] as const
  }
}
