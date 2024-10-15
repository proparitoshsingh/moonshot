import { useEffect, useState } from 'react';
import styled from 'styled-components';
import EmailItem from './EmailItem';
import { useNavigate } from 'react-router-dom';

const EmailList = ({ isSelected, setIsSelected, setSelectedEmail, activeFilter, favorites, selectedEmail }) => {
   const [allEmails, setAllEmails] = useState([]);
   const [emails, setEmails] = useState([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [filteredEmails, setFilteredEmails] = useState([]);
   const emailsPerPage = 10;
   const navigate = useNavigate();

   const fetchAllEmails = async () => {
      try {
         setLoading(true);
         const response = await fetch('https://flipkart-email-mock.now.sh/');
         const data = await response.json();
         setAllEmails(data.list);
         setLoading(false);
      } catch (err) {
         console.error('Error in fetching emails:', err);
         setLoading(false);
      }
   };

   const filterEmails = () => {
      let result = [...allEmails];
      const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
      const readEmails = JSON.parse(sessionStorage.getItem('readEmails')) || [];

      switch (activeFilter) {
         case 'favorites':
            result = result.filter(email => favorites.includes(email.id));
            break;
         case 'read':
            result = result.filter(email => readEmails.includes(email.id));
            break;
         case 'unread':
            result = result.filter(email => !readEmails.includes(email.id));
            break;
         default:
            break;
      }
      setFilteredEmails(result);
   };

   const paginateEmails = () => {
      const startIndex = (currentPage - 1) * emailsPerPage;
      const paginatedEmails = filteredEmails.slice(startIndex, startIndex + emailsPerPage);
      setEmails(paginatedEmails);
   };

   useEffect(() => {
      fetchAllEmails();
   }, []);

   useEffect(() => {
      filterEmails();
      setCurrentPage(1);
   }, [allEmails, activeFilter]);

   useEffect(() => {
      paginateEmails();
   }, [currentPage, filteredEmails]);


   const handleClick = (id) => {
      setSelectedEmail(emails.find(email => email.id === id));
      navigate(`/email/${id}`);
      setIsSelected(true);
   };

   const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

   const handlePageClick = (page) => {
      setCurrentPage(page);
   };

   if (loading) {
      return (
         <StyledWrapper>
            <p className="loading-text">Loading emails...</p>
         </StyledWrapper>
      );
   }

   if (filteredEmails.length === 0) {
      return (
         <StyledWrapper>
            <p className="loading-text">No emails found.</p>
         </StyledWrapper>
      );
   }

   return (
      <StyledWrapper>
         <ul className="email-list">
            {emails.map((email) => (
               <EmailItem
                  key={email.id}
                  email={email}
                  onClick={() => handleClick(email.id)}
                  isFavorite={favorites.includes(email.id)}
                  isSelected={selectedEmail.id === email.id}
               />
            ))}
         </ul>
         <div className="page-wrapper">
            {[...Array(totalPages)].map((_, index) => (
               <button
                  key={index + 1}
                  className={`page-button ${index === currentPage - 1 ? 'active' : ''}`}
                  onClick={() => handlePageClick(index + 1)}
               >
                  {index + 1}
               </button>
            ))}
         </div>
      </StyledWrapper>
   );
};

const StyledWrapper = styled.div`
   min-width: 30vw;
   transition: width 0.3s ease;
   padding: 0 20px;

   .loading-text {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
      font-size: 3rem;
      font-weight: bold;
      color: #333;
      text-align: center;
   }

   .email-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
   }

   .page-wrapper {
      display: flex;
      justify-content: center;
      margin: 5% 0;
   }

   .page-button {
      margin: 0 5px;
      padding: 10px 15px;
      border: none;
      background-color: #eaeaea;
      color: #333;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s ease;

      &.active {
         background-color: #e54065;
         color: white;
      }

      &:hover {
         background-color: #ccc;
      }
   }

   @media (max-width: 768px) {
      padding: 0 10px;
   }
`;

export default EmailList;

