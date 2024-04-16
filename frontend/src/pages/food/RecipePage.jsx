import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Paper, Block } from '../_layout/components';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  Button,
  Form,
  useFormInstance,
  ImageUploader,
  MaterialSymbol,
  Input,
} from '../../components';
import {
  FoodBar,
  IngredientValue,
  NutritionalSummaryChart,
  PublicButton,
} from './components';
import { TextArea } from '../../components/Form/TextArea';
import { getNutritionSum } from '../../utils';
import { AddIngredientModal } from './modal';
import { Link } from 'react-router-dom';

const IngredientList = ({ value: valueProp = [], disabled, onChange }) => {
  const handleCountChange = (id, value) => {
    const newValue = [...valueProp];
    const valueIndex = newValue.findIndex((val) => val.id === id);
    newValue[valueIndex].amount = value;
    onChange(newValue);
  };

  return valueProp
    .filter(({ amount }) => amount)
    .map(({ amount, id, ...ingredient }) => (
      <FoodBar
        {...ingredient}
        showChart={false}
        key={id}
        id={id}
        amount={
          disabled ? (
            amount
          ) : (
            <Input
              value={amount}
              onChange={(value) => handleCountChange(id, value)}
            />
          )
        }
        suffix={
          <MaterialSymbol
            icon="delete"
            onClick={() => handleCountChange(id, 0)}
          />
        }
      />
    ));
};

export const RecipePage = ({ editMode }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const [recipeDetail, setRecipeDetail] = useState(
    location.state
      ? { ...location.state, name: `${location.state.name}-copy` }
      : {
          unit: '100 g',
          description: '',
          public: false,
        }
  );
  const [isFetched, setIsFetched] = useState(false);
  const form = useFormInstance({ defaultValue: recipeDetail });
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
      const { data } = await res.json();
      setIsFetched(true);
      setRecipeDetail(data);
    })();
  }, [params.id]);

  const handleSubmit = async () => {
    const apiUtil =
      params.id === 'new' ? api.food.addNewRecipe : api.food.editRecipeDetail;
    const res = await apiUtil({
      body: { ...formData, carbs, pro, fats, kcal, id: params.id },
    });
    if (res.status === 200) {
      const json = await res.json();
      navigate(`/food/recipe/${json.data.id ?? params.id}`);
    }
  };

  const handleModalClose = (newItem) => {
    setOpenModal(false);
    if (!newItem) return;
    const newItemIndex =
      formData.ingredients?.findIndex(({ id }) => id === newItem.id) ?? -1;
    const newIngredients = Array.isArray(formData.ingredients)
      ? [...formData.ingredients]
      : [];

    if (newItemIndex !== -1) {
      newIngredients[newItemIndex].amount++;
      handleInputChange('ingredients', newIngredients);
      return;
    }

    handleInputChange('ingredients', [
      ...newIngredients,
      { ...newItem, amount: 1 },
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
      <Form form={form} onSubmit disabled={!editMode}>
        <Paper row className="flex gap-2">
          {/* left panel */}
          <div className="flex w-full flex-col items-center justify-center gap-2 p-2">
            <div className="w-full border-b-2 border-b-primary-600 text-center text-heading-h1 text-primary-600">
              <Form.Item valueKey="name">
                <Input
                  inputClassName="text-center text-heading-h1 text-primary-600"
                  placeholder="enter title..."
                />
              </Form.Item>
            </div>
            <div className="m-1 flex h-[50vh] w-full items-center overflow-hidden border-[20px] border-primary-200">
              <Form.Item valueKey="imageUrl" noStyle>
                <ImageUploader type="ingredient" />
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
                carbs={carbs}
                pro={pro}
                fats={fats}
              >
                <div className="text-sm">total</div>
                <div className="-my-1 text-xl">{kcal}</div>
                <div className="text-sm">kcal</div>
              </NutritionalSummaryChart>
              <div className="flex flex-col items-start text-paragraph-p2">
                <div className="mb-4 rounded-sm bg-primary-300 px-2 py-1 text-primary-100">
                  Unit:
                </div>
                <Form.Item valueKey="unit">
                  <Input className="w-24" />
                </Form.Item>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {editMode ? (
                <>
                  <div className="border-r-2 border-r-primary-300 pr-2">
                    <Form.Item valueKey="public" noStyle>
                      <PublicButton />
                    </Form.Item>
                  </div>
                  <Button onClick={() => navigate(-1)} type="hollow" size="md">
                    Cancel
                  </Button>
                  <Button size="md" onClick={handleSubmit}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/food/recipe/edit/new" state={recipeDetail}>
                    <Button
                      type="hollow"
                      size="md"
                      className="flex items-center gap-1"
                    >
                      <MaterialSymbol icon="file_copy" fill />
                      Copy
                    </Button>
                  </Link>
                  <Link to={`/food/recipe/edit/${params.id}`}>
                    <Button
                      size="md"
                      className="flex h-full items-center gap-1"
                    >
                      <MaterialSymbol icon="edit" fill />
                      Edit
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* right panel */}
          <div className="flex w-full flex-col">
            <Block
              title={
                <div>
                  Ingredient
                  {editMode && (
                    <Button
                      className="float-right"
                      onClick={() => setOpenModal(true)}
                    >
                      + Add
                    </Button>
                  )}
                </div>
              }
              className="mb-2 flex-1"
            >
              <div className="flex w-full flex-col items-center gap-1">
                <Form.Item valueKey="ingredients" noStyle>
                  <IngredientList />
                </Form.Item>
              </div>
            </Block>
            <Block title="Description" className="flex flex-1">
              <Form.Item valueKey="description" noStyle>
                <TextArea placeholder="text something..." className="p-0" />
              </Form.Item>
            </Block>
          </div>
        </Paper>
      </Form>
      <AddIngredientModal isOpen={openModal} onClose={handleModalClose} />
    </>
  );
};
