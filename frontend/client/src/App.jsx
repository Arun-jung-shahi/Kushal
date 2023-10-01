import React from "react"
import { Routes,Route } from "react-router-dom"
import Home from "./components/Home"

import Login from "./components/Login"
import Register from "./components/Register"
import ForgetPassword from "./components/ForgetPassword"
import ResetPassword from "./components/ResetPassword"
import Pagenotfound from "./components/Pagenotfound"

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/Forget-Password" element={<ForgetPassword/>}/>
      <Route path="/reset-password/:id/:passwordToken" element={<ResetPassword/>}/>
     
      <Route path='/login' element={<Login/>}/>
      <Route path="/pagenotfound" element={<Pagenotfound/>}/>
    </Routes>
      </>
  )
}

export default App
