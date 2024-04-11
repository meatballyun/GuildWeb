import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Paper } from '../_layout/components';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  BaseInput,
  Button,
  Form,
  useFormInstance,
  MaterialSymbol,
  ImageUploader,
} from '../../components';
import { Block, IngredientValue, NutritionalSummaryChart } from './components';
import { TextArea } from '../../components/Form/TextArea';

const PublicButton = ({ value, onChange }) => {
  if (value)
    return (
      <Button
        onClick={() => onChange(false)}
        type="hollow"
        size="md"
        className="flex items-center gap-1"
      >
        <MaterialSymbol icon="public" fill />
        Public
      </Button>
    );
  return (
    <Button
      onClick={() => onChange(true)}
      type="hollow"
      size="md"
      className="flex items-center gap-1"
    >
      <MaterialSymbol icon="lock" fill />
      Private
    </Button>
  );
};
const ingredientDefaultValue = {
  carbs: 0,
  pro: 0,
  fats: 0,
  unit: '100g',
  description: '',
  image_url: '',
};
export const IngredientEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = useParams();
  const [ingredientDetail, setIngredientDetail] = useState(
    location.state
      ? { ...location.state, name: `${location.state.name}-copy` }
      : ingredientDefaultValue
  );
  const [isFetched, setIsFetched] = useState(false);
  const form = useFormInstance({ defaultValue: ingredientDetail });
  const { formData } = form;
  const totalKcal = (
    (formData?.carbs ?? 0) * 4 +
    (formData?.pro ?? 0) * 4 +
    (formData?.fats ?? 0) * 9
  ).toFixed(2);

  useEffect(() => {
    if (!params.id || params.id === 'new') {
      setIsFetched(true);
      return;
    }
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

  const handleSubmit = async () => {
    const apiUtil =
      params.id === 'new'
        ? api.food.addNewIngredient
        : api.food.editIngredientDetail;
    const res = await apiUtil({
      body: {
        ...formData,
        kcal: totalKcal,
        id: params.id,
      },
    });
    if (res.status === 200) {
      const json = await res.json();
      const ingredientID = params.id === 'new' ? json.newId : params.id;
      navigate(`/food/ingredient/${ingredientID}`);
    }
  };

  if (!isFetched) return <Paper row>loading</Paper>;

  return (
    <Form form={form} onSubmit>
      <Paper row className="flex">
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
              <ImageUploader
                className="max-h-[50vh] min-h-20 w-full"
                type="ingredient"
              />
            </Form.Item>
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
          <Block title="Ingredient" className="mb-2">
            <div className="flex items-center">
              <div className="w-full pr-2">
                <div className="mb-2 mr-2 flex w-full justify-between rounded-sm bg-primary-200 px-4 py-1 text-paragraph-p2 text-primary-100">
                  <span className="mr-1">unit:</span>
                  <Form.Item valueKey="unit">
                    <BaseInput inputClassName="text-right" />
                  </Form.Item>
                </div>
                <NutritionalSummaryChart
                  className="mx-auto"
                  size={240}
                  total={totalKcal}
                  carbs={formData?.carbs}
                  pro={formData?.pro}
                  fats={formData?.fats}
                >
                  <div className="text-3xl">total</div>
                  <div className="p-2 text-5xl">{totalKcal}</div>
                  <div className="text-3xl">kcal</div>
                </NutritionalSummaryChart>
              </div>
              <div className="w-full border-l-2 border-l-primary-200">
                <Form.Item valueKey="carbs">
                  <IngredientValue
                    color="blue"
                    title="Carbs."
                    multiple={4}
                    total={totalKcal}
                  />
                </Form.Item>
                <Form.Item valueKey="pro">
                  <IngredientValue
                    color="green"
                    title="Prot."
                    multiple={4}
                    total={totalKcal}
                  />
                </Form.Item>
                <Form.Item valueKey="fats">
                  <IngredientValue
                    color="orange"
                    title="Fat"
                    multiple={9}
                    total={totalKcal}
                  />
                </Form.Item>
              </div>
            </div>
          </Block>
          <Block title="Description" className="flex-1">
            <Form.Item valueKey="description" noStyle>
              <TextArea
                placeholder="text something..."
                className="h-full w-full resize-none bg-primary-100 p-2 text-paragraph-p3"
              />
            </Form.Item>
          </Block>
        </div>
      </Paper>
    </Form>
  );
};
