const food = {
  base: '/',
  records: '/records',
  recipes: {
    base: '/recipes',
    id: '/recipes/:id',
    edit: '/recipes/edit/:id',
  },
  ingredients: {
    base: '/ingredients',
    id: '/ingredients/:id',
    edit: '/ingredients/edit/:id',
  },
};

export default food;
