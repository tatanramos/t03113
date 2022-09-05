import './App.css';
import Flights from './views/Flights.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Flights/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
