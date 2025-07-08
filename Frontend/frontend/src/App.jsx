import { useState } from 'react'
import './App.css'
import EmotionAnalyzer from './EmotionalAnalyzer'

function App() {
  const [count, setCount] = useState(0)

  return (<>
    <EmotionAnalyzer></EmotionAnalyzer>
    </>
  )
}

export default App
