import { css } from "@resembli/dripcss"

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

function App() {
  const [clx] = center()

  return (
    <div className={clx}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </div>
  )
}

export default App
