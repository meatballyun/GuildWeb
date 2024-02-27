import { Route, Routes } from 'react-router';
import HomePage from './home';
import Login from './login';
import SignUp from './signup';
import IngredientListPage from './food/ingredient-list';
import IngredientPage from './food/ingredient';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/IngredientListPage" element={<IngredientListPage />} />
      <Route path="/IngredientPage" element={<IngredientPage />} />
    </Routes>
  );
}

export default App;
