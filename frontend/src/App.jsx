
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './components/Root.jsx';
import Login from './pages/login.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import Dashboard from './pages/dashboard.jsx';
import Categories from './components/Categories.jsx';
import Supplier from './components/Supplier.jsx';
import SignUp from './pages/signup.jsx';
import Product from './components/Products.jsx'
import Users from './components/Users.jsx';
import CustomerProducts from './components/CustomerProducts.jsx';
import Orders from './components/Orders.jsx';
import Profile from './components/Profile.jsx';
import Summary from './components/Summary.jsx';


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
              element={<Summary />}
            />
            <Route
              path="categories"
              element={<Categories />}
            />
            <Route
              path="products"
              element={<Product />}
            />
            <Route
              path="suppliers"
              element={<Supplier />}
            />
            <Route
              path="users"
              element={<Users />}
            />
            <Route
              path="orders"
              element={<Orders />}
            />
            <Route path="profile" element={<Profile />}></Route>
            

          </Route>

          <Route 
            path="/customer-dashboard" 
            element={
              // ADD THIS PROTECTED ROUTE WRAPPER
              <ProtectedRoute requireRole={['customer', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerProducts />}></Route>
            <Route path="orders" element={<Orders />}></Route>
            <Route path="profile" element={<Profile />}></Route>

          </Route>
          <Route path="/login" element={<Login />} />
          <Route  path="/register" element={<SignUp />}/>
          <Route path="/unauthorized" element={<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized Access</p>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
