
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './components/Root.jsx';

function App() {

  return (
    <>
      <Router>
        <Routes> 
          <Route path="/" element={<Root />} />
          <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
          <Route path="/customer/dashboard" element={<h1>Customer Dashboard</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
