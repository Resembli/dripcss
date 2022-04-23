import { cssStringToObject } from "./cssStringToObject"
import { parse } from "./parse"

export function initialStyleSheet(
  compiledTemplate: string,
  id: string,
  selector: string,
  keyframe?: boolean,
) {
  const cssAsObject = cssStringToObject(compiledTemplate)

  const cssRules = parse(keyframe ? { ["@keyframes " + id]: cssAsObject } : cssAsObject, selector)

  const existingSheet = document.getElementById(id)

  if (existingSheet) {
    existingSheet.innerHTML = cssRules
  } else {
    const styleSheet = document.createElement("style")
    styleSheet.id = id
    styleSheet.innerHTML = cssRules
    document.head.appendChild(styleSheet)
  }

  return true
}
