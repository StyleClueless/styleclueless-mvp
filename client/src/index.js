import React from 'react'
import { App } from './app.js'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
)

// ReactDOM.render(
//     <App>
//     </App>,
//     document.getElementById("root")
// )


