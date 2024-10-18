import { useState } from 'react';
import styled from 'styled-components';

const Signup = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');

   const handleConfirmPasswordChange = (e) => {
      const confirmPasswordValue = e.target.value;
      setConfirmPassword(confirmPasswordValue);
      if (confirmPasswordValue !== password) {
         setError("Passwords do not match ! ");
      } else {
         setError('');
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (error) {
         return;
      }

      // i ll write the signup logic here
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Confirm Password:', confirmPassword);
   };

   return (
      <Wrapper>
         <div className="card">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
               <label htmlFor="username">Username:</label>
               <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
               />
               <label htmlFor="password">Password:</label>
               <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
               />
               <label htmlFor="confirmPassword">Confirm Password:</label>
               <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Re-enter your password"
                  required
               />
               {error && <ErrorMessage>{error}</ErrorMessage>}
               <button type="submit" disabled={!!error}>Sign Up</button>
            </form>
            <button className="toggle-btn" type="button">
               Already have an account? Login
            </button>
         </div>
      </Wrapper>
   );
};

const ErrorMessage = styled.div`
   color: red;
   font-size: 14px;
   margin-bottom: 15px;
   text-align: left;
`;

const Wrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
   background-color: #f0f0f0;

   .card {
      background-color: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
   }

   h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
   }

   form {
      display: flex;
      flex-direction: column;

      label {
         font-size: 14px;
         margin-bottom: 5px;
         text-align: left;
      }

      input {
         padding: 12px;
         font-size: 14px;
         margin-bottom: 20px;
         border: 1px solid #ccc;
         border-radius: 5px;
         width: 100%;
         box-sizing: border-box;
      }

      button {
         padding: 12px 20px;
         background-color: #e54065;
         color: white;
         border: none;
         border-radius: 5px;
         cursor: pointer;
         font-size: 16px;
         transition: background-color 0.3s;

         &:hover {
            background-color: #555555;
         }

         &:disabled {
            background-color: #aaaaaa; 
            cursor: not-allowed;
         }
      }
   }

   .toggle-btn {
      background-color: transparent;
      border: none;
      color: #007BFF;
      margin-top: 15px;
      cursor: pointer;
      font-size: 14px;
      transition: color 0.3s;

      &:hover {
         color: #0056b3;
      }
   }
`;


export default Signup;
