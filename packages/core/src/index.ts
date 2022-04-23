import type { TemplateArgument } from "./compile"
import { compile } from "./compile"
import { cssStringToObject } from "./cssStringToObject"
import { hash } from "./hash"
import { parse } from "./parse"

export function css<T>(template: TemplateStringsArray, ...args: TemplateArgument<T>[]) {
  let isInitialized = false
  const className = "css" + hash(template.join(""))
  const [compiledTemplate, cssVarsMap] = compile(template, args, className)

  function initialCss() {
    const cssAsObject = cssStringToObject(compiledTemplate)
    const cssRules = parse(cssAsObject, `.${className}`)

    const existingSheet = document.getElementById(`${className}-root-style`)

    if (existingSheet) {
      existingSheet.innerHTML = cssRules
    } else {
      const styleSheet = document.createElement("style")
      styleSheet.id = `${className}-root-style`
      styleSheet.innerHTML = cssRules
      document.head.appendChild(styleSheet)
    }

    return true
  }

  return function (p?: T) {
    if (!isInitialized) isInitialized = initialCss()
    const varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      const value = cssVarsMap[key](p ?? ({} as T))
      if (value) acc[key] = value

      return acc
    }, {} as Record<string, string | number>)

    return [className, varResults] as const
  }
}

export function createGlobalStyle<T>(
  template: TemplateStringsArray,
  ...args: TemplateArgument<T>[]
) {
  let isInitialized = false
  const className = "css" + hash(template.join(""))
  const [compiledTemplate, cssVarsMap] = compile(template, args, className, true)

  function initializeGlobal() {
    const cssAsObject = cssStringToObject(compiledTemplate)
    const cssRules = parse(cssAsObject, "")

    const existingSheet = document.getElementById(`${className}-global-style`)

    if (existingSheet) {
      existingSheet.innerHTML = cssRules
    } else {
      const styleSheet = document.createElement("style")
      styleSheet.id = `${className}-global-style`
      styleSheet.innerHTML = cssRules
      document.head.appendChild(styleSheet)
    }

    return true
  }

  return function (p?: T) {
    if (!isInitialized) isInitialized = initializeGlobal()

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
