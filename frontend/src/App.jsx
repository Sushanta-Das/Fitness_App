import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import Signup from './pages/Signup'
import Level from './pages/Level'
import Todo from './pages/Todo'

function App() {
  const [idx, setIdx] = useState("")

  return (
    <>      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={< Home />} />
          <Route path="/signup" element={< Signup />} />
          <Route path="/signup/level" element={< Level />} />
          <Route path="/signup/level/todo" element={< Todo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
