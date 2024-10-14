import { useState } from 'react';
import styled from 'styled-components';
import EmailList from './EmailList';
import EmailDetails from './EmailDetails';

const EmailLayout = () => {
   const [isSelected, setIsSelected] = useState(false);


   return (
      <StyledWrapper>
         <EmailList setIsSelected={setIsSelected} />
         {isSelected && (
            <EmailDetails />
         )}
      </StyledWrapper>
   );
};

const StyledWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   max-width: 80vw;
   margin: 0 auto;
   height: 100vh;

   @media (max-width: 768px) {
      flex-direction: column;
      height: auto;
   }

   & > div:nth-child(2) {
      display: ${props => (props.isSelected ? 'block' : 'none')};
      flex-grow: 1;
   }
`;

export default EmailLayout;
