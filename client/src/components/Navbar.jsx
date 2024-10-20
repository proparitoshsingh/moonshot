import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
   const navigate = useNavigate();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const handleLogout = async () => {
      setIsAuthenticated(false);
      const response = await axios.post('http://localhost:3000/auth/logout', { withCredentials: true });
      localStorage.removeItem('token');
      console.log(response.data.message);
      navigate('/login');
   };

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   return (
      <StyledNavbar>
         <div className="logo">Moonshot</div>
         <div className="menu-icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
         </div>
         <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <li>
               <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Email Client</Link>
            </li>
            <li>
               <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Data Visualization Dashboard</Link>
            </li>
            {isAuthenticated ? (
               <li>
                  <button className="auth-btn" onClick={handleLogout}>Logout</button>
               </li>
            ) : (
               <li>
                  <Link to="/login" className="auth-btn" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
               </li>
            )}
         </ul>
      </StyledNavbar>
   );
};

const StyledNavbar = styled.nav`
   background-color: #282c34; 
   padding: 1.5rem 2rem;
   display: flex;
   justify-content: space-between;
   align-items: center;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
   position: relative;

   .logo {
      font-size: 1.5rem;
      color: #61dafb;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
   }

   .menu-icon {
      display: none;
      font-size: 1.8rem;
      color: white;
      cursor: pointer;
   }

   ul.navbar-menu {
      list-style: none;
      display: flex;
      justify-content: space-around;
      align-items: center;

      li {
         margin: 0 20px;
         position: relative;

         &:hover a {
            color: #61dafb;
         }

         &::after {
            content: '';
            display: block;
            height: 2px;
            width: 100%;
            background-color: #61dafb;
            position: absolute;
            bottom: -5px;
            left: 0;
            transform: scaleX(0);
            transition: transform 0.3s ease;
         }

         &:hover::after {
            transform: scaleX(1);
         }
      }

      a, .auth-btn {
         color: white;
         text-decoration: none;
         font-size: 1rem;
         transition: color 0.3s ease;
         background: none;
         border: none;
         cursor: pointer;

         &:hover {
            text-decoration: none;
            color: #61dafb;
         }
      }
   }

   @media (max-width: 768px) {
      padding: 1rem;
      flex-direction: row;
      justify-content: space-between;

      .menu-icon {
         display: block;
      }

      ul.navbar-menu {
         flex-direction: column;
         position: absolute;
         top: 60px;
         right: 0;
         width: 100%;
         background-color: #282c34;
         height: 0;
         overflow: hidden;
         transition: height 0.3s ease;
      }

      ul.navbar-menu.active {
         height: 200px;
         display: flex;
      }

      li {
         margin: 10px 0;
         text-align: center;
      }
   }
`;

export default Navbar;
