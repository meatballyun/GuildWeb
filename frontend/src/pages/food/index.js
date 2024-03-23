import { Route, Routes } from 'react-router';
import { FoodPage } from './FoodPage';

const FoodRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<FoodPage />} />
    </Routes>
  );
};

export default FoodRoute;
