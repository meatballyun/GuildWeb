import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Paper } from '../_layout/components';
import { useParams } from 'react-router';
import { Button, MaterialSymbol } from '../../components';
import {
  Block,
  FoodBar,
  IngredientValue,
  NutritionalSummaryChart,
} from './components';
import { Link } from 'react-router-dom';

export const RecipeDetailPage = () => {
  const params = useParams();
  const [recipeDetail, setRecipeDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      const res = await api.food.getRecipeDetail({
        pathParams: { id: params.id },
      });
      const { data } = await res.json();
      setIsFetched(true);
      setRecipeDetail(data);
    })();
  }, [params.id]);

  if (!isFetched)
    return (
      <Paper row className="mt-4 flex p-8">
        loading
      </Paper>
    );
  const { kcal, carbs, pro, fats, ingredients } = recipeDetail;

  return (
    <Paper row className="mt-4 flex p-8">
      {/* left panel */}
      <div className="flex w-full flex-col items-center justify-center gap-2 p-2">
        <div className="w-full border-b-2 border-b-primary-600 text-center text-heading-h1 text-primary-600">
          {recipeDetail.name}
        </div>
        <div className="m-1 border-[20px] border-primary-200">
          <img className="max-h-[50vh]" src={recipeDetail.imageUrl} alt="" />
        </div>
        <div className="flex gap-2">
          <IngredientValue
            color="blue"
            title="Carbs."
            value={carbs}
            multiple={4}
            total={kcal}
          />
          <IngredientValue
            color="green"
            title="Prot."
            value={pro}
            multiple={4}
            total={kcal}
          />
          <IngredientValue
            color="orange"
            title="Fat"
            value={fats}
            multiple={9}
            total={kcal}
          />

          <NutritionalSummaryChart
            className="mx-auto"
            size={140}
            total={kcal}
            carbs={carbs}
            pro={pro}
            fats={fats}
          >
            <div className="text-sm">total</div>
            <div className="-my-1 text-xl">{kcal}</div>
            <div className="text-sm">kcal</div>
          </NutritionalSummaryChart>
        </div>
        <div className="flex justify-center gap-2">
          <Button type="hollow" size="md" className="flex items-center gap-1">
            <MaterialSymbol icon="file_copy" fill />
            Copy
          </Button>
          <Link to={`/food/recipe/edit/${params.id}`}>
            <Button type="hollow" size="md" className="flex items-center gap-1">
              <MaterialSymbol icon="edit" fill />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* right panel */}
      <div className="flex w-full flex-col">
        <Block title="Ingredient" className="mb-2 flex-1">
          <div className="flex  flex-col items-center gap-1">
            {ingredients.map((ingredient) => (
              <Link
                className="w-full"
                to={`/food/ingredient/${params.id}`}
                key={ingredient.id}
              >
                <FoodBar {...ingredient} />
              </Link>
            ))}
          </div>
        </Block>
        <Block title="Description" className="flex-1">
          <div className="text-paragraph-p3">{recipeDetail.description}</div>
        </Block>
      </div>
    </Paper>
  );
};
