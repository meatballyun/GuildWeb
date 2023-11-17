import { Route, Routes } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>HELLOW WORLD!!!</div>} />
      <Route path="/login" element={<div>login</div>} />
    </Routes>
  );
}

export default App;
