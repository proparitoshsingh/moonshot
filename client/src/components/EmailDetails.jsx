import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const EmailDetails = ({ selectedEmail, updateFavorites }) => {
   const { id } = useParams();
   const [emailDetails, setEmailDetails] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isFavorite, setIsFavorite] = useState(false);

   const avatar = selectedEmail.from.name.charAt(0).toUpperCase();

   const fetchEmailDetails = async () => {
      try {
         setLoading(true);
         console.log("sending req for id - ", id);
         const response = await fetch(`https://flipkart-email-mock.now.sh/?id=${id}`);
         const data = await response.json();
         setEmailDetails(data);
         setLoading(false);
      } catch (error) {
         console.error('Error fetching email details:', error);
         setLoading(false);
      }
   };

   useEffect(() => {
      const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
      setIsFavorite(favorites.includes(id));
   }, [selectedEmail]);

   const handleFavoriteClick = () => {
      updateFavorites(id);
      setIsFavorite(!isFavorite);
   };

   useEffect(() => {
      fetchEmailDetails();
   }, [id]);


   if (loading) {
      return <p>Loading email details...</p>;
   }

   const { subject, date } = selectedEmail;

   return (
      <StyledEmailDetails>
         <div className="email-avatar">{avatar}</div>
         <div className="email-content">
            <div className="email-header">
               <div className="email-info">
                  <h2 className="email-subject">{subject}</h2>
                  <p className="email-date">
                     {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
               </div>
               <button className="favorite-btn" onClick={handleFavoriteClick}>
                  {isFavorite ? 'Remove as Favorite' : 'Mark as Favorite'}
               </button>
            </div>
            <div className="email-body" dangerouslySetInnerHTML={{ __html: emailDetails.body }} /> {/* can santize this before using but i think we r safe here */}
         </div>
      </StyledEmailDetails>
   );
};

const StyledEmailDetails = styled.div`
   display: flex;
   align-items: flex-start;
   padding: 2%;
   margin: 0 1rem;
   background-color: #f4f5f9;
   border: 2px solid #cfd2dc;
   border-radius: 5px;
   flex-grow: 1;
   max-height:100vh;
   max-width: 55vw;
   color: #636363;

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
      margin-right: 20px;
      flex-shrink:0;
   }

   .email-content {
      flex-grow: 1;
   }


   .email-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 10px;
      
      .email-info {
         flex-grow: 1;
      }


      .email-subject {
         font-size: 1.5rem;
         margin: 0.2rem 0;
      }

      .email-date {
         margin-top: 1rem;
         font-size: 0.85rem;
         color: #888;
      }


      .favorite-btn {
         background-color: #e54065;
         color: white;
         border: none;
         padding: 8px 12px;
         font-size: 0.9rem;
         cursor: pointer;
         border-radius: 20px;

         &:hover {
            background-color: #e4244e;
         }
      }
   }

   .email-body {
      margin-top: 10px;
      font-size: 1rem;
      line-height: 1.6;
   }

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;

      .email-avatar {
         margin-bottom: 10px;
         margin-right: 0; /* Reset margin */
      }

      .email-header {
         flex-direction: column;
         align-items: flex-start;

         .favorite-btn {
            margin-top: 10px;
         }
      }
   }
`;

export default EmailDetails;
