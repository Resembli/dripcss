import type { CSSProperties } from "react"
import { useRef } from "react"
import { useInsertionEffect } from "react"

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
    let ref = useRef<HTMLStyleElement>()

    useInsertionEffect(() => {
      if (initialized) return
      initialized = true
      ref.current = Object.assign(document.createElement("style"), { innerHTML })
      document.head.appendChild(ref.current)

      return () => {
        ref.current?.parentElement?.removeChild(ref.current)
        ref.current = undefined
        initialized = false
      }
    }, [])

    let varResults = Object.keys(cssVarsMap).reduce((acc, key) => {
      acc[key] = cssVarsMap[key](p ?? ({} as T))

      return acc
    }, {} as Record<string, string>)

    return !p ? className : [className, varResults as CSSProperties]
  }

  return useCss
}
