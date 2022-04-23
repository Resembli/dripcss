import { createGlobalStyle, css } from "@resembli/dripcss"

const center = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  div {
    margin: 20px;
    padding: 20px;
    border: 1px solid black;
  }
`

const global = createGlobalStyle`
  body, html {
    height: 100%;
    margin: 0;
  }
  #root {
    height: 100%;
  }
`

function App() {
  const [clx] = center()
  global()

  return (
    <div className={clx}>
      <div>Item 2</div>
      <div>Item 3</div>
    </div>
  )
}

export default App
