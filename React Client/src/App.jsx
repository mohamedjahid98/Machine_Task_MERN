import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import { useState } from 'react';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './Components/Login-Signup/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Components/Login-Signup/Signup';
import UserProfile from "./Components/SignupProfile/UserProfile";
import CreateProduct from "./Components/Products/CreateProduct";
import User from "./Components/Users/User";
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const isAuthenticated = () => {
    return localStorage.getItem('username') !== null;
  };

  const ProtectedRoute = ({ element }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/" />;
    }
    return element;
  };

  return (
    <div className="grid-container">
      <BrowserRouter>
        <InnerApp openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} isAuthenticated={isAuthenticated}
          ProtectedRoute={ProtectedRoute} />
      </BrowserRouter>
    </div>
  );
}

function InnerApp({ openSidebarToggle, OpenSidebar, isAuthenticated, ProtectedRoute }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';

  return (
// Routing of all page Component's
    <Routes>
      <Route path="/" element={<>{isLoginPage && isAuthenticated() ? <Navigate to="/home" /> : <Login className="login-page" />}</>}></Route>
      <Route path="/signup" element={<>{isSignupPage && <Signup />}</>}></Route>
      <Route path="/home" element={<ProtectedRoute element={<><Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <Home /></>} />}></Route>
      <Route path="/products/create" element={<ProtectedRoute element={<><Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <CreateProduct /></>} />}></Route>
      <Route path="/user" element={<ProtectedRoute element={<><Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <User /></>} />}></Route>
      <Route path="/userprofile/:id" element={<ProtectedRoute element={<><Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <UserProfile /></>} />}></Route>
    </Routes>
  );
}

export default App;
