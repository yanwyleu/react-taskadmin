import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { InventoryExample } from './client/components/dashboard/taskList';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskAdminHome from './client/pages/home';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Auth />} /> */}
        <Route path="/" element={<TaskAdminHome />} />
      </Routes>
    </Router>      
  )
}

export default App
