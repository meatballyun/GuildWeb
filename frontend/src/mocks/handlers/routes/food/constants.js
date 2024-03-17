export const INGREDIENT = {
  name: '炸雞腿',
  imageUrl: '',
  description: '裹粉然後拿去炸ㄉ雞腿寶寶，熱量炸彈寶寶',
  unit: '100g',
  carbs: 7.2,
  pro: 120,
  fats: 108,
  kcal: 245,
};

export const RECIPE = {
  creator: {
    name: 'dida_0701',
    id: 1,
    imageUrl: null,
  },
  updateAt: '2024-03-16T17:34:22.991Z',
  name: '雞腿便當',
  description: '營養滿分又均衡好吃ㄉ一餐',
  kcal: 1234,
  unit: '一份',
  published: false,
  ingredients: [
    { ...INGREDIENT, count: 1.5 },
    { ...INGREDIENT, count: 1.5 },
    { ...INGREDIENT, count: 1.5 },
    { ...INGREDIENT, count: 1.5 },
  ],
};
