import { Route, Routes } from 'react-router';
import { RecordPage } from './RecordPage';
import { FoodListPage } from './FoodListPage';
import { IngredientPage } from './IngredientPage';
import food from './route';
import { RecipePage } from './RecipePage';

const FoodRoute = () => {
  return (
    <Routes>
      <Route path={food.record} element={<RecordPage />} />
      <Route
        path={food.ingredient.base}
        element={<FoodListPage title="Ingredient" />}
      />
      <Route
        path={food.ingredient.id}
        element={<IngredientPage key="base" />}
      />
      <Route
        path={food.ingredient.edit}
        element={<IngredientPage key="edit" editMode />}
      />

      <Route
        path={food.recipe.base}
        element={<FoodListPage title="Recipe" />}
      />
      <Route path={food.recipe.id} element={<RecipePage key="base" />} />
      <Route
        path={food.recipe.edit}
        element={<RecipePage key="edit" editMode />}
      />
    </Routes>
  );
};

export default FoodRoute;
