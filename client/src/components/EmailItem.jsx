import { useEffect, useState } from 'react';
import styled from 'styled-components';
const EmailItem = ({ email, onClick, isFavorite, isSelected }) => {
   const [isRead, setIsRead] = useState(false);

   const { from, subject, short_description, date, id } = email;
   const avatar = from.name.charAt(0).toUpperCase();

   useEffect(() => {
      const readEmails = JSON.parse(sessionStorage.getItem('readEmails')) || [];
      setIsRead(readEmails.includes(id));
   }, [email]);

   const handleClick = () => {
      const readEmails = JSON.parse(sessionStorage.getItem('readEmails')) || [];
      if (!readEmails.includes(id)) {
         readEmails.push(id);
         sessionStorage.setItem('readEmails', JSON.stringify(readEmails));
         setIsRead(true);
      }
      onClick();
   }

   return (
      <StyledEmailItem onClick={handleClick} isRead={isRead} isSelected={isSelected} >
         <div className="email-avatar">{avatar}</div>
         <div className="email-details">
            <p className="email-from">From: <span className="bold-text">{`${from.name} <${from.email}>`}</span></p>
            <p className="email-subject">Subject: <span className="bold-text">{subject}</span></p>
            <p className="email-description">{short_description}</p>
            <div className="email-footer">
               <p className="email-date">
                  {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
               </p>
               {isFavorite && <span className="favorite-label">Favorite</span>}
            </div>
         </div>
      </StyledEmailItem>
   );
};

const StyledEmailItem = styled.li`
   display: flex;
   justify-content: flex-start;
   align-items: flex-start;
   padding: 1rem;
   margin-bottom: 2vh;
   border: 2px solid ${({isSelected}) => (isSelected ? '#e54065' : '#cfd2dc')};
   cursor: pointer;
   color: #636363;
   transition: background-color 0.3s ease, width 0.3s ease;

   border-radius: 5px;
   max-width: 90vw;
   overflow: hidden;
   
   &:hover {
      background-color: #f2f2f2;
   }

   background-color: ${({ isRead }) => (isRead ? '#f2f2f2' : '#fff')};

   .email-avatar {
      width: 50px;
      height: 50px;
      background-color: #e54065;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
   }

   .email-details {
      flex-grow: 1;
      margin-left: 1rem;
      display: flex;
      flex-direction: column;
      max-width: calc(100% - 60px);

      .email-from {
         font-size: 1rem;
         margin: 0.2rem 0;
      }

      .email-subject {
         font-size: 1rem;
         margin: 0.2rem 0;
      }

      .email-description {
         margin-bottom: 0.5rem;
         font-size: 0.9rem;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
      }

      .email-footer {
         display: flex;
         justify-content: start;
         align-items: center;

         .email-date {
            font-size: 0.85rem;
            color: #999;
         }

         .favorite-label {
            font-size: 0.85rem;
            color: #e54065;
            font-weight: bold;
            margin-left: 2rem;
         }
      }
   }

   .bold-text {
      font-weight: bold;
   }

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      .email-avatar {
         margin-bottom: 1rem;
      }

      .email-details {
         margin-left: 0;
         max-width: 100%;
      }
   }
`;

export default EmailItem;