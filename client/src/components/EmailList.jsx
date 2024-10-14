import { useEffect, useState } from 'react';
import styled from 'styled-components';
import EmailItem from './EmailItem';
import { useNavigate } from 'react-router-dom';

const EmailList = ({ isSelected, setIsSelected, setSelectedEmail }) => {
   const [emails, setEmails] = useState([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalEmails, setTotalEmails] = useState(0);
   const navigate = useNavigate();
   const emailsPerPage = 10;

   const calcTotalEmails = async () => {
      try {
         const response = await fetch('https://flipkart-email-mock.now.sh/');
         const data = await response.json();
         setTotalEmails(data.list.length);
      } catch (err) {
         console.error('Error in fetching all the emails:', err);
      }
   };

   const fetchAllEmails = async (pageNumber) => {
      try {
         setLoading(true);
         const response = await fetch(`https://flipkart-email-mock.now.sh/?page=${pageNumber}`);
         const data = await response.json();
         setEmails(data.list);
         setLoading(false);
      } catch (err) {
         console.error('Error in fetching emails:', err);
         setLoading(false);
      }
   };

   useEffect(() => {
      calcTotalEmails();
   }, []);

   useEffect(() => {
      fetchAllEmails(currentPage);
   }, [currentPage]);

   const handleClick = (id) => {
      console.log("got clicked with val -",id);
      setSelectedEmail(emails.find(email => email.id === id));
      navigate(`/email/${id}`);
      setIsSelected(true);
   };

   const totalPages = Math.ceil(totalEmails / emailsPerPage);

   const handlePageClick = (page) => {
      setCurrentPage(page);
   };


   if (emails.length === 0) {
      return (
         <StyledWrapper>
            <p className="loading-text">{loading ? "Loading emails..." : "Some Error Occurred"}</p>
         </StyledWrapper>
      );
   }

   return (
      <StyledWrapper>
         <ul className="email-list">
            {emails.map((email) => (
               <EmailItem key={email.id} email={email} isSelected={isSelected} onClick={() => handleClick(email.id)} />
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
   max-height: 120vh;
   overflow-y: auto;

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

