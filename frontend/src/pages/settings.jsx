import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  ColumnBar,
  Form,
  ImageUploader,
  Input,
  MaterialSymbol,
  useFormInstance,
} from '../components';
import { Paper } from './_layout/components';
import { api } from '../api';
import { NutritionalSummaryChart } from './food/components';
import { useSideBar } from './_layout/MainLayout/SideBar';
import { useUserMe } from './_layout';

const hintText = `BMR (Basal Metabolic Rate) refers to the minimum energy your body needs at rest to maintain basic functions such as heart rate, breathing, and temperature regulation.
It's suggested that protein intake should account for 30% of your total daily calories. While you can adjust this percentage, note that 20% to 25% is the minimum required to promote muscle growth. Opting for a higher protein percentage may encourage you to consume cleaner foods and avoid junk food.`;

const NutationInput = ({
  value = 0,
  disabled,
  multiply,
  total,
  onChange,
  className,
}) => {
  return (
    <div className="flex gap-2 whitespace-nowrap border-b border-b-currentColor pb-1 text-paragraph-p3">
      <Input
        className="w-full"
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
      <span className={className}>
        {value * multiply} kcal /{' '}
        {((value * multiply * 100) / total).toFixed(2)} %
      </span>
    </div>
  );
};

export const SettingsPage = ({ editMode = false }) => {
  useSideBar({ activeKey: null });
  const { userMe, getUserMeData } = useUserMe();
  const form = useFormInstance({ defaultValue: userMe });
  const navigator = useNavigate();
  const { formData } = form;

  const totalKcal = (
    (formData?.carbs ?? 0) * 4 +
    (formData?.pro ?? 0) * 4 +
    (formData?.fats ?? 0) * 9
  ).toFixed(2);

  const handleSubmit = async () => {
    const res = await api.user.putUserMe({
      body: { ...formData, kcal: totalKcal },
    });
    if (res.status === 200) {
      getUserMeData();
      navigator('/settings');
    }
  };

  if (!userMe)
    return (
      <Paper row className="flex flex-col items-center justify-center">
        Loading...
      </Paper>
    );

  return (
    <Paper row className="flex flex-col items-center justify-center">
      <div className="mb-4 flex items-center">
        <div className="text-heading-h1 text-primary-500">
          Adventurer information
        </div>
        {editMode ? (
          <>
            <Link to="/settings">
              <Button type="hollow" className="ml-4" size="md">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} className="ml-4" size="md">
              Save
            </Button>
          </>
        ) : (
          <Link to="/settings/edit">
            <Button className="ml-4" size="md">
              Edit
            </Button>
          </Link>
        )}
      </div>
      <Form form={form} disabled={!editMode}>
        <div className=" h-full w-full overflow-auto">
          <div className="m-auto h-full w-full max-w-[680px]">
            {/* user information */}
            <div className="flex gap-4">
              <div className="h-[240px] w-[240px] border-[20px] border-primary-200">
                <Form.Item valueKey="imageUrl" noStyle>
                  <ImageUploader type="user" />
                </Form.Item>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Form.Item valueKey="name" label="NAME">
                  <Input type="underline" />
                </Form.Item>
                <Form.Item valueKey="email" label="E-MAIL">
                  <Input disabled type="underline" />
                </Form.Item>
                <div>
                  {editMode && (
                    <Button type="hollow" className="mt-2">
                      <MaterialSymbol icon="lock" fill size={20} />
                      Change Password
                    </Button>
                  )}
                </div>
                <div className="mt-auto">
                  <div className=" flex items-end gap-1">
                    <span className="mb-1 text-heading-h2">
                      Lv. {userMe.rank}
                    </span>
                    <div className="flex-1" />
                    <span className="text-base text-blue">{userMe.exp}</span>
                    <span className="text-primary-300">
                      {' '}
                      / {userMe.upgradeExp}
                    </span>
                  </div>
                  <ColumnBar
                    total={userMe.upgradeExp}
                    height={12}
                    items={[{ value: userMe.exp, color: '#4C76C7' }]}
                  />
                </div>
              </div>
            </div>
            <div className="relative mt-6 flex flex-col rounded-md border-2 border-primary-300 p-4">
              <div className="absolute -top-3 rounded-sm bg-primary-300 px-2 text-heading-h5 text-white">
                Target TDEE
              </div>

              <div className="mb-2 whitespace-pre-wrap rounded-md bg-primary-100 p-2 text-paragraph-p3 text-primary-300">
                <MaterialSymbol
                  className="mr-1 text-primary-300"
                  icon="info"
                  fill
                  size={18}
                />
                {hintText}
              </div>
              <div className="mt-4 flex">
                <div className="flex w-full flex-col gap-2">
                  <Form.Item
                    valueKey="carbs"
                    label={<span className="text-blue">Carbs. (g)</span>}
                  >
                    <NutationInput
                      className="text-blue"
                      multiply={4}
                      total={totalKcal}
                    />
                  </Form.Item>
                  <Form.Item
                    valueKey="pro"
                    label={<span className="text-green">Prot. (g)</span>}
                  >
                    <NutationInput
                      className="text-green"
                      multiply={4}
                      total={totalKcal}
                    />
                  </Form.Item>
                  <Form.Item
                    valueKey="fats"
                    label={<span className="text-orange">Fats (g)</span>}
                  >
                    <NutationInput
                      className="text-orange"
                      multiply={9}
                      total={totalKcal}
                    />
                  </Form.Item>
                </div>
                <NutritionalSummaryChart
                  className="mx-auto"
                  size={200}
                  total={totalKcal}
                  carbs={formData?.carbs}
                  pro={formData?.pro}
                  fats={formData?.fats}
                >
                  <div className="text-xl">total</div>
                  <div className="p-2 text-3xl">{totalKcal}</div>
                  <div className="text-xl">kcal</div>
                </NutritionalSummaryChart>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Paper>
  );
};
