import type { CSSProperties } from "react"
import { useId, useInsertionEffect } from "react"

import type { TemplateArgument } from "./compile"
import { compile } from "./compile"

export let css = <T>(template: TemplateStringsArray, ...args: TemplateArgument<T>[]) => {
  const [cssRules, cssVarsMap, className] = compile(template, args)

  function useCss(p?: T) {
    const id = useId()

    useInsertionEffect(() => {
      const existingSheet = document.getElementById(id)

      if (existingSheet) {
        existingSheet.innerHTML = cssRules
      } else {
        const styleSheet = document.createElement("style")
        styleSheet.id = id
        styleSheet.innerHTML = cssRules
        document.head.appendChild(styleSheet)
      }

      return () => {
        const el = document.getElementById(id)
        if (id && el) el.parentElement?.removeChild(el)
      }
    }, [])

    const varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      const value = cssVarsMap[key](p ?? ({} as T))
      if (value) acc[key] = value

      return acc
    }, {} as Record<string, string>)

    return [className, varResults as CSSProperties] as const
  }

  return useCss
}
