import { Route, Routes } from 'react-router';
import Login from './login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>HELLOW WORLD!!!</div>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
