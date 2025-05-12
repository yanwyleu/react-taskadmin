import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

export const envConfig: any = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4040'
}

export default App
