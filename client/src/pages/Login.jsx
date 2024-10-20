import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleToggle = () => {
      navigate('/signup');
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
         const response = await axios.post('http://localhost:3000/auth/login', { username, password }, { withCredentials: true });
         console.log(response.data.message);
         localStorage.setItem('token', response.data.token);
         setIsAuthenticated(true);
         navigate('/dashboard');
      } catch (error) {
         console.error('Error signing up : ', error);
         setError('Failed to sign up. Please try again.');
      }
   };

   return (
      <Wrapper>
         <div className="card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
               {error && <ErrorMessage>{error}</ErrorMessage>}
               <label htmlFor="username">Username:</label>
               <input
                  type="username"
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
               <button type="submit">Login</button>
            </form>
            <button className="toggle-btn" type="button" onClick={handleToggle}>{`Don't have an account? Sign up`}</button>
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
   height: 90vh;
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
            background-color: #555;
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

export default Login;
