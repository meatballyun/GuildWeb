import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Paper, Block } from '../_layout/components';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  Button,
  Form,
  useFormInstance,
  MaterialSymbol,
  ImageUploader,
  Input,
  validate,
  Notification,
  useDialog,
} from '../../components';
import {
  IngredientValue,
  NutritionalSummaryChart,
  PublicButton,
} from './components';
import { TextArea } from '../../components/Form/TextArea';
import { Link } from 'react-router-dom';
import { classNames } from '../../utils';
import { useSideBar } from '../_layout/MainLayout/SideBar';

const ingredientDefaultValue = {
  carbs: 0,
  pro: 0,
  fats: 0,
  unit: '100g',
  description: '',
  image_url: '',
};
export const IngredientPage = ({ editMode = false }) => {
  useSideBar({ activeKey: ['foods', 'ingredients'] });
  const { promptDialog, dialog } = useDialog();
  const navigate = useNavigate();
  const location = useLocation();

  const params = useParams();
  const [ingredientDetail, setIngredientDetail] = useState(
    location.state
      ? { ...location.state, name: `${location.state.name}-copy` }
      : ingredientDefaultValue
  );
  const [isFetched, setIsFetched] = useState(false);

  const handleSubmit = async (formData) => {
    const requestBody = {
      ...formData,
      kcal: totalKcal,
    };
    let targetId = -1;
    try {
      if (params.id === 'new') {
        const res = await api.food.postIngredients({ body: requestBody });
        if (res.status !== 200) throw Error();
        const data = await res.json();
        targetId = data.data.id;
      } else {
        const res = await api.food.putIngredients({
          pathParams: {
            id: params.id,
          },
          body: requestBody,
        });
        if (res.status === 409) {
          promptDialog({
            header: 'Submit Error',
            description:
              'The ingredient is used in public recipes, so it cannot be adjusted to private',
            footButton: [{ type: 'hollow', text: 'OK' }],
          });
        }
        if (res.status !== 200) throw Error();
        targetId = params.id;
      }
      navigate(`/foods/ingredients/${targetId}`);
    } catch (error) {}
  };
  const nutritionalValidate = [
    (_, { carbs, pro, fats }) => {
      if ((!carbs || !+carbs) && (!pro || !+pro) && (!fats || !+fats))
        throw Error('one of carbs and pro and fats should not be empty');
      if (carbs > 1000 || pro > 1000 || fats > 1000)
        throw Error('carbs and pro and fats cannot over 1000');
      if (carbs < 0 || pro < 0 || fats < 0)
        throw Error('carbs and pro and fats cannot be less than 0');
    },
  ];
  const form = useFormInstance({
    defaultValue: ingredientDetail,
    validateObject: {
      name: [validate.required, validate.maxLimit(50)],
      unit: [validate.maxLimit(50)],
      nutation: nutritionalValidate,
    },
    onSubmit: handleSubmit,
  });
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
      const res = await api.food.getIngredientsDetail({
        pathParams: { id: params.id },
      });
      const { data } = await res.json();
      setIsFetched(true);
      setIngredientDetail(data);
    })();
  }, [params.id]);

  if (!isFetched) return <Paper row>loading</Paper>;

  return (
    <Form form={form} disabled={!editMode}>
      {dialog}
      <Paper row className="flex gap-2">
        {/* left panel */}
        <div className="flex w-full flex-col items-center justify-center gap-2 p-2">
          <Form.Item valueKey="name" className="w-full">
            <Input
              type="underline"
              inputClassName="text-center text-heading-h1 text-primary-600"
              placeholder="Enter Title"
            />
          </Form.Item>
          <div className="m-1 flex h-[50vh] w-full items-center overflow-hidden border-[20px] border-primary-200">
            <Form.Item valueKey="imageUrl" noStyle>
              <ImageUploader type="ingredient" />
            </Form.Item>
          </div>
          {/* foot button */}
          <div className="flex justify-center gap-2">
            <div className="border-r-2 border-r-primary-300 pr-2">
              <Form.Item valueKey="published" noStyle>
                <PublicButton />
              </Form.Item>
            </div>
            {editMode ? (
              <>
                <Button onClick={() => navigate(-1)} type="hollow" size="md">
                  Cancel
                </Button>
                <Button size="md" onClick={form.submit}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/foods/ingredients/edit/new"
                  state={{ ...ingredientDetail, published: false }}
                >
                  <Button
                    type="hollow"
                    size="md"
                    className="flex items-center gap-1"
                  >
                    <MaterialSymbol icon="file_copy" fill />
                    Copy
                  </Button>
                </Link>
                {ingredientDetail.isOwned && (
                  <Link to={`/foods/ingredients/edit/${params.id}`}>
                    <Button
                      size="md"
                      className="flex h-full items-center gap-1"
                    >
                      <MaterialSymbol icon="edit" fill />
                      Edit
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* right panel */}
        <div className="flex w-full flex-col">
          <Block title="Ingredient" className="mb-2">
            <div className="flex items-center">
              <div className="w-full pr-2">
                <div className="mb-2 mr-2 flex w-full items-center rounded-sm bg-primary-200 px-4 py-2 text-paragraph-p2 text-primary-100">
                  <span className="mr-1">unit:</span>
                  <Form.Item valueKey="unit" noStyle>
                    <Input
                      inputClassName={classNames(
                        'text-right',
                        !editMode && 'text-primary-100'
                      )}
                    />
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
                {form.validation?.nutation && (
                  <Notification.Error>
                    {form.validation.nutation}
                  </Notification.Error>
                )}
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
              <TextArea placeholder="text something..." className="p-0" />
            </Form.Item>
          </Block>
        </div>
      </Paper>
    </Form>
  );
};
