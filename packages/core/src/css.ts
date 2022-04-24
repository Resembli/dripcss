import type { CSSProperties } from "react"
import { useId, useInsertionEffect } from "react"

import type { TemplateArgument } from "./compile"
import { compile } from "./compile"
import { hash } from "./hash"
import { initialStyleSheet } from "./initialStyleSheet"

export function css<T>(template: TemplateStringsArray, ...args: TemplateArgument<T>[]) {
  const className = "css" + hash(template.join(""))
  const [compiledTemplate, cssVarsMap] = compile(template, args, className)

  function useCss(props?: T) {
    const id = useId()

    useInsertionEffect(() => {
      initialStyleSheet(compiledTemplate, id, `.${className}`)

      return () => {
        const el = document.getElementById(id)
        if (id && el) el.parentElement?.removeChild(el)
      }
    }, [])

    const varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      const value = cssVarsMap[key](props ?? ({} as T))
      if (value) acc[key] = value

      return acc
    }, {} as Record<string, string>)

    return [className, varResults as CSSProperties] as const
  }

  return useCss
}
