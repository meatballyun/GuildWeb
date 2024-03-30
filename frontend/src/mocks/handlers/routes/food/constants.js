const getNutritionSum = (
  valueList = [
    {
      carbs: 0,
      pro: 0,
      fats: 0,
    },
  ]
) => {
  const { carbs, pro, fats } = valueList.reduce(
    (pre, ingredient) =>
      Object.entries(pre).reduce(
        (pre, [key, value]) => ({
          ...pre,
          [key]: value + ingredient[key],
        }),
        {}
      ),
    {
      carbs: 0,
      pro: 0,
      fats: 0,
    }
  );
  return { carbs, pro, fats, kcal: carbs * 4 + pro * 4 + fats * 9 };
};

export const INGREDIENT = {
  name: '炸雞腿',
  id: 23,
  imageUrl: '',
  description: '裹粉然後拿去炸ㄉ雞腿寶寶，熱量炸彈寶寶',
  unit: '100g',
  carbs: 10.8,
  pro: 30,
  fats: 12,
  kcal: 245,
};

const INGREDIENTS = [
  { ...INGREDIENT, count: 1.5 },
  { ...INGREDIENT, count: 1.5 },
  { ...INGREDIENT, count: 1.5 },
  { ...INGREDIENT, count: 1.5 },
];

export const RECIPE = {
  creator: {
    name: 'dida_0701',
    id: 1,
    imageUrl: null,
  },
  id: 123,
  updateAt: '2024-03-30T17:34:22.991Z',
  name: 'Chicken Leg Bento',
  description: '營養滿分又均衡好吃ㄉ一餐',
  unit: 'a portion',
  published: false,
  ingredients: INGREDIENTS,
  ...getNutritionSum(INGREDIENTS),
};

const FOODS = [
  { ...RECIPE, count: 1 },
  { ...RECIPE, count: 1 },
  { ...RECIPE, count: 1 },
  { ...RECIPE, count: 1 },
];

export const DAILY_FOOD = {
  target: {
    carbs: 155,
    pro: 183,
    fats: 53,
    kcal: 2000,
  },
  foods: FOODS,
  ...getNutritionSum(FOODS),
};
