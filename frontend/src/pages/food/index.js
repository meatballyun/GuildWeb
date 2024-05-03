import { Route, Routes } from 'react-router';
import { RecordPage } from './RecordPage';
import { FoodListPage } from './FoodListPage';
import { IngredientPage } from './IngredientPage';
import food from './route';
import { RecipePage } from './RecipePage';
import { OverviewPage } from './OverviewPage';

const FoodRoute = () => {
  return (
    <Routes>
      <Route path={food.base} element={<OverviewPage />} />
      <Route path={food.records} element={<RecordPage />} />
      <Route
        path={food.ingredients.base}
        element={<FoodListPage title="Ingredients" />}
      />
      <Route
        path={food.ingredients.id}
        element={<IngredientPage key="base" />}
      />
      <Route
        path={food.ingredients.edit}
        element={<IngredientPage key="edit" editMode />}
      />

      <Route
        path={food.recipes.base}
        element={<FoodListPage title="Recipes" />}
      />
      <Route path={food.recipes.id} element={<RecipePage key="base" />} />
      <Route
        path={food.recipes.edit}
        element={<RecipePage key="edit" editMode />}
      />
    </Routes>
  );
};

export default FoodRoute;
