import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ParentComponent from './components/ParentComponent';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ParentComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
