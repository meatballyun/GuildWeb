import { Route, Routes } from 'react-router';
import { FoodPage } from './FoodPage';

const FoodRoute = () => {
  return (
    <>
      123
      <Routes>
        <Route path="/" element={<FoodPage />} />
      </Routes>
    </>
  );
};

export default FoodRoute;
