import EmailLayout from "../components/EmailLayout"
import styled from 'styled-components';

const Email = () => {
   return (
      <StyledEmailPage>
         <EmailLayout />
      </StyledEmailPage>
   )
}

const StyledEmailPage= styled.div`
   padding: 0 2rem;
`;
export default Email
