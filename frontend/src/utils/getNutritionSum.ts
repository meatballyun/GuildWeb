type Nutation = 'carbs' | 'pro' | 'fats';
export const getNutritionSum = (
  valueList: {
    carbs?: number;
    pro?: number;
    fats?: number;
    amount?: number;
    [key: string]: any;
  }[]
) => {
  const { carbs, pro, fats } = valueList
    .filter(({ amount }) => amount && amount >= 0)
    .reduce(
      (pre, ingredient) =>
        Object.entries(pre)
          .filter(([key]) => ['carbs', 'pro', 'fats'].includes(key))
          .reduce(
            (pre, [key, value]) => ({
              ...pre,
              [key]:
                value +
                (ingredient[key as Nutation] ?? 0) * (ingredient.amount ?? 1),
            }),
            {} as Record<Nutation, number>
          ),
      {
        carbs: 0,
        pro: 0,
        fats: 0,
      }
    );

  const currentCarbs = +(carbs ?? 0);
  const currentPro = +(pro ?? 0);
  const currentFats = +(fats ?? 0);

  return {
    carbs: +currentCarbs.toFixed(2),
    pro: +currentPro.toFixed(2),
    fats: +currentFats.toFixed(2),
    kcal: +(currentCarbs * 4 + currentPro * 4 + currentFats * 9).toFixed(2),
  };
};
