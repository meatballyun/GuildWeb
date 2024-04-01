import { Route, Routes } from 'react-router';
import { RecordPage } from './RecordPage';
import { RecipePage } from './RecipePage';
import { IngredientPage } from './IngredientPage';
import { IngredientDetailPage } from './IngredientDetailPage';
import food from './route';

const FoodRoute = () => {
  return (
    <Routes>
      <Route path={food.record} element={<RecordPage />} />
      <Route path={food.recipe} element={<RecipePage />} />
      <Route path={food.ingredient.base} element={<IngredientPage />} />
      <Route path={food.ingredient.id} element={<IngredientDetailPage />} />
    </Routes>
  );
};

export default FoodRoute;
