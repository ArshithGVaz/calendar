import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Admin from './components/Admin';
import WelcomePage from './components/WelcomePage';
import Employee from './components/Employee';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/welcome/:username" element={<WelcomePage />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
