import { PROFILE_IMAGE_URL } from '../constants';

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
  name: 'Fried shrimp',
  id: 23,
  imageUrl: 'https://images.plurk.com/2M5Cw3v6Az9fU17RRxmIlQ.jpg',
  description: `"Fried shrimp" is a dish where shrimp is typically coated in flour or breadcrumbs and then deep-fried until golden and crispy. It's a popular seafood dish known for its crunchy texture and delicious flavor. Fried shrimp is often served with various dipping sauces such as chili sauce, sweet and sour sauce, or garlic aioli. It can be enjoyed as a main dish, appetizer, or snack.`,
  unit: '100g',
  carbs: 10.8,
  pro: 30,
  fats: 12,
  kcal: 245,
};

export const INGREDIENT_LIST = [INGREDIENT, INGREDIENT, INGREDIENT, INGREDIENT];

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
    imageUrl: PROFILE_IMAGE_URL,
  },
  id: 123,
  imageUrl: 'https://images.plurk.com/5urZ6NJeCnSTLyy1w5A27l.jpg',
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
  imageUrl: 'https://images.plurk.com/7bNYY08ndWsLYQSHRORr8H.jpg',
  foods: FOODS,
  ...getNutritionSum(FOODS),
};
