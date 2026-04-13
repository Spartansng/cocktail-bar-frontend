import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/client/Home';
import CocktailDetail from './pages/client/CocktailDetail';
import Order from './pages/client/Order';
import OrderTracking from './pages/client/OrderTracking';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCocktails from './pages/admin/ManageCocktails';
import ManageUsers from './pages/admin/ManageUsers';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cocktails/:id" element={<CocktailDetail />} />
          <Route path="/order" element={<Order />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/admin/login" element={<Login />} />
          {renderAdminRoutes()}
        </Routes>
      </main>
    </div>
  );
}

function renderAdminRoutes() {
  return (
    <>
      <Route path="/admin" element={<ProtectedRoute roles={['admin', 'staff']}><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin', 'staff']}><ManageOrders /></ProtectedRoute>} />
      <Route path="/admin/cocktails" element={<ProtectedRoute roles={['admin']}><ManageCocktails /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
    </>
  );
}

export default App;
