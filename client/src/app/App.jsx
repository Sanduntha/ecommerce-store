import { useState } from 'react'
import './App.css'
import LoginPage from '../Pages/LoginPage/LoginPage'
import RegisterPage from '../Pages/RegisterPage/RegisterPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <RegisterPage/>

    </>
  )
}

export default App
