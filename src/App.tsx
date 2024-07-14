import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Translate from './pages/Translate';
import './styles/App.scss';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/translate" element={<Translate />} />
      </Routes>
    </Router>
  );
};

export default App;
