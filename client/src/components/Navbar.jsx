import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
   return (
      <StyledNavbar>
         <div className="logo">Moonshot</div>
         <ul className="navbar-menu">
            <li>
               <Link to="/">Email Client</Link>
            </li>
            <li>
               <Link to="/dashboard">Data Visualization Dashboard</Link>
            </li>
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

      a {
         color: white;
         text-decoration: none;
         font-size: 1rem;
         transition: color 0.3s ease;

         &:hover {
         text-decoration: none;
         }
      }
   }

   @media (max-width: 768px) {
      flex-direction: column;
      padding: 1rem;

      .navbar-menu {
         flex-direction: column;
         margin-top: 1rem;
      }

      li {
         margin: 10px 0;
      }
   }
`;

export default Navbar;
