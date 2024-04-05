import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Paper } from '../_layout/components';
import { useNavigate, useParams } from 'react-router';
import {
  BaseInput,
  Button,
  Form,
  useFormInstance,
  ImageUploader,
  MaterialSymbol,
} from '../../components';
import {
  Block,
  FoodBar,
  IngredientValue,
  NutritionalSummaryChart,
  PublicButton,
} from './components';
import { TextArea } from '../../components/Form/TextArea';
import { getNutritionSum } from '../../utils';
import { AddIngredientModal } from './AddIngredientModal';

const IngredientList = ({ value: valueProp = [], onChange }) => {
  const handleRemove = (index) => {
    console.log(
      index,
      valueProp.filter((v, i) => i === index)
    );
    onChange(valueProp.filter((v, i) => i !== index));
  };

  const handleCountChange = (index, value) => {
    const newValue = [...valueProp];
    newValue[index].count = value;
    onChange(newValue);
  };

  return valueProp.map(({ count, ...ingredient }, i) => (
    <FoodBar
      {...ingredient}
      showChart={false}
      count={
        <BaseInput
          className="bg-white"
          value={count}
          onChange={(value) => handleCountChange(i, value)}
        />
      }
      suffix={<MaterialSymbol icon="delete" onClick={() => handleRemove(i)} />}
    />
  ));
};

export const RecipeEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [ingredientDetail, setIngredientDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);
  const form = useFormInstance({ defaultValue: ingredientDetail });
  const { formData, handleInputChange } = form;
  const { carbs, pro, fats, kcal } = getNutritionSum(formData.ingredients);

  useEffect(() => {
    if (!params.id || params.id === 'new') {
      setIsFetched(true);
      return;
    }
    (async () => {
      setIsFetched(false);
      const res = await api.food.getRecipeDetail({
        pathParams: { id: params.id },
      });
      const data = await res.json();
      setIsFetched(true);
      setIngredientDetail(data);
    })();
  }, [params.id]);

  const handleSubmit = async () => {
    const apiUtil =
      params.id === 'new' ? api.food.addNewRecipe : api.food.editRecipeDetail;
    const res = await apiUtil({ body: { ...formData, id: params.id } });
    if (res.status === 200) {
      const json = res.json();
      navigate(`/food/recipe/${json.newId ?? json.editId}`);
    }
  };
  const handleModalClose = (newItem) => {
    setOpenModal(false);
    if (!newItem) return;
    handleInputChange('ingredients', [
      ...formData.ingredients,
      { ...newItem, count: 1 },
    ]);
  };

  if (!isFetched)
    return (
      <Paper row className="mt-4 flex p-8">
        loading
      </Paper>
    );

  return (
    <>
      <Form form={form} onSubmit>
        <Paper row className="mt-4 flex p-8">
          {/* left panel */}
          <div className="flex w-full flex-col items-center justify-center gap-2 p-2">
            <div className="w-full border-b-2 border-b-primary-600 text-center text-heading-h1 text-primary-600">
              <Form.Item valueKey="name">
                <BaseInput
                  className="bg-primary-100 px-2 !text-center"
                  placeholder="enter title..."
                />
              </Form.Item>
            </div>
            <div className="m-1 flex w-full items-center overflow-hidden border-[20px] border-primary-200">
              <Form.Item valueKey="imageUrl">
                <ImageUploader className="max-h-[50vh] min-h-20 w-full" />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <IngredientValue
                color="blue"
                title="Carbs."
                multiple={4}
                value={carbs}
                total={kcal}
              />
              <IngredientValue
                color="green"
                title="Prot."
                multiple={4}
                value={pro}
                total={kcal}
              />
              <IngredientValue
                color="orange"
                title="Fat"
                multiple={9}
                value={fats}
                total={kcal}
              />

              <NutritionalSummaryChart
                className="mx-auto"
                size={140}
                total={kcal}
                carbs={formData?.carbs}
                pro={formData?.pro}
                fats={formData?.fats}
              >
                <div className="text-sm">total</div>
                <div className="-my-1 text-xl">{kcal}</div>
                <div className="text-sm">kcal</div>
              </NutritionalSummaryChart>
            </div>
            <div className="flex justify-center gap-2">
              <div className="border-r-2 border-r-primary-300 pr-2">
                <Form.Item valueKey="public">
                  <PublicButton />
                </Form.Item>
              </div>
              <Button onClick={() => navigate(-1)} type="hollow" size="md">
                Cancel
              </Button>
              <Button size="md" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </div>

          {/* right panel */}
          <div className="flex w-full flex-col">
            <Block
              title={
                <div>
                  Ingredient{' '}
                  <Button
                    className="float-right"
                    onClick={() => setOpenModal(true)}
                  >
                    + Add
                  </Button>
                </div>
              }
              className="mb-2 flex-1"
            >
              <div className="flex  flex-col items-center gap-1">
                <Form.Item valueKey="ingredients">
                  <IngredientList />
                </Form.Item>
              </div>
            </Block>
            <Block title="Description" className="flex-1">
              <Form.Item valueKey="description">
                <TextArea
                  placeholder="text something..."
                  className="h-full w-full resize-none bg-primary-100 p-2 text-paragraph-p2"
                />
              </Form.Item>
            </Block>
          </div>
        </Paper>
      </Form>
      <AddIngredientModal isOpen={openModal} onClose={handleModalClose} />
    </>
  );
};
