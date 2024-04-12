export const getNutritionSum = (
  valueList = [
    {
      carbs: 0,
      pro: 0,
      fats: 0,
      amount: 1,
    },
  ]
) => {
  const { carbs, pro, fats } = valueList.reduce(
    (pre, ingredient) =>
      Object.entries(pre)
        .filter(([key]) => ['carbs', 'pro', 'fats'].includes(key))
        .reduce(
          (pre, [key, value]) => ({
            ...pre,
            [key]: value + ingredient[key] * (ingredient.amount ?? 1),
          }),
          {}
        ),
    {
      carbs: 0,
      pro: 0,
      fats: 0,
    }
  );
  return {
    carbs: +carbs.toFixed(2),
    pro: +pro.toFixed(2),
    fats: +fats.toFixed(2),
    kcal: +(carbs * 4 + pro * 4 + fats * 9).toFixed(2),
  };
};
