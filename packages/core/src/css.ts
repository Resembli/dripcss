import type { CSSProperties } from "react"
import { useId, useInsertionEffect } from "react"

import type { TemplateArgument } from "./compile.js"
import { compile } from "./compile.js"

export let css = <T>(template: TemplateStringsArray, ...args: TemplateArgument<T>[]) => {
  let [innerHTML, cssVarsMap, className] = compile(template, args)
  // We need to ensure call this hook multiple times doesn't result in the same class being created
  // multiple times. Hence we keep track of the initialized value, and if it is initialized we don't add
  // it again to the head element.
  let initialized = false

  function useCss(): string
  function useCss(p: T): [string, CSSProperties]
  function useCss(p?: T) {
    let id = useId()

    useInsertionEffect(() => {
      if (initialized) return
      initialized = true
      document.head.appendChild(Object.assign(document.createElement("style"), { id, innerHTML }))

      return () => {
        let el = document.getElementById(id)
        el && el.parentElement?.removeChild(el)
        initialized = false
      }
    }, [])

    let varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      let value = cssVarsMap[key](p ?? ({} as T))
      if (value) acc[key] = value

      return acc
    }, {} as Record<string, string>)

    if (!p) return className
    return [className, varResults as CSSProperties] as const
  }

  return useCss
}
