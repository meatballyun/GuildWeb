import { Route, Routes } from 'react-router';
import Login from './login';
import SignUp from './signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>HELLO WORLD!!!</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
