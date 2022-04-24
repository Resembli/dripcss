import type { CSSProperties } from "react"
import { useId, useInsertionEffect } from "react"

import type { TemplateArgument } from "./compile"
import { compile } from "./compile"

export let css = <T>(template: TemplateStringsArray, ...args: TemplateArgument<T>[]) => {
  let [innerHTML, cssVarsMap, className] = compile(template, args)

  let useCss = (p?: T) => {
    let id = useId()

    useInsertionEffect(() => {
      document.head.appendChild(Object.assign(document.createElement("style"), { id, innerHTML }))

      return () => {
        let el = document.getElementById(id)
        if (id && el) el.parentElement?.removeChild(el)
      }
    }, [])

    let varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      let value = cssVarsMap[key](p ?? ({} as T))
      if (value) acc[key] = value

      return acc
    }, {} as Record<string, string>)

    return [className, varResults as CSSProperties] as const
  }

  return useCss
}
