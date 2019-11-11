import React from 'react'
import { App } from './app.js'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

window.onload = () => {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("app")
  )
}

