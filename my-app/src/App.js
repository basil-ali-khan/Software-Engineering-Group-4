// import React from 'react';

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import HomePage from './pages/HomePage';
// import CartPage from './pages/CartPage';
// import Checkout from './pages/Checkout';
// import OrderConfirmation from './pages/OrderConfirmation';
// import NavigationBar from './components/Navbar';
// import Profile from './pages/Profile';
// import AdminDashboard from './pages/AdminDashboard';
// import RiderProfile from './pages/RiderProfile';
// import { CartProvider } from './context/CartContext';

// function App() {
//   return (
//     <Router>
//       <CartProvider>
//         <NavigationBar />
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/order-confirmation" element={<OrderConfirmation />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/rider" element={<RiderProfile />} />
//         </Routes>
//       </CartProvider>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import NavigationBar from './components/Navbar';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import RiderProfile from './pages/RiderProfile';
import { CartProvider } from './context/CartContext';

function App() {
  const location = useLocation();

  // Define routes where the NavigationBar should not appear
  const noNavbarRoutes = ['/login', '/register'];

  return (
    <CartProvider>
      {/* Conditionally render the NavigationBar */}
      {!noNavbarRoutes.includes(location.pathname) && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/rider" element={<RiderProfile />} />
      </Routes>
    </CartProvider>
  );
}

export default App;