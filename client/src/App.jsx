import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Email from './pages/Email';
import Dashboard from './pages/Dashboard';
import './App.css';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Email />} />
        <Route path="/email/:id" element={<Email />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Placeholder */}
      </Routes>
    </Router>
  );
}

export default App;
