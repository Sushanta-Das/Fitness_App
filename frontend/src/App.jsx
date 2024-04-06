import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import Signup from './pages/Signup'
import Level from './pages/Level'
import Todo from './pages/Todo'
import History from './pages/History'

import Login from './pages/Login'

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
          <Route path="/signup/level/todo/history" element={< History />} />

          <Route path="/login" element={< Login />} />
          <Route path="/login/todo" element={< Todo />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
