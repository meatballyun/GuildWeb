import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Paper } from '../_layout/components';
import { useParams } from 'react-router';
import { Button, MaterialSymbol } from '../../components';
import { Block, IngredientValue, NutritionalSummaryChart } from './components';
import { Link } from 'react-router-dom';

export const IngredientDetailPage = () => {
  const params = useParams();
  const [ingredientDetail, setIngredientDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      const res = await api.food.getIngredientDetail({
        pathParams: { id: params.id },
      });
      const { data } = await res.json();
      setIsFetched(true);
      setIngredientDetail(data);
    })();
  }, [params.id]);

  if (!isFetched)
    return (
      <Paper row className="mt-4 flex p-8">
        loading
      </Paper>
    );

  const { kcal, carbs, pro, fats, unit } = ingredientDetail;

  return (
    <Paper row className="mt-4 flex p-8">
      {/* left panel */}
      <div className="flex w-full flex-col items-center justify-center gap-2 p-2">
        <div className="w-full border-b-2 border-b-primary-600 text-center text-heading-h1 text-primary-600">
          {ingredientDetail.name}
        </div>
        <div className="m-1 border-[20px] border-primary-200">
          <img
            className="max-h-[50vh]"
            src={ingredientDetail.imageUrl}
            alt=""
          />
        </div>
        <div className="flex justify-center gap-2">
          <Link to="/food/ingredient/edit/new" state={ingredientDetail}>
            <Button type="hollow" size="md" className="flex items-center gap-1">
              <MaterialSymbol icon="file_copy" fill />
              Copy
            </Button>
          </Link>
          <Link to={`/food/ingredient/edit/${params.id}`}>
            <Button type="hollow" size="md" className="flex items-center gap-1">
              <MaterialSymbol icon="edit" fill />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* right panel */}
      <div className="flex w-full flex-col">
        <Block title="Ingredient" className="mb-2">
          <div className="flex items-center">
            <div className="w-full pr-2">
              <div className="mb-2 mr-2 flex w-full rounded-sm bg-primary-200 px-4 py-1 text-paragraph-p2 text-primary-100">
                unit: <span className="ml-auto">{unit}</span>
              </div>
              <NutritionalSummaryChart
                className="mx-auto"
                size={240}
                total={kcal}
                carbs={carbs}
                pro={pro}
                fats={fats}
              >
                <div className="text-3xl">total</div>
                <div className="p-2 text-5xl">{kcal}</div>
                <div className="text-3xl">kcal</div>
              </NutritionalSummaryChart>
            </div>
            <div className="w-full border-l-2 border-l-primary-200">
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
            </div>
          </div>
        </Block>
        <Block title="Description" className="flex-1">
          <div className="text-paragraph-p3">
            {ingredientDetail.description}
          </div>
        </Block>
      </div>
    </Paper>
  );
};
