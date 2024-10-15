import { useState, useEffect } from 'react';
import styled from 'styled-components';
import EmailList from './EmailList';
import EmailDetails from './EmailDetails';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailLayout = () => {
   const [isSelected, setIsSelected] = useState(false);
   const [selectedEmail, setSelectedEmail] = useState({});
   const [activeFilter, setActiveFilter] = useState('all');
   const [favorites, setFavorites] = useState(JSON.parse(sessionStorage.getItem('favorites')) || []);

   const navigate = useNavigate();
   const location = useLocation();

   const handleFilterClick = (filter) => {
      if (activeFilter === filter) {
         setActiveFilter('all');
         navigate('/');
      } else {
         setActiveFilter(filter);
         navigate(`/?filter=${filter}`);
      }
   };

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const filterParam = params.get('filter');

      if (filterParam) {
         setActiveFilter(filterParam);
      } else {
         setActiveFilter('all');
      }

      if (location.pathname === '/') {
         setIsSelected(false);
         setSelectedEmail({});
      }
   }, [location]);

   const updateFavorites = (id) => {
      let updatedFavorites = [...favorites];
      if (updatedFavorites.includes(id)) {
         updatedFavorites = updatedFavorites.filter(mailId => mailId !== id);
      } else {
         updatedFavorites.push(id);
      }
      setFavorites(updatedFavorites);
      sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
   };

   return (
      <div>
         <StyledFilters className="filter-bar">
            <span>Filter By: </span>
            <button className={activeFilter === 'unread' ? 'active' : ''} onClick={() => handleFilterClick('unread')}>Unread</button>
            <button className={activeFilter === 'read' ? 'active' : ''} onClick={() => handleFilterClick('read')}>Read</button>
            <button className={activeFilter === 'favorites' ? 'active' : ''} onClick={() => handleFilterClick('favorites')}>Favorites</button>
         </StyledFilters>
         <StyledWrapper>
            <EmailList 
               isSelected={isSelected} 
               setIsSelected={setIsSelected} 
               setSelectedEmail={setSelectedEmail} 
               activeFilter={activeFilter} 
               favorites={favorites} 
               selectedEmail={selectedEmail}
            />
            {isSelected && location.pathname.includes('/email/') && <EmailDetails selectedEmail={selectedEmail} updateFavorites={updateFavorites} />}
         </StyledWrapper>
      </div>
   );
};

const StyledWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   max-width: 100vw;
   margin-top: 2vh;
   @media (max-width: 768px) {
      flex-direction: column;
      height: auto;
   }

   & > div {
      flex-grow: 1;
   }
`;

const StyledFilters = styled.div`
   display: flex;
   align-items: center;
   margin-top: 4vh;
   margin-left: 2vw;

   span {
      font-weight: 500;
      margin-right: 12px;
   }

   button {
      background: transparent;
      color: #636363;
      border: none;
      padding: 8px 16px;
      margin-right: 8px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s, color 0.3s;

      &:hover {
         background-color: #e1e4ea;
         border: 1px solid #cfd2dc;
      }

      &.active {
         background: #e0e0e0;
         color: #000;
         border: 1px solid #aaa;
      }

      &:last-child {
         margin-right: 0;
      }
   }
`;

export default EmailLayout;
