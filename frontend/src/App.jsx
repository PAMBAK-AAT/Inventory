
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './components/Root.jsx';
import Login from './pages/login.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import Dashboard from './pages/dashboard.jsx';
import Categories from './components/Categories.jsx';

function App() {

  return (
    <>
      <Router>
        <Routes> 
          <Route path="/" element={<Root />} />

          <Route 
            path="/admin-dashboard"
            element={
              <ProtectedRoute requireRole={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          >
            <Route
              index
              element={<h1>Summary of dashboard</h1>}
            />
            <Route
              path="categories"
              element={<Categories />}
            />
            <Route
              path="products"
              element={<h1>Products Page</h1>}
            />
            <Route
              path="suppliers"
              element={<h1>Suppliers Page</h1>}
            />
            <Route
              path="users"
              element={<h1>Users Page</h1>}
            />
            <Route
              path="orders"
              element={<h1>Orders Page</h1>}
            />

          </Route>

          <Route path="/customer/dashboard" element={<h1>Customer Dashboard</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized Access</p>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
