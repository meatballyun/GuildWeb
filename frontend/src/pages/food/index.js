import { Route, Routes } from 'react-router';
import { RecordPage } from './RecordPage';
import { FoodListPage } from './FoodListPage';
import { IngredientDetailPage } from './IngredientDetailPage';
import { IngredientEditPage } from './IngredientEditPage';
import food from './route';
import { RecipeDetailPage } from './RecipeDetailPage';
import { RecipeEditPage } from './RecipeEditPage';

const FoodRoute = () => {
  return (
    <Routes>
      <Route path={food.record} element={<RecordPage />} />
      <Route
        path={food.ingredient.base}
        element={<FoodListPage title="Ingredient" />}
      />
      <Route path={food.ingredient.id} element={<IngredientDetailPage />} />
      <Route path={food.ingredient.edit} element={<IngredientEditPage />} />

      <Route
        path={food.recipe.base}
        element={<FoodListPage title="Recipe" />}
      />
      <Route path={food.recipe.id} element={<RecipeDetailPage />} />
      <Route path={food.recipe.edit} element={<RecipeEditPage />} />
    </Routes>
  );
};

export default FoodRoute;
