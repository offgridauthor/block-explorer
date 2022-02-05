import React from 'react'
import ReactDOM from 'react-dom'
// import "nes.css/css/nes.min.css";
import "../node_modules/nes.css/css/nes-core.min.css"
import './styles.css'
import { App } from './App'
import 'dotenv/config'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
