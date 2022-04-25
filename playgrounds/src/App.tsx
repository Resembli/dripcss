import { css } from "@resembli/dripcss"

const useCenterCss = css<{ margin: number }>`
  & {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50%;
    margin: ${(p) => `${p.margin}px`};
  }
`

function App() {
  const [cx, s] = useCenterCss({ margin: 20 })

  return (
    <div className={cx} style={s}>
      <div>Item</div>
      <BB />
      <BB />
    </div>
  )
}

const useBlackDiv = css`
  & {
    padding: 20px;
    color: white;
    background-color: black;
  }
`

function BB() {
  const cx = useBlackDiv()

  return <div className={cx}>LEEE</div>
}

export default App
